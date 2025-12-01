import { showCancelConfirm, hideAppStatus } from '../appStatus';

describe('appStatus actions', () => {
  it('has the correct action SHOW_CANCEL_CONFIRM', () => {
    const expectedAction = {
      type: 'SHOW_CANCEL_CONFIRM',
    };

    expect(showCancelConfirm()).toEqual(expectedAction);
  });

  it('has the correct action HIDE_APP_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    expect(hideAppStatus()).toEqual(expectedAction);
  });
});
