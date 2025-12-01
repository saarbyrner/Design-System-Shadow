import fetchRepayForm from '../fetchRepayForm';
import { data } from '../../mocks/data/mock_repay_form';

describe('fetchRepayForm', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchRepayForm();

    expect(returnedData).toEqual(data.data);
  });
});
