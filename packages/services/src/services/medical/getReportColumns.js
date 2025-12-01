// @flow
import { axios } from '@kitman/common/src/utils/services';

export const GET_REPORT_COLUMNS_ENDPOINT = '/ui/medical/reports/columns_array';

export type ReportColumn = {
  value: string,
  label: string,
};

export type RequestResponse = ReportColumn[];

const getReportColumns = async (
  reportType: string
): Promise<RequestResponse> => {
  const { data } = await axios.get(GET_REPORT_COLUMNS_ENDPOINT, {
    params: { report_type: reportType },
  });
  return data;
};

export default getReportColumns;
