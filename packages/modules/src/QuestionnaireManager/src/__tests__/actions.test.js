import { server, rest } from '@kitman/services/src/mocks/server';
import { waitFor } from '@testing-library/react';
import { buildAthlete } from '@kitman/common/src/utils/test_utils';
import {
  toggleVariable,
  toggleAllVariables,
  setPlatform,
  saveQuestionnaire,
  hideCurrentModal,
  saveQuestionnaireRequest,
  saveQuestionnaireSuccess,
  saveQuestionnaireFailure,
  clearAllVisibleVariables,
  setSquadFilter,
  showDialogue,
  hideDialogue,
} from '../actions';
import { buildVariables } from './test_utils';

describe('Questionnaire Manager actions', () => {
  describe('Sync Action Creators', () => {
    it('creates the correct action to toggle a single variable', () => {
      const action = toggleVariable(1, 'tv_2');
      expect(action).toEqual({
        type: 'TOGGLE_VARIABLES',
        payload: {
          athleteId: 1,
          currentVariableId: 'tv_2',
        },
      });
    });

    it('creates the correct action to toggle all variables for an athlete', () => {
      const variables = buildVariables(3);
      const action = toggleAllVariables(1, variables);
      expect(action).toEqual({
        type: 'TOGGLE_ALL_VARIABLES',
        payload: {
          athleteId: 1,
          variables,
        },
      });
    });

    it('creates the correct action for SET_PLATFORM', () => {
      const action = setPlatform('msk');
      expect(action).toEqual({
        type: 'SET_PLATFORM',
        payload: {
          platform: 'msk',
        },
      });
    });

    it('creates the correct action for SAVE_QUESTIONNAIRE_REQUEST', () => {
      expect(saveQuestionnaireRequest()).toEqual({
        type: 'SAVE_QUESTIONNAIRE_REQUEST',
      });
    });

    it('creates the correct action to hide the current modal', () => {
      expect(hideCurrentModal()).toEqual({
        type: 'HIDE_CURRENT_MODAL',
      });
    });

    it('creates the correct action to set the squad filter', () => {
      const action = setSquadFilter('1');
      expect(action).toEqual({
        type: 'SET_SQUAD_FILTER',
        payload: {
          squadId: '1',
        },
      });
    });

    it('creates the correct action to show a dialogue', () => {
      const action = showDialogue('warning_example');
      expect(action).toEqual({
        type: 'SHOW_DIALOGUE',
        payload: {
          dialogue: 'warning_example',
        },
      });
    });
  });

  describe('Async Thunks', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    describe('clearAllVisibleVariables', () => {
      it('dispatches the correct actions with the correct athlete and variable ids', () => {
        const state = {
          athletes: {
            currentlyVisible: {
              group_1: [buildAthlete({ id: '10' })],
              group_2: [buildAthlete({ id: '11' })],
            },
          },
          variables: {
            currentlyVisible: [{ id: 'tv_90', key: 'msk', name: 'TV1' }],
          },
        };
        getState.mockReturnValue(state);

        clearAllVisibleVariables()(dispatch, getState);

        expect(dispatch).toHaveBeenCalledWith({
          type: 'CLEAR_ALL_VISIBLE_VARIABLES',
          payload: {
            athleteIds: ['10', '11'],
            variableIds: ['tv_90'],
          },
        });
        expect(dispatch).toHaveBeenCalledWith(hideDialogue());
      });
    });

    describe('saveQuestionnaire', () => {
      beforeEach(() => {
        jest.useFakeTimers();
        // Mock the CSRF token meta tag required by the $.ajax call in the action
        document.head.innerHTML =
          '<meta name="csrf-token" content="mock-token">';
      });
      afterEach(() => {
        jest.useRealTimers();
      });

      it('dispatches success actions and hides modal on successful save', async () => {
        const checkedVariables = {
          1: { tv_3: true, tv_4: true, tv_5: true, tv_6: false },
        };
        const templateData = { mass_input: false, show_warning_message: false };
        getState.mockReturnValue({ checkedVariables, templateData });

        // Corrected: Use window.history.pushState to reliably set the URL for the test
        window.history.pushState({}, 'Test page', '/some-path');

        server.use(
          rest.put('/some-path', (req, res, ctx) => res(ctx.status(200)))
        );

        saveQuestionnaire()(dispatch, getState);

        // The first action is dispatched synchronously
        expect(dispatch).toHaveBeenCalledWith(saveQuestionnaireRequest());

        // Wait for the async part of the thunk to complete
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(saveQuestionnaireSuccess());
        });

        // Fast-forward timers to trigger the setTimeout
        jest.runAllTimers();
        expect(dispatch).toHaveBeenCalledWith(hideCurrentModal());
        expect(dispatch).toHaveBeenCalledTimes(3);
      });

      it('dispatches failure action on failed save', async () => {
        const checkedVariables = { 1: { tv_3: true } };
        const templateData = { mass_input: false, show_warning_message: false };
        getState.mockReturnValue({ checkedVariables, templateData });

        // Corrected: Use window.history.pushState
        window.history.pushState({}, 'Test page', '/some-path');

        server.use(
          rest.put('/some-path', (req, res, ctx) => res(ctx.status(500)))
        );

        saveQuestionnaire()(dispatch, getState);

        // Wait for the async failure action
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(saveQuestionnaireFailure());
        });

        // Ensure success was not called
        expect(dispatch).not.toHaveBeenCalledWith(saveQuestionnaireSuccess());
      });

      it('shows empty questionnaire warning if no variables are checked', () => {
        const checkedVariables = {
          1: { tv_3: false },
          2: { tv_4: false },
        };
        const templateData = {};
        getState.mockReturnValue({ checkedVariables, templateData });

        saveQuestionnaire()(dispatch, getState);

        expect(dispatch).toHaveBeenCalledWith(showDialogue('empty_warning'));
        expect(dispatch).not.toHaveBeenCalledWith(saveQuestionnaireRequest());
      });
    });
  });
});
