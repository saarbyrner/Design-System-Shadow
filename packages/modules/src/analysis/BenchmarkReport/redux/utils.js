// @flow
import {
  type BenchmarkingReport,
  BenchmarkReportResultTypes,
} from '@kitman/services/src/services/benchmarking/getBenchmarkingReport';

const BENCHMARK_REPORT_SORTING_ORDER = Object.freeze([
  BenchmarkReportResultTypes.National,
  BenchmarkReportResultTypes.MyClub,
  BenchmarkReportResultTypes.Individual,
]);

export const sortBenchmarkReport = (
  {
    result_type: aType,
    test: aTest,
    athlete_lastname: aLastName,
  }: BenchmarkingReport,
  {
    result_type: bType,
    test: bTest,
    athlete_lastname: bLastName,
  }: BenchmarkingReport
) => {
  // Group by test.
  const byTest = aTest.localeCompare(bTest);
  if (byTest) return byTest;

  // Sort by result_type.
  const byType =
    BENCHMARK_REPORT_SORTING_ORDER.indexOf(aType) -
    BENCHMARK_REPORT_SORTING_ORDER.indexOf(bType);
  if (byType) return byType;

  // Secondary sort by athlete_name.
  const byName = aLastName.localeCompare(bLastName);
  return byName;
};
