// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = {
  form_url: string,
  checkout_form_id: string,
  customer_id: string,
};

const fetchRepayForm = async (): Promise<RequestResponse> => {
  const { data } = await axios.get('/registration/payments/repay_form');
  return data.data;
};

export default fetchRepayForm;
