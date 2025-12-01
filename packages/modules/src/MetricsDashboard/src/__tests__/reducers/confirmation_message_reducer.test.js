import confirmationMessage from '../../reducers/confirmation_message_reducer';

describe('ConfirmationMessage reducer', () => {
  test('updates state correctly on SHOW_CONFIRMATION', () => {
    const initialState = {
      show: false,
      action: null,
      message: '',
    };
    const expected = {
      show: true,
      action: 'test',
      message: 'test message',
    };

    const action = {
      type: 'SHOW_CONFIRMATION',
      payload: {
        action: 'test',
        message: 'test message',
      },
    };

    const nextState = confirmationMessage(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('resets state on HIDE_CONFIRMATION', () => {
    const initialState = {
      show: true,
      action: () => {},
      message: 'test message',
    };
    const expected = {
      show: false,
      action: () => {},
      message: '',
    };

    const action = {
      type: 'HIDE_CONFIRMATION',
    };

    const nextState = confirmationMessage(initialState, action);
    expect(nextState.show).toBe(expected.show);
    expect(nextState.message).toBe(expected.message);
  });
});
