// @flow
import intersection from 'lodash/intersection';
import {
  convertQuestionnaireVariablesToIdArray,
  variablesHashToArray,
} from './utils';
import type { Action } from '../types/actions';
import type { State } from '../types/state';

const defaultVariablesState = {
  byId: {},
  byPlatform: {},
  currentlyVisible: [],
  selectedPlatform: 'msk',
};

const defaultAthleteState = {
  all: [],
  grouped: {},
  currentlyVisible: {},
  groupBy: 'availability',
  squadFilter: null,
};

const defaultSquadOptionsState = {
  squads: [],
  selectedSquad: '',
};

const defaultTemplateDataState = {
  id: 0,
  name: '',
  last_edited_by: '',
  last_edited_at: '',
  active: false,
  platforms: [],
  mass_input: false,
  show_warning_message: false,
};

const variables = (
  state: $PropertyType<State, 'variables'> = defaultVariablesState,
  action: Action
): $PropertyType<State, 'variables'> => {
  switch (action.type) {
    case 'SET_PLATFORM': {
      return Object.assign({}, state, {
        selectedPlatform: action.payload.platform,
        currentlyVisible: state.byPlatform[action.payload.platform],
      });
    }
    default:
      return state;
  }
};

const athletes = (
  state: $PropertyType<State, 'athletes'> = defaultAthleteState,
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const checkedVariables = (
  state: $PropertyType<State, 'checkedVariables'> = {},
  action: Action
): $PropertyType<State, 'checkedVariables'> => {
  switch (action.type) {
    case 'TOGGLE_VARIABLES': {
      const newState = JSON.parse(JSON.stringify(state));
      const athleteId = action.payload.athleteId;
      const currentVariableId = action.payload.currentVariableId;
      // check whether the variable belongs to the athlete
      const hasVariable = newState[athleteId][currentVariableId] || false;
      // if it belongs to the athlete remove it, if not, add it
      newState[athleteId][currentVariableId] = !hasVariable;

      return newState;
    }
    case 'TOGGLE_ALL_VARIABLES': {
      const athleteId = action.payload.athleteId;
      const newState = JSON.parse(JSON.stringify(state));
      // convert variables to array o ids
      const currentlyVisibleVariables = convertQuestionnaireVariablesToIdArray(
        action.payload.variables
      );

      // check if the athlete has any of the currently visible variables
      const athleteHasVariable =
        intersection(
          currentlyVisibleVariables,
          variablesHashToArray(state[athleteId])
        ).length > 0 || false;

      /*
       * If some or all the variables are checked uncheck them all
       * else check them all
       */
      currentlyVisibleVariables.forEach((tv) => {
        newState[athleteId][tv] = !athleteHasVariable;
      });

      return newState;
    }
    case 'TOGGLE_ALL_ATHLETES': {
      // We want to change the variable only for the athletes currently visible.
      const athleteIds = action.payload.athleteIds.slice(0);
      const variableId = action.payload.variableId;
      const newState = JSON.parse(JSON.stringify(state));

      // we only need to know if at least one athlete has the variable
      let athletesHaveVariable = false;
      for (let i = 0; i < athleteIds.length; i++) {
        if (athletesHaveVariable) {
          break;
        }
        if (newState[athleteIds[i]][variableId] === true) {
          athletesHaveVariable = true;
        }
      }

      /*
       * If there is at least one athlete that has this variable checked, then remove all.
       * If there are no athletes with this variable, check all.
       */
      athleteIds.forEach((athleteId) => {
        newState[athleteId][variableId] = !athletesHaveVariable;
      });

      return newState;
    }
    case 'CLEAR_ALL_VISIBLE_VARIABLES': {
      const newState = Object.assign({}, state);
      const athleteIds = action.payload.athleteIds;
      const variableIds = action.payload.variableIds;
      athleteIds.forEach((athleteId) => {
        variableIds.forEach((variableId) => {
          newState[athleteId][variableId] = false;
        });
      });
      return newState;
    }
    default:
      return state;
  }
};

const squadOptions = (
  state: $PropertyType<State, 'squadOptions'> = defaultSquadOptionsState,
  action: Action
): $PropertyType<State, 'squadOptions'> => {
  switch (action.type) {
    default:
      return state;
  }
};

const variablePlatforms = (
  state: $PropertyType<State, 'variablePlatforms'> = [],
  action: Action
): $PropertyType<State, 'variablePlatforms'> => {
  switch (action.type) {
    default:
      return state;
  }
};

const groupingLabels = (
  state: $PropertyType<State, 'groupingLabels'> = {},
  action: Action
): $PropertyType<State, 'groupingLabels'> => {
  switch (action.type) {
    default:
      return state;
  }
};

const templateData = (
  state: $PropertyType<State, 'templateData'> = defaultTemplateDataState,
  action: Action
): $PropertyType<State, 'templateData'> => {
  switch (action.type) {
    case 'SET_MASS_INPUT': {
      return Object.assign({}, state, {
        mass_input: action.payload.isMassInput,
      });
    }
    case 'SET_SHOW_WARNING_MESSAGE': {
      return Object.assign({}, state, {
        show_warning_message: action.payload.showWarningMessage,
      });
    }
    default:
      return state;
  }
};

const templateNames = (
  state: $PropertyType<State, 'templateNames'> = [],
  action: Action
): $PropertyType<State, 'templateNames'> => {
  switch (action.type) {
    default:
      return state;
  }
};

const modals = (
  state: $PropertyType<State, 'modals'> = {},
  action: Action
): $PropertyType<State, 'modals'> => {
  switch (action.type) {
    default:
      return state;
  }
};

export {
  variables,
  athletes,
  variablePlatforms,
  checkedVariables,
  templateData,
  templateNames,
  squadOptions,
  modals,
  groupingLabels,
};
