import { checkedVariables, variables, templateData } from '../reducer';
import { buildVariables, buildVariable } from './test_utils';

describe('Questionnaire manager state', () => {
  describe('checkedVariables reducer', () => {
    it('returns correct state on TOGGLE_VARIABLES when removing a variable', () => {
      const athleteId = 123;
      const currentVariableId = 'tv_2';
      const initialState = {
        [athleteId]: {
          tv_1: true,
          tv_2: true,
          tv_3: true,
        },
      };
      const action = {
        type: 'TOGGLE_VARIABLES',
        payload: {
          athleteId,
          currentVariableId,
        },
      };

      const nextState = checkedVariables(initialState, action);
      expect(nextState).toEqual({
        [athleteId]: {
          tv_1: true,
          tv_2: false,
          tv_3: true,
        },
      });
    });

    it('returns correct state on TOGGLE_VARIABLES when adding a variable', () => {
      const athleteId = 123;
      const currentVariableId = 'tv_4';
      const initialState = {
        [athleteId]: {
          tv_1: true,
          tv_2: false,
          tv_3: true,
          tv_4: false,
        },
      };
      const action = {
        type: 'TOGGLE_VARIABLES',
        payload: {
          athleteId,
          currentVariableId,
        },
      };

      const nextState = checkedVariables(initialState, action);
      expect(nextState).toEqual({
        [athleteId]: {
          tv_1: true,
          tv_2: false,
          tv_3: true,
          tv_4: true,
        },
      });
    });

    it('returns correct state on TOGGLE_ALL_VARIABLES when some variables are checked', () => {
      const athleteId = 123;
      const variablesList = [
        buildVariable('msk', 'tv_1'),
        buildVariable('msk', 'tv_2'),
        buildVariable('msk', 'tv_3'),
        buildVariable('msk', 'tv_4'),
      ];
      const initialState = {
        [athleteId]: {
          tv_1: true,
          tv_2: true,
          tv_3: true,
          tv_4: true,
          tv_5: true, // This one is not in the visible list
        },
      };
      const action = {
        type: 'TOGGLE_ALL_VARIABLES',
        payload: {
          athleteId,
          variables: variablesList,
        },
      };

      const nextState = checkedVariables(initialState, action);
      // it turns off all the variables except the one non visible
      expect(nextState).toEqual({
        [athleteId]: {
          tv_1: false,
          tv_2: false,
          tv_3: false,
          tv_4: false,
          tv_5: true,
        },
      });
    });

    it('returns correct state on TOGGLE_ALL_VARIABLES when none of the visible variables are checked', () => {
      const athleteId = 123;
      const variablesList = [
        buildVariable('msk', 'tv_1'),
        buildVariable('msk', 'tv_2'),
        buildVariable('msk', 'tv_3'),
        buildVariable('msk', 'tv_4'),
      ];
      const initialState = {
        [athleteId]: {
          tv_5: true, // This one is not in the visible list
        },
      };
      const action = {
        type: 'TOGGLE_ALL_VARIABLES',
        payload: {
          athleteId,
          variables: variablesList,
        },
      };

      const nextState = checkedVariables(initialState, action);
      // it turns on all the variables and keeps the non-visible variable on
      expect(nextState).toEqual({
        [athleteId]: {
          tv_1: true,
          tv_2: true,
          tv_3: true,
          tv_4: true,
          tv_5: true,
        },
      });
    });

    it('returns the correct state on CLEAR_ALL_VISIBLE_VARIABLES', () => {
      const initialState = {
        10: { tv_80: true, tv_60: true, tv_90: true },
        20: { tv_80: false, tv_60: true, tv_90: true },
        30: { tv_80: true, tv_60: true, tv_90: true },
        40: { tv_80: true, tv_60: true, tv_90: true },
      };

      const action = {
        type: 'CLEAR_ALL_VISIBLE_VARIABLES',
        payload: {
          athleteIds: ['10', '30'],
          variableIds: ['tv_80', 'tv_60'],
        },
      };

      const nextState = checkedVariables(initialState, action);
      expect(nextState).toEqual({
        10: { tv_80: false, tv_60: false, tv_90: true },
        20: { tv_80: false, tv_60: true, tv_90: true },
        30: { tv_80: false, tv_60: false, tv_90: true },
        40: { tv_80: true, tv_60: true, tv_90: true },
      });
    });
  });

  describe('variables reducer', () => {
    it('returns correct state on SET_PLATFORM', () => {
      const dummyVariables = {
        msk: buildVariables(3),
        well_being: buildVariables(5),
      };
      const platform = 'msk';
      const initialState = {
        byPlatform: dummyVariables,
        selectedPlatform: 'well_being', // Start with a different platform
        currentlyVisible: dummyVariables.well_being,
      };
      const action = {
        type: 'SET_PLATFORM',
        payload: {
          platform,
        },
      };

      const nextState = variables(initialState, action);
      expect(nextState).toEqual({
        byPlatform: dummyVariables,
        selectedPlatform: platform,
        currentlyVisible: dummyVariables[platform],
      });
    });
  });

  describe('templateData reducer', () => {
    const initialState = {
      id: 0,
      name: '',
      last_edited_by: '',
      last_edited_at: '',
      active: false,
      platforms: [],
      mass_input: false,
      show_warning_message: false,
    };

    it('returns the correct state on SET_MASS_INPUT', () => {
      const action = {
        type: 'SET_MASS_INPUT',
        payload: {
          isMassInput: true,
        },
      };
      const nextState = templateData(initialState, action);
      expect(nextState).toEqual({
        ...initialState,
        mass_input: true,
      });
    });

    it('returns the correct state on SET_SHOW_WARNING_MESSAGE', () => {
      const action = {
        type: 'SET_SHOW_WARNING_MESSAGE',
        payload: {
          showWarningMessage: true,
        },
      };
      const nextState = templateData(initialState, action);
      expect(nextState).toEqual({
        ...initialState,
        show_warning_message: true,
      });
    });
  });
});
