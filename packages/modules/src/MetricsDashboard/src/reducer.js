// @flow
import type { State } from '../types/state';
import type { Action } from '../types/actions';

const canManageDashboard = (
  state: $PropertyType<State, 'canManageDashboard'> = false,
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const canViewAvailability = (
  state: $PropertyType<State, 'canViewAvailability'> = false,
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const canManageAvailability = (
  state: $PropertyType<State, 'canManageAvailability'> = false,
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const canViewGraph = (
  state: $PropertyType<State, 'canViewGraph'> = false,
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const groupingLabels = (
  state: $PropertyType<State, 'groupingLabels'> = {},
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const indicationTypes = (
  state: $PropertyType<State, 'canViewAvailability'> = false,
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const showDashboardFilters = (
  state: $PropertyType<State, 'showDashboardFilters'> = false,
  action: Action
) => {
  switch (action.type) {
    case 'TOGGLE_DASHBOARD_FILTERS':
      return !action.payload.isFilterShown;
    default:
      return state;
  }
};

const alarmsEditorModal = (
  state: $PropertyType<State, 'alarmsEditorModal'> = { isVisible: false },
  action: Action
) => {
  switch (action.type) {
    case 'SHOW_ALARMS_EDITOR_MODAL':
      // set alarms modal visibility and status id
      return {
        isVisible: true,
        statusId: action.statusId,
      };

    case 'HIDE_ALARMS_EDITOR_MODAL':
      // set alarms modal visibility and status id
      return {
        isVisible: false,
      };
    default:
      return state;
  }
};

const alarmDefinitions = (
  state: $PropertyType<State, 'alarmDefinitions'> = {},
  action: Action
) => {
  switch (action.type) {
    case 'SET_ALARM_DEFINITIONS':
      return action.payload.alarmDefinitions;
    default:
      return state;
  }
};

const alarmDefinitionsForStatus = (
  state: $PropertyType<State, 'alarmDefinitionsForStatus'> = {
    initialAlarms: [],
    alarms: [],
  },
  action: any
) => {
  let newState;

  switch (action.type) {
    case 'SET_ALARM_DEFINITIONS_FOR_STATUS':
      newState = JSON.parse(JSON.stringify(state));
      newState = {
        initialAlarms: action.payload.alarms || [],
        alarms: action.payload.alarms || [],
      };
      return newState;

    case 'DELETE_ALARM_DEFINITION_FOR_STATUS':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms.splice(action.payload.index, 1);

      return newState;

    case 'DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms = [];

      return newState;

    case 'ADD_ALARM_DEFINITION_FOR_STATUS':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms.push({
        alarm_id: action.payload.alarmId,
        applies_to_squad: false,
        colour: 'colour1',
        condition: null,
        value: null,
        positions: [],
        position_groups: [],
        athletes: [],
        alarm_type: 'numeric',
        percentage_alarm_definition: {},
      });

      return newState;

    case 'SET_ALARM_CONDITION':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[action.payload.index].condition =
        action.payload.condition;
      return newState;

    case 'SET_ALARM_CALCULATION':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[
        action.payload.index
      ].percentage_alarm_definition.calculation = action.payload.calculation;

      return newState;

    case 'SET_ALARM_PERCENTAGE':
      newState = JSON.parse(JSON.stringify(state));

      newState.alarms[
        action.payload.index
      ].percentage_alarm_definition.percentage = action.payload.percentage;

      return newState;

    case 'SET_ALARM_PERIOD_SCOPE':
      newState = JSON.parse(JSON.stringify(state));
      if (
        action.payload.periodScope !==
        newState.alarms[action.payload.index].percentage_alarm_definition
          .period_scope
      ) {
        newState.alarms[
          action.payload.index
        ].percentage_alarm_definition.period_length = null;
      }
      newState.alarms[
        action.payload.index
      ].percentage_alarm_definition.period_scope = action.payload.periodScope;

      return newState;

    case 'SET_ALARM_PERIOD_LENGTH':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[
        action.payload.index
      ].percentage_alarm_definition.period_length = action.payload.periodLength;

      return newState;

    case 'SET_ALARM_TYPE':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[action.payload.index].alarm_type =
        action.payload.alarmType;

      return newState;

    case 'SET_ALARM_VALUE':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[action.payload.index].value = action.payload.value;

      return newState;

    case 'SET_ALARM_COLOUR':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[action.payload.index].colour = action.payload.colour;
      return newState;

    case 'UPDATE_SHOW_ALARM_ON_MOBILE':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[action.payload.index].show_on_mobile =
        action.payload.showOnMobile;
      return newState;

    case 'TOGGLE_SELECT_ALL_FOR_MOBILE':
      newState = JSON.parse(JSON.stringify(state));
      for (let i = 0; i < newState.alarms.length; i++) {
        // if there is at least 1 alarm with show on mobile enabled the multi checkbox
        // is partially enabled, so unset all the alarms
        newState.alarms[i].show_on_mobile =
          !action.payload.alarmIdsWithShowOnMobile.length;
      }
      return newState;

    case 'APPLY_ALARM_TO':
      newState = JSON.parse(JSON.stringify(state));
      newState.alarms[action.payload.alarmPosition].positions =
        action.payload.selectedItems.positions;
      newState.alarms[action.payload.alarmPosition].position_groups =
        action.payload.selectedItems.position_groups;
      newState.alarms[action.payload.alarmPosition].athletes =
        action.payload.selectedItems.athletes;
      newState.alarms[action.payload.alarmPosition].applies_to_squad =
        action.payload.selectedItems.applies_to_squad;
      return newState;

    case 'CLEAR_ALARM_SELECTED_ITEM':
      newState = JSON.parse(JSON.stringify(state));
      // removes athletes, positions and position groups in the
      // order they appear in the UI
      if (state.alarms[action.payload.alarmPosition].athletes.length > 0) {
        newState.alarms[action.payload.alarmPosition].athletes.pop();
      } else if (
        state.alarms[action.payload.alarmPosition].positions.length > 0
      ) {
        newState.alarms[action.payload.alarmPosition].positions.pop();
      } else if (
        state.alarms[action.payload.alarmPosition].position_groups.length > 0
      ) {
        newState.alarms[action.payload.alarmPosition].position_groups.pop();
      } else if (
        state.alarms[action.payload.alarmPosition].applies_to_squad === true
      ) {
        newState.alarms[action.payload.alarmPosition].applies_to_squad = false;
      }
      return newState;
    default:
      return state;
  }
};

const alarmSquadSearch = (
  state: $PropertyType<State, 'alarmSquadSearch'> = {},
  action: any
) => {
  let newState;

  switch (action.type) {
    case 'ALARM_SQUAD_SEARCH_SET_ACTIVE':
      newState = JSON.parse(JSON.stringify(state));
      newState[action.payload.alarmId].active = true;

      return newState;

    case 'ALARM_SQUAD_SEARCH_SET_INACTIVE':
      newState = JSON.parse(JSON.stringify(state));
      newState[action.payload.alarmId].active = false;

      return newState;

    case 'SET_ALARM_DEFINITIONS_FOR_STATUS':
      newState = JSON.parse(JSON.stringify(state));
      // set up widget array by ID
      newState = {
        positions: state.positions,
        positionOrder: state.positionOrder,
        positionGroups: state.positionGroups,
        positionGroupOrder: state.positionGroupOrder,
        athletes: state.athletes,
        athleteOrder: state.athleteOrder,
      };

      // if there are alarms, set up the alarm
      // squad search state for each alarm
      if (action.payload.alarms) {
        action.payload.alarms.map((alarm) => {
          newState[alarm.alarm_id] = {
            isSearching: false,
            searchTerm: '',
            // $FlowFixMe
            positionMatches: Object.keys(state.positions),
            // $FlowFixMe
            positionGroupMatches: Object.keys(state.positionGroups),
            // $FlowFixMe
            athleteMatches: Object.keys(state.athletes),
          };
          return null;
        });
      }

      return newState;

    case 'ALARM_SEARCH_APPLIES_TO':
      newState = JSON.parse(JSON.stringify(state));
      newState[action.payload.alarmId].searchTerm = action.payload.searchTerm;

      if (action.payload.searchTerm.length > 0) {
        newState[action.payload.alarmId].isSearching = true;
        // $FlowFixMe
        newState[action.payload.alarmId].positionMatches = Object.keys(
          state.positions
        ).filter((key) => {
          const name = state.positions[key].toLocaleLowerCase();
          return (
            name.indexOf(action.payload.searchTerm.toLocaleLowerCase()) !== -1
          );
        });

        // $FlowFixMe
        newState[action.payload.alarmId].positionGroupMatches = Object.keys(
          state.positionGroups
        ).filter((key) => {
          const name = state.positionGroups[key].toLocaleLowerCase();
          return (
            name.indexOf(action.payload.searchTerm.toLocaleLowerCase()) !== -1
          );
        });

        // $FlowFixMe
        newState[action.payload.alarmId].athleteMatches = Object.keys(
          state.athletes
        ).filter((key) => {
          const name =
            `${state.athletes[key].firstname} ${state.athletes[key].lastname}`.toLocaleLowerCase();
          return (
            name.indexOf(action.payload.searchTerm.toLocaleLowerCase()) !== -1
          );
        });
      } else {
        newState[action.payload.alarmId].isSearching = false;
        newState[action.payload.alarmId].searchTerm = '';
        // $FlowFixMe
        newState[action.payload.alarmId].positionMatches = Object.keys(
          state.positions
        );
        // $FlowFixMe
        newState[action.payload.alarmId].positionGroupMatches = Object.keys(
          state.positionGroups
        );
        // $FlowFixMe
        newState[action.payload.alarmId].athleteMatches = Object.keys(
          state.athletes
        );
      }
      return newState;

    case 'ADD_ALARM_DEFINITION_FOR_STATUS':
      newState = JSON.parse(JSON.stringify(state));
      newState[action.payload.alarmId] = {
        isSearching: false,
        // $FlowFixMe
        positionMatches: Object.keys(state.positions),
        // $FlowFixMe
        positionGroupMatches: Object.keys(state.positionGroups),
        // $FlowFixMe
        athleteMatches: Object.keys(state.athletes),
      };
      return newState;

    case 'ADD_POSITION_TO_ALARM':
    case 'ADD_POSITION_GROUP_TO_ALARM':
    case 'ADD_ATHLETE_TO_ALARM':
    case 'ADD_ENTIRE_SQUAD_TO_ALARM':
      newState = JSON.parse(JSON.stringify(state));
      newState[action.payload.alarmId].searchTerm = '';
      return newState;

    default:
      return state;
  }
};

export { alarmDefinitions, alarmDefinitionsForStatus, alarmSquadSearch };

export {
  canManageDashboard,
  canViewAvailability,
  canManageAvailability,
  canViewGraph,
  alarmsEditorModal,
  groupingLabels,
  showDashboardFilters,
  indicationTypes,
};
