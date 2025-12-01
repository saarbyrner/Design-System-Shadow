import { server, rest } from '@kitman/services/src/mocks/server';
import { waitFor } from '@testing-library/react';

import {
  closeAlertModal,
  openAlertModal,
  selectAlertUsers,
  selectAlertVariables,
  editAlert,
  createAlert,
  serverRequest,
  fetchAlerts,
  deleteAlert,
  editAlertActivity,
  showConfirmDeleteAlert,
  updateAlertName,
  updateAlertMessage,
  updateAlertVariables,
  updateVariableCondition,
  updateVariableUnit,
  addNewVariable,
  deleteVariable,
  isLoadingSquads,
  squadsHasErrored,
  squadSuccess,
  duplicateAlert,
  saveAlertSuccess,
  saveAlertFailure,
  deleteAlertSuccess,
  deleteAlertFailure,
  duplicateAlertSuccess,
  duplicateAlertFailure,
  hideAppStatus,
  editAlertActivitySuccess,
  editAlertActivityFailure,
} from '../actions';

describe('Alerts Actions', () => {
  describe('Sync Action Creators', () => {
    it('creates the correct action for OPEN_ALERT_MODAL', () => {
      const expectedAction = {
        type: 'OPEN_ALERT_MODAL',
        payload: { alertId: 1234, type: 'edit' },
      };
      expect(openAlertModal(1234, 'edit')).toEqual(expectedAction);
    });

    it('creates the correct action for CLOSE_ALERT_MODAL', () => {
      const expectedAction = { type: 'CLOSE_ALERT_MODAL' };
      expect(closeAlertModal()).toEqual(expectedAction);
    });

    it('creates the correct action for SELECT_ALERT_USERS', () => {
      const userItem = { id: '1234', checked: true };
      const expectedAction = {
        type: 'SELECT_ALERT_USERS',
        payload: { userItem },
      };
      expect(selectAlertUsers(userItem)).toEqual(expectedAction);
    });

    it('creates the correct action for SELECT_ALERT_VARIABLES', () => {
      const variableItem = { id: 'kitman:tv|game', checked: true };
      const expectedAction = {
        type: 'SELECT_ALERT_VARIABLES',
        payload: { variableItem },
      };
      expect(selectAlertVariables(variableItem)).toEqual(expectedAction);
    });

    it('creates the correct action for UPDATE_ALERT_VARIABLES', () => {
      const expectedAction = {
        type: 'UPDATE_ALERT_VARIABLES',
        payload: {
          variableId: '1234',
          index: 0,
        },
      };
      expect(updateAlertVariables('1234', 0)).toEqual(expectedAction);
    });

    it('creates the correct action for UPDATE_VARIABLE_CONDITION', () => {
      const expectedAction = {
        type: 'UPDATE_VARIABLE_CONDITION',
        payload: {
          conditionId: 'greater_than',
          index: 0,
        },
      };
      expect(updateVariableCondition('greater_than', 0)).toEqual(
        expectedAction
      );
    });

    it('creates the correct action for UPDATE_VARIABLE_UNIT', () => {
      const expectedAction = {
        type: 'UPDATE_VARIABLE_UNIT',
        payload: {
          unitValue: '111',
          index: 0,
        },
      };
      expect(updateVariableUnit('111', 0)).toEqual(expectedAction);
    });

    it('creates the correct action for UPDATE_ALERT_NAME', () => {
      const expectedAction = {
        type: 'UPDATE_ALERT_NAME',
        payload: { alertName: 'new alert name' },
      };
      expect(updateAlertName('new alert name')).toEqual(expectedAction);
    });

    it('creates the correct action for UPDATE_ALERT_MESSAGE', () => {
      const expectedAction = {
        type: 'UPDATE_ALERT_MESSAGE',
        payload: {
          alertMessage: 'new alert message',
        },
      };
      expect(updateAlertMessage('new alert message')).toEqual(expectedAction);
    });

    it('creates the correct action for ADD_NEW_VARIABLE', () => {
      const expectedAction = {
        type: 'ADD_NEW_VARIABLE',
      };
      expect(addNewVariable()).toEqual(expectedAction);
    });

    it('creates the correct action for DELETE_VARIABLE', () => {
      const expectedAction = {
        type: 'DELETE_VARIABLE',
        payload: {
          index: 1,
        },
      };
      expect(deleteVariable(1)).toEqual(expectedAction);
    });

    it('creates the correct action for SHOW_CONFIRM_DELETE_ALERT', () => {
      const mockAlert = { id: 123, name: 'Test Alert' };
      const expectedAction = {
        type: 'SHOW_CONFIRM_DELETE_ALERT',
        payload: {
          alert: mockAlert,
        },
      };
      expect(showConfirmDeleteAlert(mockAlert)).toEqual(expectedAction);
    });

    it('creates the correct action for DELETE_ALERT_FAILURE', () => {
      const expectedAction = {
        type: 'DELETE_ALERT_FAILURE',
      };
      expect(deleteAlertFailure()).toEqual(expectedAction);
    });

    it('creates the correct action for IS_LOADING_SQUADS', () => {
      const expectedAction = {
        type: 'IS_LOADING_SQUADS',
      };
      expect(isLoadingSquads()).toEqual(expectedAction);
    });

    it('creates the correct action for SQUADS_HAS_ERRORED', () => {
      const expectedAction = {
        type: 'SQUADS_HAS_ERRORED',
      };
      expect(squadsHasErrored()).toEqual(expectedAction);
    });

    it('has the correct action SQUAD_SUCCESS', () => {
      const MOCK_SQUADS = [
        { id: 1, name: 'Squad 1' },
        { id: 2, name: 'Squad 2' },
      ];
      const expectedAction = {
        type: 'SQUAD_SUCCESS',
        payload: { squads: MOCK_SQUADS },
      };
      expect(squadSuccess(MOCK_SQUADS)).toEqual(expectedAction);
    });
  });

  describe('Async Thunks', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
      // Use fake timers to control setTimeout in actions
      jest.useFakeTimers();
    });

    afterEach(() => {
      // Restore real timers
      jest.useRealTimers();
    });

    describe('createAlert', () => {
      it('dispatches the correct sequence on successful API call', async () => {
        const mockAlert = { id: 1, name: 'Test' };
        const mockResponse = { athlete_alerts: [mockAlert] };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.post('/alerts', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(mockResponse));
          })
        );

        createAlert()(dispatch, getState);

        // Wait for all async dispatches to complete
        await waitFor(() => {
          // The thunk dispatches 4 actions before the timeout
          expect(dispatch).toHaveBeenCalledTimes(4);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, closeAlertModal());
        expect(dispatch).toHaveBeenNthCalledWith(
          3,
          fetchAlerts(mockResponse.athlete_alerts)
        );
        expect(dispatch).toHaveBeenNthCalledWith(4, saveAlertSuccess());

        // Fast-forward time to trigger the setTimeout
        jest.runAllTimers();
        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch).toHaveBeenNthCalledWith(5, hideAppStatus());
      });

      it('dispatches SAVE_ALERT_FAILURE on failed API call', async () => {
        const mockAlert = { id: 1, name: 'Test' };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.post('/alerts', (req, res, ctx) => {
            return res(ctx.status(500));
          })
        );

        createAlert()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(2);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, saveAlertFailure());
      });
    });

    describe('editAlert', () => {
      it('dispatches the correct sequence on successful API call', async () => {
        const mockAlert = { id: 1234, name: 'Test' };
        const mockResponse = { athlete_alerts: [mockAlert] };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.put('/alerts/1234', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(mockResponse));
          })
        );

        editAlert()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(4);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, closeAlertModal());
        expect(dispatch).toHaveBeenNthCalledWith(
          3,
          fetchAlerts(mockResponse.athlete_alerts)
        );
        expect(dispatch).toHaveBeenNthCalledWith(4, saveAlertSuccess());
      });

      it('dispatches SAVE_ALERT_FAILURE on failed API call', async () => {
        const mockAlert = { id: 1234, name: 'Test' };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.put('/alerts/1234', (req, res, ctx) => {
            return res(ctx.status(500));
          })
        );

        editAlert()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(2);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, saveAlertFailure());
      });
    });

    describe('editAlertActivity', () => {
      it('dispatches the correct sequence on successful API call', async () => {
        const mockAlert = { id: 1234, name: 'Test', active: true };
        const mockResponse = {
          athlete_alerts: [{ ...mockAlert, active: false }],
        };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.put('/alerts/1234', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(mockResponse));
          })
        );

        editAlertActivity(mockAlert)(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(3);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          fetchAlerts(mockResponse.athlete_alerts)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
          3,
          editAlertActivitySuccess(false)
        );
      });

      it('dispatches EDIT_ALERT_ACTIVITY_FAILURE on failed API call', async () => {
        const mockAlert = { id: 1234, name: 'Test', active: true };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.put('/alerts/1234', (req, res, ctx) => {
            return res(ctx.status(500));
          })
        );

        editAlertActivity(mockAlert)(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(2);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, editAlertActivityFailure());
      });
    });

    describe('deleteAlert', () => {
      it('dispatches the correct sequence on successful API call', async () => {
        const mockAlert = { id: 1234, name: 'Test' };
        const mockResponse = { athlete_alerts: [] };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.delete('/alerts/1234', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(mockResponse));
          })
        );

        deleteAlert()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(3);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(
          2,
          fetchAlerts(mockResponse.athlete_alerts)
        );
        expect(dispatch).toHaveBeenNthCalledWith(3, deleteAlertSuccess());
      });

      it('dispatches DELETE_ALERT_FAILURE on failed API call', async () => {
        const mockAlert = { id: 1234, name: 'Test' };
        getState.mockReturnValue({ alerts: { currentAlert: mockAlert } });
        server.use(
          rest.delete('/alerts/1234', (req, res, ctx) => {
            return res(ctx.status(500));
          })
        );

        deleteAlert()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(2);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, deleteAlertFailure());
      });
    });

    describe('duplicateAlert', () => {
      it('sends correct body and dispatches the correct sequence on success', async () => {
        const mockAlert = { id: 1234, name: 'Test' };
        const squadIdsToDuplicate = [1, 2];
        // Corrected: The getState mock must include the full path accessed by the action.
        getState.mockReturnValue({
          alerts: {
            currentAlert: mockAlert,
            staticData: {
              squads: {
                data: [],
              },
            },
          },
        });
        server.use(
          rest.post('/alerts/1234/duplicate', async (req, res, ctx) => {
            const body = await req.json();
            expect(body.squad_ids).toEqual(squadIdsToDuplicate);
            return res(ctx.status(200), ctx.json({}));
          })
        );

        duplicateAlert(squadIdsToDuplicate)(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(3);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, closeAlertModal());
        expect(dispatch).toHaveBeenNthCalledWith(2, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(3, duplicateAlertSuccess());
      });

      it('dispatches DUPLICATE_ALERT_FAILURE with specific message on duplicate name error', async () => {
        const mockAlert = { id: 1234, name: 'Test' };
        const squadIdsToDuplicate = [1, 2];
        const errorResponse = {
          message: 'duplicate_name',
          squad_ids: [1, 2],
        };
        const mockSquads = [
          { id: 1, name: 'Squad Name 1' },
          { id: 2, name: 'Squad Name 2' },
        ];

        getState.mockReturnValue({
          alerts: {
            currentAlert: mockAlert,
            staticData: { squads: { data: mockSquads } },
          },
        });
        server.use(
          rest.post('/alerts/1234/duplicate', (req, res, ctx) => {
            return res(ctx.status(400), ctx.json(errorResponse));
          })
        );

        duplicateAlert(squadIdsToDuplicate)(dispatch, getState);

        const expectedMessage =
          'An alert with this name exists in the following squads: Squad Name 1, Squad Name 2';

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledTimes(3);
        });

        expect(dispatch).toHaveBeenNthCalledWith(1, closeAlertModal());
        expect(dispatch).toHaveBeenNthCalledWith(2, serverRequest());
        expect(dispatch).toHaveBeenNthCalledWith(
          3,
          duplicateAlertFailure(expectedMessage)
        );
      });
    });
  });
});
