import filtersReducer, { setFilter } from '../filters';
import { allEventTypes, initialFilters } from '../../../utils/consts';

describe('Filters - slices', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = { ...initialFilters };

    const currentState = filtersReducer(initialFilters, action);

    expect(currentState).toEqual(expectedState);
    // make sure that it includes all existing types explicitly
    expect(currentState.types).toEqual(allEventTypes);
  });

  it('should update state properly', () => {
    const chosenSquadId = 123;
    const squadsKey = 'squads';
    const action = setFilter({ key: squadsKey, value: [chosenSquadId] });

    const expectedState = {
      ...initialFilters,
      [squadsKey]: [chosenSquadId],
    };

    expect(filtersReducer(initialFilters, action)).toEqual(expectedState);
  });
});
