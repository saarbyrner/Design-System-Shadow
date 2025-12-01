// @flow
import { axios } from '@kitman/common/src/utils/services';

type RepayResponseData = {
  id: number,
  organisation_id: number,
  recipient_organisation_id: number,
  user_id: number,
  division_id: number,
  gateway: string,
  method: string,
  status: string,
  amount: string,
  currency: string,
  pn_ref: string,
  metadata: string,
  captured_at: string,
  captured_id: null,
  refunded_at: null,
  refunded_id: null,
  created_at: string,
  updated_at: string,
};

type RepayErrorResponseData = {
  error: string,
};

const payRegistration = async (
  total: number
): Promise<RepayResponseData | RepayErrorResponseData> => {
  const { data } = await axios.post('/registration/payments/pay', {
    total,
  });

  return data;
};

export default payRegistration;
