// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportPayment = async (format: 'csv' | 'pdf'): Promise<ExportsItem> => {
  const { data } = await axios.post(
    `/export_jobs/payment_export?format=${format ?? 'csv'}`
  );
  return data;
};

export default exportPayment;
