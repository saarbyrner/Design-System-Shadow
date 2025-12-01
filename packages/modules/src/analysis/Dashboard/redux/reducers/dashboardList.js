/* eslint-disable flowtype/require-valid-file-annotation */
const defaultState = [];

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'UPDATE_DASHBOARD': {
      return state.map((dashboard) => {
        if (dashboard.id === action.payload.dashboard.id) {
          return action.payload.dashboard;
        }
        return dashboard;
      });
    }
    default:
      return state;
  }
}
