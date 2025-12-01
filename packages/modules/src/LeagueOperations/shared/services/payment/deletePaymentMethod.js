// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = {};

const deletePaymentMethod = async (): Promise<RequestResponse> => {
  const { data } = await axios.delete('/registration/payments/remove');

  return data;
};

export default deletePaymentMethod;
