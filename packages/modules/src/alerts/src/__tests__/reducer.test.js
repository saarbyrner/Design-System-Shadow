import {
  alerts as alertsReducer,
  appStatus as appStatusReducer,
} from '../reducer';
import alertsDummyData from '../../resources/alertDummyData';

describe('Alerts reducer', () => {
  const resetAlert = {
    id: null,
    name: '',
    alert_training_variables: [
      {
        condition: 'less_than',
        id: null,
        training_variable_id: null,
        value: null,
      },
    ],
    training_variable_ids: [],
    notification_recipient_ids: [],
    notification_message: '',
    active: true,
  };

  const defaultState = {
    alertList: alertsDummyData,
    openModal: 'none',
    currentAlert: {
      id: null,
      name: '',
      alert_training_variables: [
        {
          condition: 'less_than',
          id: null,
          training_variable_id: null,
          value: null,
        },
      ],
      training_variable_ids: [],
      notification_recipient_ids: [],
      notification_message: '',
      active: true,
    },
    staticData: {
      squads: {
        data: [],
        isLoading: false,
        hasErrored: false,
      },
    },
  };

  it('returns correct state on OPEN_ALERT_MODAL for editing', () => {
    const initialState = { ...defaultState };
    const editAction = {
      type: 'OPEN_ALERT_MODAL',
      payload: { alertId: null, type: 'edit' },
    };

    const nextState = alertsReducer(initialState, editAction);

    expect(nextState).toEqual({
      ...initialState,
      openModal: 'edit',
      currentAlert: { ...resetAlert },
    });
  });

  it('returns correct state on OPEN_ALERT_MODAL for duplicating', () => {
    const initialState = { ...defaultState };
    const duplicateAction = {
      type: 'OPEN_ALERT_MODAL',
      payload: { alertId: null, type: 'duplicate' },
    };

    const nextState = alertsReducer(initialState, duplicateAction);

    expect(nextState).toEqual({
      ...initialState,
      openModal: 'duplicate',
      currentAlert: { ...resetAlert },
    });
  });

  it('returns correct state on CLOSE_ALERT_MODAL', () => {
    const action = { type: 'CLOSE_ALERT_MODAL' };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState).toEqual({
      ...defaultState,
      openModal: 'none',
      currentAlert: { ...resetAlert },
    });
  });

  it('returns correct state on SELECT_ALERT_USERS when selecting a user', () => {
    const action = {
      type: 'SELECT_ALERT_USERS',
      payload: { userItem: { id: '1234', checked: true } },
    };

    const nextState = alertsReducer(defaultState, action);

    expect(nextState.currentAlert.notification_recipient_ids).toEqual([1234]);
  });

  it('returns correct state on SELECT_ALERT_USERS when deselecting a user', () => {
    const initialState = {
      ...defaultState,
      currentAlert: {
        ...defaultState.currentAlert,
        notification_recipient_ids: [1234, 5678],
      },
    };
    const action = {
      type: 'SELECT_ALERT_USERS',
      payload: { userItem: { id: '1234', checked: false } },
    };

    const nextState = alertsReducer(initialState, action);

    expect(nextState.currentAlert.notification_recipient_ids).toEqual([5678]);
  });

  it('returns correct state on SELECT_ALERT_VARIABLES when selecting a variable', () => {
    const action = {
      type: 'SELECT_ALERT_VARIABLES',
      payload: { variableItem: { id: '14', checked: true } },
    };

    const nextState = alertsReducer(defaultState, action);

    expect(nextState.currentAlert.training_variable_ids).toEqual([14]);
  });

  it('returns correct state on SELECT_ALERT_VARIABLES when deselecting a variable', () => {
    const initialState = {
      ...defaultState,
      currentAlert: {
        ...defaultState.currentAlert,
        training_variable_ids: [14, 15],
      },
    };
    const action = {
      type: 'SELECT_ALERT_VARIABLES',
      payload: { variableItem: { id: '14', checked: false } },
    };
    const nextState = alertsReducer(initialState, action);

    expect(nextState.currentAlert.training_variable_ids).toEqual([15]);
  });

  it('returns correct state on UPDATE_ALERT_VARIABLES', () => {
    const action = {
      type: 'UPDATE_ALERT_VARIABLES',
      payload: { variableId: '14', index: 0 },
    };
    const nextState = alertsReducer(defaultState, action);
    const expectedVariable = {
      ...defaultState.currentAlert.alert_training_variables[0],
      training_variable_id: 14,
    };

    expect(nextState.currentAlert.alert_training_variables[0]).toEqual(
      expectedVariable
    );
  });

  it('returns correct state on UPDATE_VARIABLE_CONDITION', () => {
    const action = {
      type: 'UPDATE_VARIABLE_CONDITION',
      payload: { conditionId: 'greater_than', index: 0 },
    };
    const nextState = alertsReducer(defaultState, action);
    const expectedVariable = {
      ...defaultState.currentAlert.alert_training_variables[0],
      condition: 'greater_than',
    };

    expect(nextState.currentAlert.alert_training_variables[0]).toEqual(
      expectedVariable
    );
  });

  it('returns correct state on UPDATE_VARIABLE_UNIT', () => {
    const action = {
      type: 'UPDATE_VARIABLE_UNIT',
      payload: { unitValue: '111', index: 0 },
    };
    const nextState = alertsReducer(defaultState, action);
    const expectedVariable = {
      ...defaultState.currentAlert.alert_training_variables[0],
      value: 111,
    };

    expect(nextState.currentAlert.alert_training_variables[0]).toEqual(
      expectedVariable
    );
  });

  it('returns correct state on UPDATE_ALERT_NAME', () => {
    const action = {
      type: 'UPDATE_ALERT_NAME',
      payload: { alertName: 'new alert name' },
    };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState.currentAlert.name).toEqual('new alert name');
  });

  it('returns correct state on UPDATE_ALERT_MESSAGE', () => {
    const action = {
      type: 'UPDATE_ALERT_MESSAGE',
      payload: { alertMessage: 'new alert message' },
    };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState.currentAlert.notification_message).toEqual(
      'new alert message'
    );
  });

  it('returns correct state on ADD_NEW_VARIABLE', () => {
    const action = { type: 'ADD_NEW_VARIABLE' };
    const initialState = {
      ...defaultState,
      currentAlert: {
        ...defaultState.currentAlert,
        alert_training_variables: [{ id: 1, condition: 'equals', value: 1 }],
      },
    };
    const nextState = alertsReducer(initialState, action);

    expect(nextState.currentAlert.alert_training_variables).toHaveLength(2);
    expect(nextState.currentAlert.alert_training_variables[1]).toEqual({
      condition: 'less_than',
      id: null,
      training_variable_id: null,
      value: null,
    });
  });

  it('returns correct state on DELETE_VARIABLE', () => {
    const initialState = {
      ...defaultState,
      currentAlert: {
        ...defaultState.currentAlert,
        alert_training_variables: [
          { id: 1, condition: 'equals' },
          { id: 2, condition: 'less_than' },
        ],
      },
    };
    const action = { type: 'DELETE_VARIABLE', payload: { index: 0 } };
    const nextState = alertsReducer(initialState, action);

    expect(nextState.currentAlert.alert_training_variables).toHaveLength(1);
    expect(nextState.currentAlert.alert_training_variables[0].id).toEqual(2);
  });

  it('returns correct state on FETCH_ALERTS', () => {
    const newAlertList = [{ id: 1234 }, { id: 2345 }];
    const action = {
      type: 'FETCH_ALERTS',
      payload: { alertList: newAlertList },
    };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState.alertList).toEqual(newAlertList);
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const initialState = {
      ...defaultState,
      currentAlert: { name: 'Old Alert' },
    };
    const action = { type: 'HIDE_APP_STATUS' };
    const nextState = alertsReducer(initialState, action);

    expect(nextState.currentAlert).toEqual(resetAlert);
  });

  it('returns correct state on SHOW_CONFIRM_DELETE_ALERT', () => {
    const alertToShow = { id: 123, name: 'Alert to Delete' };
    const action = {
      type: 'SHOW_CONFIRM_DELETE_ALERT',
      payload: { alert: alertToShow },
    };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState.currentAlert).toEqual(alertToShow);
  });

  it('returns the correct state for IS_LOADING_SQUADS', () => {
    const action = { type: 'IS_LOADING_SQUADS' };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState.staticData.squads.isLoading).toBe(true);
    expect(nextState.staticData.squads.hasErrored).toBe(false);
  });

  it('returns the correct state for SQUADS_HAS_ERRORED', () => {
    const action = { type: 'SQUADS_HAS_ERRORED' };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState.staticData.squads.isLoading).toBe(false);
    expect(nextState.staticData.squads.hasErrored).toBe(true);
  });

  it('returns the correct state for SQUAD_SUCCESS', () => {
    const MOCK_SQUADS = [{ id: 1, name: 'Squad 1' }];
    const action = { type: 'SQUAD_SUCCESS', payload: { squads: MOCK_SQUADS } };
    const nextState = alertsReducer(defaultState, action);

    expect(nextState.staticData.squads).toEqual({
      data: MOCK_SQUADS,
      isLoading: false,
      hasErrored: false,
    });
  });
});

