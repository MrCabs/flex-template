const ACTION_ANNOUNCEMENT_REC_STATUS = "SET_ANNOUNCEMENT_STATUS";

const initialState = { status: null };

export class Actions {
  static setAnnouncementStatus = (status:any) => ({
    type: ACTION_ANNOUNCEMENT_REC_STATUS,
    payload: status,
  });
}

export function reduce(state = initialState, action:any) {
  switch (action.type) {
    case ACTION_ANNOUNCEMENT_REC_STATUS:
      return { ...state, status: action.payload };
    default:
      return state;
  }
}
