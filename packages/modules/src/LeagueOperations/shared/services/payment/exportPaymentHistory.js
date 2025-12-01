// @flow
import { axios } from '@kitman/common/src/utils/services';

const exportPaymentHistory = async (): Promise<string> => {
  const { data } = await axios.post('/registration/payments/export');
  return data;
};

export default exportPaymentHistory;
