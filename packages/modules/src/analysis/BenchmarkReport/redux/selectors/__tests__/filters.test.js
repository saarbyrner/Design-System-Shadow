import {
  getActiveFilters,
  getEditableFilters,
  getEditableFiltersFactory,
} from '../filters';

const MOCK_STATE = {
  benchmarkReportApi: {},
  benchmarkReportFilters: {
    editable: {
      training_variable_ids: [1, 2, 3],
      seasons: [],
      testing_window_ids: [],
      age_group_ids: [],
      national_results: true,
      compare_to: {
        seasons: [],
        testing_window_ids: [],
        athlete_ids: [],
      },
    },
    active: {
      training_variable_ids: [4, 5, 6],
      seasons: [],
      testing_window_ids: [],
      age_group_ids: [],
      national_results: true,
      compare_to: {
        seasons: [],
        testing_window_ids: [],
        athlete_ids: [],
      },
    },
  },
};

describe('BenchmarkReport|Selectors', () => {
  it('returns the correct values for getActiveFilters()', () => {
    const result = getActiveFilters(MOCK_STATE);

    expect(result).toEqual(MOCK_STATE.benchmarkReportFilters.active);
  });

  it('returns the correct values for getEditableFilters()', () => {
    const result = getEditableFilters(MOCK_STATE);

    expect(result).toEqual(MOCK_STATE.benchmarkReportFilters.editable);
  });

  it('returns the correct values for getEditableFiltersFactory()', () => {
    const result = getEditableFiltersFactory('training_variable_ids')(
      MOCK_STATE
    );

    expect(result).toEqual(
      MOCK_STATE.benchmarkReportFilters.editable.training_variable_ids
    );
  });
});
