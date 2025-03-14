import React, { useState, useEffect } from 'react';
import {
  Notifications,
  TaskHelper,
  IconButton,
  Manager,
  withTaskContext,
  ITask
} from '@twilio/flex-ui';
import { Theme } from '@twilio-paste/core/theme';
import { Select, Option, OptionGroup } from '@twilio-paste/core/select';
import { Label } from '@twilio-paste/core/label';
import { useSelector, useDispatch } from 'react-redux';
import { getRecordings } from '../config';
// Adjust these imports based on your actual file structure
import { Actions as AnnouncementStatusActions } from '../flex-hooks/states/InitialState';
import _SpielOptions from './SpielOptions';

// Constants
const INVALID_CONF_STATUS = "InvalidConfStatus";
const ANNOUNCEMENT_ERROR = "AnnouncementError";
const ANNOUNCEMENT_RUNTIME_FUNCTION_URL = "https://announcement-2772.twil.io/announcement";

// Button state interfaces
interface ButtonState {
  icon: string;
  color: string;
  backgroundColor: string;
  label: string;
  disabled: boolean;
}

interface AnnouncementButtonProps {
  task?: ITask;
  setAnnouncementStatus?: (status: string) => void;
}

const AnnouncementButton: React.FC<AnnouncementButtonProps> = ({ task }) => {
  // Get worker business unit from Flex state
  const workerBusinessUnit = Manager.getInstance().store.getState().flex
    ?.worker?.attributes?.business_unit;

  // Button states
  const pauseState: ButtonState = {
    icon: "Hold",
    color: "black",
    backgroundColor: "darkgrey",
    label: "Resume",
    disabled: true,
  };

  const loadingState: ButtonState = {
    icon: "Loading",
    color: "black",
    backgroundColor: "darkgrey",
    label: "Loading",
    disabled: true,
  };

  const initialState: ButtonState = {
    icon: "ArrowRight",
    color: "white",
    backgroundColor: "rgb(25, 118, 210)",
    label: "Play",
    disabled: true,
  };

  // Component state
  const [buttonState, setButtonState] = useState<ButtonState>({ ...initialState });
  const [selected, setSelected] = useState<string | null>(null);
  const [spielOptions, setSpielOptions] = useState<Record<string, string[]> | null>(null);

  // Redux state
  const dispatch = useDispatch();
  const announcementStatus = useSelector(
    (state: { announcement?: { recording?: { status?: string } } }) => state.announcement?.recording?.status
  );

  // Initialize spiel options based on business unit
  useEffect(() => {
      setSpielOptions(_SpielOptions);
  }, [workerBusinessUnit]);

  const handleAnnounceButtonClick = async () => {
    try {
      if (!selected) return; // Do nothing if no spiel brand is selected
      if (!task) return; // Do nothing if no task is provided

      const { status, conferenceSid } = task.conference || {};

      if (status == "active") {
        console.log(      "tokennn",  Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token);
        setButtonState({ ...loadingState });

        const body = new URLSearchParams();
        body.append("conferenceSid", conferenceSid || "");
        body.append("brand", selected);
        body.append(
          "Token",
          Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token
        );

        const options = {
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        };

        await fetch(`${ANNOUNCEMENT_RUNTIME_FUNCTION_URL}`, options);

        // Update button state
        setButtonState({
          ...initialState,
          disabled: false,
        });

        // Update Redux state if needed
        if (dispatch) {
          dispatch(AnnouncementStatusActions.setAnnouncementStatus("completed"));
        }
      } else {
        setButtonState({ ...initialState, disabled: false });
        Notifications.showNotification(INVALID_CONF_STATUS);
      }
    } catch (e) {
      setButtonState({ ...initialState, disabled: false });
      Notifications.showNotification(ANNOUNCEMENT_ERROR);
    }
  };

  const handleDropDownOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      setSelected(event.target.value);
      setButtonState((prevState) => ({
        ...prevState,
        disabled: false,
      }));
    }
  };

  // Check if we should disable the button
  const isLiveCall = task ? TaskHelper.isLiveCall(task) : false;
  const isTaskAccepted = task ? TaskHelper.isTaskAccepted(task) : false;
  const isCallOnHold = task ? TaskHelper.isCallOnHold(task) : false;
  const isInWrapupMode = task ? TaskHelper.isInWrapupMode(task) : false;
  const disabledIconState = buttonState.label.includes("Loading") || buttonState.label.includes("Resume");

  // Return null if no spielOptions are available
  if (!spielOptions) {
    return null;
  }

  return (
    <section style={{
      display: "flex",
      width: "100%",
      justifyContent: "center"
    }}>
    <Theme.Provider theme="dark" >
      <div
        style={{
          display: "flex",
          width: "100%",
          padding: "1.5em 0"
        }}>
        <div style={{  minWidth: "300px"}}>
          <Label htmlFor="spielselect">Select Spiel to Play</Label>
          <Select
            value={selected || ""}
            onChange={handleDropDownOptionChange}
            id="spielselect"
            name="spielselect"
            aria-label="Select a spiel to play"
          >
            <Option value="" disabled>
              Select Spiel
            </Option>
            {getRecordings().map((val, key) => (
              <Option key={key} value={val.url}>
                {val.name}
              </Option>
            ))}
          
              
          </Select>
        </div>
        <IconButton
          icon={buttonState.icon}
          key="announcement_button"
          style={{
            alignSelf: "flex-end",
            color: buttonState.color,
            backgroundColor: buttonState.backgroundColor,
            width: "2.3rem",
            height: "2.3rem",
            marginLeft: "1em",
          }}
          disabled={
            !isLiveCall ||
            !isTaskAccepted ||
            isCallOnHold ||
            isInWrapupMode ||
            disabledIconState ||
            buttonState.disabled
          }
          title={buttonState.label}
          onClick={handleAnnounceButtonClick}
        />
      </div>
    </Theme.Provider>
    </section>
  );
};

// Export the component
export default withTaskContext(AnnouncementButton);
