import filtersReducer, {
  initialState,
  setFilter,
  getInitialState,
  openFilterPanel,
  clearFilters,
  resetState,
  applyFilters,
} from '../filters';

describe('[templateDashboardFiltersSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(filtersReducer(initialState, action)).toEqual(expectedState);
  });

  it('begins edit mode by copying active state and setting panel boolean true', () => {
    const firstState = {
      ...initialState,
      active: {
        ...initialState.editable,
        timescope: {
          time_period: 'last_season',
        },
      },
    };
    const expectedState = {
      isPanelOpen: true,
      editable: {
        ...initialState.editable,
        timescope: {
          time_period: 'last_season',
        },
      },
      active: {
        ...initialState.editable,
        timescope: {
          time_period: 'last_season',
        },
      },
      sortedData: [],
    };
    const action = openFilterPanel();

    expect(filtersReducer(firstState, action)).toEqual(expectedState);
  });

  it('ends edit mode by copying editable state and setting panel boolean false', () => {
    const firstState = {
      ...initialState,
      isPanelOpen: true,
      editable: {
        ...initialState.editable,
        timescope: {
          time_period: 'last_season',
        },
      },
    };
    const expectedState = {
      isPanelOpen: false,
      editable: {
        ...initialState.editable,
        timescope: {
          time_period: 'last_season',
        },
      },
      active: {
        ...initialState.editable,
        timescope: {
          time_period: 'last_season',
        },
      },
      sortedData: [],
    };
    const action = applyFilters();

    expect(filtersReducer(firstState, action)).toEqual(expectedState);
  });

  it('should correctly update state on dispatching setFilter', () => {
    const action = setFilter({
      key: 'timescope',
      value: { time_period: 'last_season' },
    });
    const expectedState = {
      ...initialState,
      editable: {
        ...initialState.editable,
        timescope: {
          time_period: 'last_season',
        },
      },
    };

    expect(filtersReducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update state on dispatching clearFilters', () => {
    const action = clearFilters();
    const expectedState = {
      ...initialState,
    };
    expect(filtersReducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update state on dispatching resetState', () => {
    const action = resetState();
    const expectedState = {
      ...initialState,
    };
    expect(filtersReducer(initialState, action)).toEqual(expectedState);
  });

  describe('session storage functionality', () => {
    beforeAll(() => {
      const localStorageMock = (() => {
        let store = {};

        return {
          getItem(key) {
            return store[key] || null;
          },
          setItem(key, value) {
            store[key] = value.toString();
          },
          removeItem(key) {
            delete store[key];
          },
          clear() {
            store = {};
          },
        };
      })();

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
    });

    beforeEach(() => {
      window.localStorage.clear();
      jest.restoreAllMocks();
    });

    it('should return the session storage value as initial state if available', () => {
      const expectedState = {
        isPanelOpen: false,
        editable: {
          population: {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [1, 2, 3],
            athletes: [],
            squads: [],
            context_squads: [],
          },
          timescope: {
            time_period: null,
          },
        },
        active: {
          population: {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [1, 2, 3],
            athletes: [],
            squads: [],
            context_squads: [],
          },
          timescope: {
            time_period: null,
          },
        },
        sortedData: [],
      };
      jest.spyOn(window.localStorage, 'getItem').mockReturnValue(
        JSON.stringify({
          population: {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [1, 2, 3],
            athletes: [],
            squads: [],
            context_squads: [],
          },
          timescope: {
            time_period: null,
          },
        })
      );

      expect(getInitialState()).toEqual(expectedState);
    });

    it('should return initial state if session storage value is corrupt', () => {
      jest.spyOn(window.localStorage, 'getItem').mockReturnValue('{df}');

      expect(getInitialState()).toEqual(initialState);
    });
  });
});
