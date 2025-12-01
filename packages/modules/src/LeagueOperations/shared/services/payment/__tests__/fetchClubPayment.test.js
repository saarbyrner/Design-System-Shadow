import fetchClubPayment from '../fetchClubPayment';
import { data } from '../../mocks/data/mock_club_payment';

describe('fetchClubPayment', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchClubPayment();

    expect(returnedData).toEqual(data);
  });
});
