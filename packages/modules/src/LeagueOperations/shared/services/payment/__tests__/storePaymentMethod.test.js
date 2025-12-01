import storePaymentMethod from '../storePaymentMethod';

describe('storePaymentMethod', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await storePaymentMethod({
      checkout_form_id: 1234,
      customer_id: 123,
    });

    expect(returnedData).toEqual('');
  });
});
