import {
  getActiveTemplateDashboardFilters,
  getEditableTemplateDashboardFilters,
  getEditableTemplateDashboardFilterFactory,
  getMultipleTemplateDashboardsFilterFactory,
  getIfFiltersAreEmpty,
  getIfPopulationIsEmpty,
} from '../filters';

const MOCK_STATE = {
  templateDashboardsApi: {},
  templateDashboardsFilter: {
    isEditModeActive: false,
    editable: {
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [1, 3],
        squads: [],
        context_squads: [],
        users: [],
      },
      timescope: {
        time_period: 'this_season',
      },
    },
    active: {
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [1, 3],
        squads: [],
        context_squads: [],
        users: [],
      },
      timescope: {
        time_period: 'this_season',
      },
    },
  },
};

describe('[templateDashboardFilters] - selectors', () => {
  test('getActiveTemplateDashboardFilters()', () => {
    expect(getActiveTemplateDashboardFilters(MOCK_STATE)).toBe(
      MOCK_STATE.templateDashboardsFilter.active
    );
  });

  test('getEditableTemplateDashboardFilters()', () => {
    expect(getEditableTemplateDashboardFilters(MOCK_STATE)).toBe(
      MOCK_STATE.templateDashboardsFilter.editable
    );
  });

  test('getEditableTemplateDashboardFilterFactory()', () => {
    const timescopeSelector =
      getEditableTemplateDashboardFilterFactory('timescope');
    const populationSelector =
      getEditableTemplateDashboardFilterFactory('population');

    expect(timescopeSelector(MOCK_STATE)).toBe(
      MOCK_STATE.templateDashboardsFilter.editable.timescope
    );

    expect(populationSelector(MOCK_STATE)).toBe(
      MOCK_STATE.templateDashboardsFilter.editable.population
    );
  });

  test('getMultipleTemplateDashboardsFilterFactory()', () => {
    const selector = getMultipleTemplateDashboardsFilterFactory([
      'timescope',
      'population',
    ]);

    expect(selector(MOCK_STATE)).toStrictEqual({
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [1, 3],
        squads: [],
        context_squads: [],
        users: [],
      },
      timescope: {
        time_period: 'this_season',
      },
    });
  });

  describe('getIfFiltersAreEmpty', () => {
    it('returns true if all filters are empty', () => {
      expect(
        getIfFiltersAreEmpty({
          templateDashboardsFilter: {
            active: {
              population: {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [],
                athletes: [],
                squads: [],
                context_squads: [],
              },
              timescope: {
                time_period: null,
              },
            },
          },
        })
      ).toBe(true);
    });

    it('returns true if one filter is empty', () => {
      expect(
        getIfFiltersAreEmpty({
          templateDashboardsFilter: {
            active: {
              population: {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [],
                athletes: [],
                squads: [1, 2],
                context_squads: [],
                users: [],
              },
              timescope: {
                time_period: null,
              },
            },
          },
        })
      ).toBe(true);

      expect(
        getIfFiltersAreEmpty({
          templateDashboardsFilter: {
            active: {
              population: {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [],
                athletes: [],
                squads: [],
                context_squads: [],
                users: [],
                labels: [],
                segments: [],
              },
              timescope: {
                time_period: 'today',
              },
            },
          },
        })
      ).toBe(true);
    });

    it('returns false if both filters have values', () => {
      expect(
        getIfFiltersAreEmpty({
          templateDashboardsFilter: {
            active: {
              population: {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [1, 2],
                athletes: [],
                squads: [],
                context_squads: [],
                users: [],
              },
              timescope: {
                time_period: 'today',
              },
            },
          },
        })
      ).toBe(false);
    });
  });

  describe('getIfPopulationIsEmpty', () => {
    it('returns true if population is empty', () => {
      expect(
        getIfPopulationIsEmpty({
          templateDashboardsFilter: {
            active: {
              population: {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [],
                athletes: [],
                squads: [],
                context_squads: [],
                users: [],
                labels: [],
                segments: [],
              },
              timescope: {
                time_period: null,
              },
            },
          },
        })
      ).toBe(true);
    });

    it('returns false if population has values', () => {
      expect(
        getIfPopulationIsEmpty({
          templateDashboardsFilter: {
            active: {
              population: {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [1, 2],
                athletes: [],
                squads: [],
                context_squads: [],
                users: [],
                labels: [],
                segments: [],
              },
              timescope: {
                time_period: null,
              },
            },
          },
        })
      ).toBe(false);
    });
  });
});
