import { server } from '@kitman/services/src/mocks/server';
import { handler, data } from '../mocks/handlers/getNonCompliantAthletes';
import getNonCompliantAthletes from '../api/getNonCompliantAthletes';

describe('getNonCompliantAthletes', () => {
  beforeEach(() => server.use(handler));

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getNonCompliantAthletes();

    expect(returnedData).toEqual(data);
  });
});
