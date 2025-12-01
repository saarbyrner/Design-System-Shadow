import alarmsModal from '../../reducers/alarm_modal_reducer';

describe('Alarms modal reducer', () => {
  test('returns correct state on SHOW_MODAL action', () => {
    const initialState = {
      isVisible: false,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const action = {
      type: 'SHOW_MODAL',
      modalType: 'alarms',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on CONFIRM_CLOSE_MODAL action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: 'confirm',
      changesMade: false,
    };

    const action = {
      type: 'CONFIRM_CLOSE_MODAL',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on CANCEL_CLOSE_MODAL action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const action = {
      type: 'CANCEL_CLOSE_MODAL',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on HIDE_CURRENT_MODAL action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      modalMessage: 'Are you sure you want to delete all alarms?',
      changesMade: false,
      confirmActionId: 'deleteAllAlarms',
    };

    const expected = {
      isVisible: false,
      modalStatus: null,
      modalMessage: 'Are you sure you want to exit before saving?',
      changesMade: false,
      confirmActionId: 'hideModal',
    };

    const action = {
      type: 'HIDE_CURRENT_MODAL',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ADD_ALARM_DEFINITION_FOR_STATUS action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'ADD_ALARM_DEFINITION_FOR_STATUS',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on DELETE_ALARM_DEFINITION_FOR_STATUS action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'DELETE_ALARM_DEFINITION_FOR_STATUS',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_CONDITION action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'SET_ALARM_CONDITION',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_VALUE action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'SET_ALARM_VALUE',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ADD_ENTIRE_SQUAD_TO_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'ADD_ENTIRE_SQUAD_TO_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ADD_POSITION_TO_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'ADD_POSITION_TO_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ADD_POSITION_GROUP_TO_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'ADD_POSITION_GROUP_TO_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ADD_ATHLETE_TO_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'ADD_ATHLETE_TO_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on REMOVE_ENTIRE_SQUAD_FROM_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'REMOVE_ENTIRE_SQUAD_FROM_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on REMOVE_POSITION_FROM_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'REMOVE_POSITION_FROM_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on REMOVE_POSITION_GROUP_FROM_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'REMOVE_POSITION_GROUP_FROM_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on REMOVE_ATHLETE_FROM_ALARM action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'REMOVE_ATHLETE_FROM_ALARM',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SAVE_ALARM_DEFINITIONS_REQUEST action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      modalMessage: 'Are you sure you want to delete all alarms?',
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: 'loading',
      modalMessage: 'Saving...',
      changesMade: false,
    };

    const action = {
      type: 'SAVE_ALARM_DEFINITIONS_REQUEST',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SAVE_ALARM_DEFINITIONS_SUCCESS action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: 'success',
      changesMade: false,
      modalMessage: 'Success',
    };

    const action = {
      type: 'SAVE_ALARM_DEFINITIONS_SUCCESS',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SAVE_ALARM_DEFINITIONS_FAILURE action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: 'error',
      changesMade: false,
    };

    const action = {
      type: 'SAVE_ALARM_DEFINITIONS_FAILURE',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_TYPE action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'SET_ALARM_TYPE',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_CALCULATION action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'SET_ALARM_CALCULATION',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_PERCENTAGE action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'SET_ALARM_PERCENTAGE',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_PERIOD_SCOPE action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      changesMade: false,
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      changesMade: true,
    };

    const action = {
      type: 'SET_ALARM_PERIOD_SCOPE',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on CONFIRM_DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      modalMessage: 'Are you sure you want to exit before saving?',
      changesMade: false,
      confirmActionId: 'hideModal',
    };

    const expected = {
      isVisible: true,
      modalStatus: 'warning',
      modalMessage: 'Delete all alarms?',
      changesMade: false,
      confirmActionId: 'deleteAllAlarms',
    };

    const action = {
      type: 'CONFIRM_DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS action', () => {
    const initialState = {
      isVisible: true,
      modalStatus: null,
      modalMessage: 'Are you sure you want to delete all alarms?',
      changesMade: false,
      confirmActionId: 'deleteAllAlarms',
    };

    const expected = {
      isVisible: true,
      modalStatus: null,
      modalMessage: 'Are you sure you want to exit before saving?',
      changesMade: true,
      confirmActionId: 'hideModal',
    };

    const action = {
      type: 'DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
    };

    const nextState = alarmsModal(initialState, action);
    expect(nextState).toEqual(expected);
  });
});
