import { response } from '@kitman/modules/src/Officials/shared/redux/services/mocks/data/mock_official_list';
import fetchOfficials from '../fetchOfficials';

describe('fetchOfficials', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchOfficials();

    expect(returnedData).toEqual(response);
  });
});
