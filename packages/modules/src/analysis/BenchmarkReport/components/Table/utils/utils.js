// @flow
import type { GetBenchmarkReportParams } from '@kitman/services/src/services/benchmarking/getBenchmarkingReport';

export const isBenchmarkReportParamsValid = (
  benchmarkReportParams: GetBenchmarkReportParams
) => {
  if (
    // these are the minimum fields request to not break the BE, the rest will be auto populated
    // and caught by FE validation.
    !benchmarkReportParams.training_variable_ids.length ||
    !benchmarkReportParams.testing_window_ids.length ||
    !benchmarkReportParams.seasons.length
  ) {
    return false;
  }
  return true;
};
