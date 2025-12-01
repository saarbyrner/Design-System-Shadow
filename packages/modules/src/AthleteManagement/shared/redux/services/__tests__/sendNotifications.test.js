import { server } from '@kitman/services/src/mocks/server';
import { handler, data } from '../mocks/handlers/sendNotifications';
import sendNotifications from '../api/sendNotifications';

describe('sendNotifications', () => {
  beforeEach(() => server.use(handler));

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await sendNotifications(
      'training_session',
      'entire_squad'
    );

    expect(returnedData).toEqual(data);
  });
});
