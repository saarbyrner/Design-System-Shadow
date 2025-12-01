import { server } from '@kitman/services/src/mocks/server';
import { handler, data } from '../../mocks/handlers/getPreferences';
import getPreferences from '../getPreferences';

describe('getPreferences', () => {
  beforeEach(() => server.use(handler));

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getPreferences();
    expect(returnedData).toEqual(data);
  });
});
