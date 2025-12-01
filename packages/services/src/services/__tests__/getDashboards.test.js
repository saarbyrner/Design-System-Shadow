import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/getDashboards';
import getDashboards from '../getDashboards';

describe('getDashboards', () => {
  it('calls the correct endpoint and returns the correct data', async () => {
    const returnedData = await getDashboards(123);

    expect(returnedData).toEqual(serverResponse);
  });
});
