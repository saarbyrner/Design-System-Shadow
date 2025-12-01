import deleteEventLink from '../deleteEventLink';
import { data } from '../../../mocks/handlers/planning/deleteEventLink';

describe('deleteEventLink', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const eventId = 9136500;
    const attachedLinkId = 90;
    const returnedData = await deleteEventLink(eventId, attachedLinkId);

    expect(returnedData).toEqual(data);
  });
});
