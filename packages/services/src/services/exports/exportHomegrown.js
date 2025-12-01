// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportHomegrown = async (): Promise<ExportsItem> => {
  const { data } = await axios.post('/export_jobs/homegrown_export');
  return data;
};

export default exportHomegrown;