describe('AppStatus reducer', () => {
  const defaultState = { message: null, status: null };

  it('returns correct state on SERVER_REQUEST', () => {
    const action = { type: 'SERVER_REQUEST' };
    const nextState = appStatusReducer(defaultState, action);

    expect(nextState).toEqual({ status: 'loading', message: null });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const initialState = { status: 'success', message: 'Some message' };
    const action = { type: 'HIDE_APP_STATUS' };
    const nextState = appStatusReducer(initialState, action);

    expect(nextState).toEqual({ status: null, message: null });
  });

  it('returns correct state on SHOW_CONFIRM_DELETE_ALERT', () => {
    const action = {
      type: 'SHOW_CONFIRM_DELETE_ALERT',
      payload: { alert: { name: 'Screening Alert' } },
    };
    const nextState = appStatusReducer(defaultState, action);

    expect(nextState).toEqual({
      status: 'confirm',
      message: 'Are you sure you want to delete the alert Screening Alert?',
    });
  });

  it('returns correct state on SAVE_ALERT_FAILURE', () => {
    const action = { type: 'SAVE_ALERT_FAILURE' };
    const nextState = appStatusReducer(defaultState, action);

    expect(nextState).toEqual({ status: 'error', message: null });
  });

  it('returns correct state on EDIT_ALERT_ACTIVITY_FAILURE', () => {
    const action = { type: 'EDIT_ALERT_ACTIVITY_FAILURE' };
    const nextState = appStatusReducer(defaultState, action);

    expect(nextState).toEqual({ status: 'error', message: null });
  });

  it('returns correct state on SAVE_ALERT_SUCCESS', () => {
    const action = { type: 'SAVE_ALERT_SUCCESS' };
    const nextState = appStatusReducer(defaultState, action);

    expect(nextState).toEqual({
      status: 'success',
      message: 'Alert saved successfully',
    });
  });

  it('returns correct state on EDIT_ALERT_ACTIVITY_SUCCESS (activated)', () => {
    const action = {
      type: 'EDIT_ALERT_ACTIVITY_SUCCESS',
      payload: { isActive: true },
    };
    const nextState = appStatusReducer(defaultState, action);

    expect(nextState).toEqual({
      status: 'success',
      message: 'Alert activated successfully',
    });
  });

  it('returns correct state on EDIT_ALERT_ACTIVITY_SUCCESS (deactivated)', () => {
    const action = {
      type: 'EDIT_ALERT_ACTIVITY_SUCCESS',
      payload: { isActive: false },
    };
    const nextState = appStatusReducer(defaultState, action);

    expect(nextState).toEqual({
      status: 'success',
      message: 'Alert deactivated successfully',
    });
  });
});
