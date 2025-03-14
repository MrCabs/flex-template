import * as Flex from '@twilio/flex-ui';

import AnnouncementButton from '../../custom-components/AnnouncementButton';
// import { isConferenceEnabledWithoutNativeXWT } from '../../config';


import { FlexComponent } from '../../../../types/feature-loader';






export const componentName = FlexComponent.CallCanvasActions;
export const componentHook = function addAnnouncementButtonToCallCanvasActions(flex: typeof Flex) {
//   if (!isConferenceEnabledWithoutNativeXWT()) return;
  flex.CallCanvasActions.Content.add(<AnnouncementButton key="announcementButton" />, { sortOrder: 0 });
};