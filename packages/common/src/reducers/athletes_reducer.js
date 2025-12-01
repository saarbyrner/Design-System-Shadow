// @flow
import {
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
  groupAthletesByName,
  getFilteredAthletes,
  getIsLocalStorageAvailable,
} from '@kitman/common/src/utils';

const athletes = (state: Object = {}, action: Object) => {
  switch (action.type) {
    case 'SET_ATHLETES': {
      const groupedAthletes = {};
      groupedAthletes.position = groupAthletesByPosition(
        action.payload.athletes
      );
      groupedAthletes.positionGroup = groupAthletesByPositionGroup(
        action.payload.athletes,
        state.groupOrderingByType.position
      );
      groupedAthletes.availability = groupAthletesByAvailability(
        action.payload.athletes
      );
      groupedAthletes.last_screening = groupAthletesByScreening(
        action.payload.athletes
      );
      groupedAthletes.name = groupAthletesByName(action.payload.athletes);

      return Object.assign({}, state, {
        all: action.payload.athletes,
        groupBy: state.groupBy,
        grouped: groupedAthletes,
        currentlyVisible: getFilteredAthletes(
          groupedAthletes[state.groupBy],
          state.searchTerm,
          state.squadFilter,
          state.alarmFilters,
          state.athleteFilters,
          state.sortOrder,
          state.sortedBy,
          state.sortedByStatusKey
        ),
        searchTerm: state.searchTerm,
      });
    }
    case 'SET_GROUP_BY': {
      const groupBy = action.payload.groupBy;
      if (getIsLocalStorageAvailable()) {
        window.localStorage.setItem('groupBy', groupBy);
      }
      return Object.assign({}, state, {
        groupBy,
        currentlyVisible: getFilteredAthletes(
          state.grouped[groupBy],
          state.searchTerm,
          state.squadFilter
        ),
      });
    }
    case 'UPDATE_FILTER_OPTIONS': {
      const groupBy = action.payload.groupBy;
      const alarmFilters = action.payload.alarmFilters;
      const athleteFilters = action.payload.athleteFilters;
      const sortOrder = '';
      const sortedBy = '';
      const sortedByStatusKey = '';
      if (getIsLocalStorageAvailable()) {
        window.localStorage.setItem('groupBy', groupBy);
      }
      return Object.assign({}, state, {
        groupBy,
        alarmFilters,
        athleteFilters,
        sortOrder,
        sortedBy,
        sortedByStatusKey,
        currentlyVisible: getFilteredAthletes(
          state.grouped[groupBy],
          state.searchTerm,
          state.squadFilter,
          alarmFilters,
          athleteFilters,
          sortOrder,
          sortedBy,
          sortedByStatusKey
        ),
      });
    }
    case 'UPDATE_SORT': {
      const sortOrder = action.payload.sortOrder;
      const sortedBy = action.payload.statusId;
      const sortedByStatusKey = action.payload.statusKey;
      return Object.assign({}, state, {
        sortOrder,
        sortedBy,
        sortedByStatusKey,
        currentlyVisible: getFilteredAthletes(
          state.grouped[state.groupBy],
          state.searchTerm,
          state.squadFilter,
          state.alarmFilters,
          state.athleteFilters,
          sortOrder,
          sortedBy,
          sortedByStatusKey
        ),
      });
    }
    case 'SET_SQUAD_FILTER': {
      return Object.assign({}, state, {
        currentlyVisible: getFilteredAthletes(
          state.grouped[state.groupBy],
          state.searchTerm,
          action.payload.squadId
        ),
        squadFilter: action.payload.squadId,
      });
    }
    case 'SET_NAME_FILTER': {
      return Object.assign({}, state, {
        searchTerm: action.payload.value,
        currentlyVisible: getFilteredAthletes(
          state.grouped[state.groupBy],
          action.payload.value,
          state.squadFilter,
          state.alarmFilters,
          state.athleteFilters,
          state.sortOrder,
          state.sortedBy,
          state.sortedByStatusKey
        ),
      });
    }
    case 'CLEAR_NAME_FILTER': {
      return Object.assign({}, state, {
        searchTerm: '',
        currentlyVisible: getFilteredAthletes(
          state.grouped[state.groupBy],
          '',
          state.squadFilter,
          state.alarmFilters,
          state.athleteFilters,
          state.sortOrder,
          state.sortedBy,
          state.sortedByStatusKey
        ),
      });
    }
    default: {
      return state;
    }
  }
};

export default athletes;
