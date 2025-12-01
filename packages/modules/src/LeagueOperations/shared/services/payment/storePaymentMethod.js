// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = {};
export type FormDetails = {
  formId: string,
  customerId: string,
};

/*
 * Once the user saves a card using Repay, we need to store the payment method summary in our database.
 * This informs the backend that a payment method has been saved on Repay and that we can fetch and store it.
 */
const storePaymentMethod = async (
  formDetails: FormDetails
): Promise<RequestResponse> => {
  const { data } = await axios.post('/registration/payments/store', {
    checkout_form_id: formDetails.formId,
    customer_id: formDetails.customerId,
  });

  return data;
};

export default storePaymentMethod;
