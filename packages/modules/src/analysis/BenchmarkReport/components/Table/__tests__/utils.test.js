import { mockRowParams } from '@kitman/modules/src/analysis/BenchmarkReport/benchmark-report-data.mock';

import { getRowClass } from '../utils';
import { isBenchmarkReportParamsValid } from '../utils/utils';

const benchmarkReportParamsEmpty = {
  training_variable_ids: [],
  seasons: [],
  testing_window_ids: [],
  age_group_ids: [],
};

const benchmarkReportParamsInvalid = {
  training_variable_ids: [1, 2, 3],
  seasons: [],
  testing_window_ids: [],
  age_group_ids: [4, 5],
};

const benchmarkReportParamsValid = {
  training_variable_ids: [1, 2, 3],
  seasons: [4, 5],
  testing_window_ids: [6],
  age_group_ids: [7, 8, 9],
};

describe('BenchmarkReport|Table|utils', () => {
  test('getRowClass() returns the correct class', () => {
    expect(getRowClass(mockRowParams[0])).toStrictEqual(
      'MuiDataGrid-row--national '
    );

    expect(getRowClass(mockRowParams[1])).toStrictEqual(
      'MuiDataGrid-row--my-club '
    );

    expect(getRowClass(mockRowParams[2])).toStrictEqual(
      'MuiDataGrid-row--my-club '
    );

    expect(getRowClass(mockRowParams[3])).toStrictEqual(
      'MuiDataGrid-row--individual-athlete '
    );
  });

  test('isBenchmarkReportParamsValid() returns false when params empty', () => {
    expect(
      isBenchmarkReportParamsValid(benchmarkReportParamsEmpty)
    ).toStrictEqual(false);
  });

  test('isBenchmarkReportParamsValid() returns false when params invalid', () => {
    expect(
      isBenchmarkReportParamsValid(benchmarkReportParamsInvalid)
    ).toStrictEqual(false);
  });

  test('isBenchmarkReportParamsValid() returns true when params valid', () => {
    expect(
      isBenchmarkReportParamsValid(benchmarkReportParamsValid)
    ).toStrictEqual(true);
  });
});
