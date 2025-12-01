import exportPaymentHistory from '../exportPaymentHistory';
import { data } from '../../mocks/data/mock_payment_history';

describe('exportPaymentHistory', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportPaymentHistory();

    expect(returnedData).toEqual(data);
  });
});
