import deletePaymentMethod from '../deletePaymentMethod';

describe('deletePaymentMethod', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await deletePaymentMethod();

    expect(returnedData).toEqual('');
  });
});
