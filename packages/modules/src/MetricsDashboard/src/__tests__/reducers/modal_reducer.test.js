import modal from '../../reducers/modal_reducer';

describe('modal reducer', () => {
  test('updates modalType and modalProps on SHOW_MODAL', () => {
    const initialState = {
      modalType: null,
      modalProps: {},
    };
    const expected = {
      modalType: 'alarms',
      modalProps: { test: 'prop' },
    };
    const action = {
      type: 'SHOW_MODAL',
      modalType: 'alarms',
      modalProps: { test: 'prop' },
    };

    const nextState = modal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('sets modalType and modalProps to empty on HIDE_CURRENT_MODAL', () => {
    const initialState = {
      modalType: 'alarms',
      modalProps: { test: 'prop' },
    };
    const expected = {
      modalType: null,
      modalProps: {},
    };
    const action = {
      type: 'HIDE_CURRENT_MODAL',
    };

    const nextState = modal(initialState, action);
    expect(nextState).toEqual(expected);
  });
});
