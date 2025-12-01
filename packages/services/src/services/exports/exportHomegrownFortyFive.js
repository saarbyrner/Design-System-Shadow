// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportHomegrownFortyFive = async (
  format?: 'pdf' | 'csv'
): Promise<ExportsItem> => {
  const { data } = await axios.post(
    `/export_jobs/homegrown_45?format=${format ?? 'csv'}`
  );
  return data;
};

export default exportHomegrownFortyFive;
