// @flow
import { axios } from '@kitman/common/src/utils/services';

export type GetBenchmarkReportParams = {
  training_variable_ids: Array<number>,
  seasons: Array<number>,
  testing_window_ids: Array<number>,
  age_group_ids: Array<number>,
  maturation_status_ids: Array<number>,
  position_ids: Array<number>,
  national_results?: boolean,
  club_results?: boolean,
  compare_to?: {
    athlete_ids: Array<number>,
    seasons?: Array<number>,
    testing_window_ids?: Array<number>,
  },
};

export const BenchmarkReportResultTypes = Object.freeze({
  National: 'national',
  MyClub: 'my_club',
  Individual: 'individual',
});
export type BenchmarkReportResultType = $Values<
  typeof BenchmarkReportResultTypes
>;

export type BenchmarkingReport = {
  age_group: number,
  age_group_on_day_of_test: string,
  athlete_name: string,
  athlete_firstname: string,
  athlete_lastname: string,
  athletes: number,
  label: string,
  max: number,
  mean: number,
  median: number,
  min: number,
  most_recent_test_result: number,
  result_type: BenchmarkReportResultType,
  results: number,
  standard_deviation: number,
  test: string,
  z_score_club: number,
  z_score_national: number,
};

const getBenchmarkingReport = async (
  benchmarkReportParams: GetBenchmarkReportParams
): Promise<any> => {
  const { data } = await axios.post(
    '/benchmark/preview',
    benchmarkReportParams,
    // This request can take several minutes to complete. Our default timeout
    // is 1 minute. timeout: 0 means there is no timeout for the request.
    { timeout: 0 }
  );
  return data;
};

export default getBenchmarkingReport;
