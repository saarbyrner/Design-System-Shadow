// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportHomegrownPlusNine = async (
  format?: 'csv' | 'pdf'
): Promise<ExportsItem> => {
  const { data } = await axios.post(
    `/export_jobs/homegrown_plus_9?format=${format ?? 'csv'}`
  );
  return data;
};

export default exportHomegrownPlusNine;
