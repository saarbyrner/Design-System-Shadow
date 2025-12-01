// @flow
import { axios } from '@kitman/common/src/utils/services';

export type ExportedForms = {
  csvData: string,
  contentDisposition: string,
};

export type ExportAnkleSupportQuery = {
  key: 'nba-ankle-em-2324-v2' | 'nba-ankle-at-2334-v1',
  startDate?: ?string,
  endDate?: ?string,
};

const exportCombinedAnkleSupport = async (
  query: ExportAnkleSupportQuery
): Promise<ExportedForms> => {
  const response = await axios.post(
    '/ui/concussion/form_answers_sets/export_nba_combined_ankle_forms',
    {
      key: query.key,
      start_date: query.startDate,
      end_date: query.endDate,
    },
    { timeout: 0 } // May be a lot of data so no timeout
  );

  return {
    csvData: response.data,
    contentDisposition: response.headers['content-disposition'],
  };
};

export default exportCombinedAnkleSupport;
