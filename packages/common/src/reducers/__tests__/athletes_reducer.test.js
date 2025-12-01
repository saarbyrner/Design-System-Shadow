import { buildAthletes } from '@kitman/common/src/utils/test_utils';
import {
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
  groupAthletesByName,
  getFilteredAthletes,
} from '@kitman/common/src/utils';
import athletes from '../athletes_reducer';

describe('athletes reducer', () => {
  const allAthletes = buildAthletes(20);

  // add some athletes to squads
  allAthletes[0].squad_ids = ['1', '2'];
  allAthletes[1].squad_ids = ['1', '3'];
  allAthletes[2].squad_ids = ['2', '5'];
  allAthletes[2].squad_ids = ['1', '5'];

  const groupedAthletes = {
    position: groupAthletesByPosition(allAthletes),
    positionGroup: groupAthletesByPositionGroup(allAthletes),
    availability: groupAthletesByAvailability(allAthletes),
    last_screening: groupAthletesByScreening(allAthletes),
    name: groupAthletesByName(allAthletes),
  };
  const groupBy = 'availability';

  it('returns correct state on SET_ATHLETES', () => {
    const alarmFilters = ['In Alarm'];
    const athleteFilters = [9];
    const searchTerm = '';
    const squadFilter = '';
    const initialState = {
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[groupBy],
      searchTerm,
      squadFilter,
      alarmFilters,
      athleteFilters,
      groupOrderingByType: {
        last_screening: ['unavailable', 'injured', 'returning', 'available'],
      },
    };

    const updatedAthletes = buildAthletes(21);
    const updatedGroupedAthletes = {
      position: groupAthletesByPosition(updatedAthletes),
      positionGroup: groupAthletesByPositionGroup(updatedAthletes),
      availability: groupAthletesByAvailability(updatedAthletes),
      last_screening: groupAthletesByScreening(updatedAthletes),
      name: groupAthletesByName(updatedAthletes),
    };

    const action = {
      type: 'SET_ATHLETES',
      payload: {
        athletes: updatedAthletes,
      },
    };

    const nextState = athletes(initialState, action);
    expect(nextState).toEqual({
      all: updatedAthletes,
      groupBy,
      grouped: updatedGroupedAthletes,
      currentlyVisible: getFilteredAthletes(
        updatedGroupedAthletes[groupBy],
        searchTerm,
        squadFilter,
        alarmFilters,
        athleteFilters
      ),
      searchTerm: '',
      squadFilter: '',
      alarmFilters: ['In Alarm'],
      athleteFilters: [9],
      groupOrderingByType: {
        last_screening: ['unavailable', 'injured', 'returning', 'available'],
      },
    });
  });

  it('returns correct state on SET_GROUP_BY', () => {
    const initialState = {
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[groupBy],
      searchTerm: '',
    };

    const action = {
      type: 'SET_GROUP_BY',
      payload: {
        groupBy: 'position',
      },
    };

    const updatedGroupBy = 'position';
    const nextState = athletes(initialState, action);

    expect(nextState).toEqual({
      all: allAthletes,
      groupBy: updatedGroupBy,
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[updatedGroupBy],
      searchTerm: '',
    });
  });

  it('returns correct state on UPDATE_FILTER_OPTIONS', () => {
    const initialState = {
      all: allAthletes,
      groupBy,
      alarmFilters: [],
      athleteFilters: [],
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[groupBy],
      searchTerm: '',
      sortOrder: 'low_to_high',
      sortedBy: 'status_1234',
      sortedByStatusKey: 'kitman_variable',
    };

    const action = {
      type: 'UPDATE_FILTER_OPTIONS',
      payload: {
        groupBy: 'position',
        alarmFilters: ['inAlarm', 'noAlarms'],
        athleteFilters: [],
      },
    };

    const updatedGroupBy = 'position';
    const nextState = athletes(initialState, action);

    expect(nextState).toEqual({
      all: allAthletes,
      groupBy: updatedGroupBy,
      grouped: groupedAthletes,
      alarmFilters: ['inAlarm', 'noAlarms'],
      athleteFilters: [],
      currentlyVisible: groupedAthletes[updatedGroupBy],
      searchTerm: '',
      sortOrder: '',
      sortedBy: '',
      sortedByStatusKey: '',
    });
  });

  it('returns correct state on UPDATE_SORT', () => {
    const initialState = {
      all: allAthletes,
      groupBy,
      alarmFilters: [],
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[groupBy],
      searchTerm: '',
      sortOrder: '',
      sortedBy: '',
      sortedByStatusKey: '',
    };

    const action = {
      type: 'UPDATE_SORT',
      payload: {
        sortOrder: 'high_to_low',
        statusId: 'pretend-uuid-0',
        statusKey: 'kitman_variable',
      },
    };

    const nextState = athletes(initialState, action);

    expect(nextState).toEqual({
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      alarmFilters: [],
      currentlyVisible: groupedAthletes[groupBy],
      searchTerm: '',
      sortOrder: 'high_to_low',
      sortedBy: 'pretend-uuid-0',
      sortedByStatusKey: 'kitman_variable',
    });
  });

  it('returns correct state on SET_NAME_FILTER', () => {
    const initialState = {
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: groupedAthletes[groupBy],
      searchTerm: '',
    };

    const searchTerm = 'ba';

    const action = {
      type: 'SET_NAME_FILTER',
      payload: {
        value: searchTerm,
      },
    };

    const nextState = athletes(initialState, action);

    expect(nextState).toEqual({
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: getFilteredAthletes(
        groupedAthletes[groupBy],
        searchTerm
      ),
      searchTerm,
    });
  });

  it('returns correct state on CLEAR_NAME_FILTER', () => {
    const searchTerm = 'ba';
    const squadFilter = '1';
    const alarmFilters = ['In Alarm'];
    const athleteFilters = [27];
    const initialState = {
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: getFilteredAthletes(
        groupedAthletes[groupBy],
        searchTerm,
        squadFilter
      ),
      searchTerm,
      squadFilter,
      alarmFilters,
      athleteFilters,
    };

    const action = {
      type: 'CLEAR_NAME_FILTER',
    };

    const nextState = athletes(initialState, action);

    expect(nextState).toEqual({
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: getFilteredAthletes(
        groupedAthletes[groupBy],
        searchTerm,
        squadFilter,
        alarmFilters,
        athleteFilters
      ),
      searchTerm: '',
      squadFilter,
      alarmFilters,
      athleteFilters,
    });
  });

  it('returns correct state on SET_SQUAD_FILTER', () => {
    const squadId = '11';
    const initialState = {
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: getFilteredAthletes(
        groupedAthletes[groupBy],
        '',
        squadId
      ),
      squadFilter: null,
    };

    const action = {
      type: 'SET_SQUAD_FILTER',
      payload: {
        squadId,
      },
    };

    const nextState = athletes(initialState, action);
    expect(nextState).toEqual({
      all: allAthletes,
      groupBy,
      grouped: groupedAthletes,
      currentlyVisible: getFilteredAthletes(
        groupedAthletes[groupBy],
        '',
        squadId
      ),
      squadFilter: squadId,
    });
  });
});
