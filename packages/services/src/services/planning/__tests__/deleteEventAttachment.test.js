import deleteEventAttachment from '../deleteEventAttachment';

describe('deleteEventAttachment', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const eventId = 13;
    const attachmentId = 4;
    const returnedData = await deleteEventAttachment(eventId, attachmentId);

    expect(returnedData).toEqual('');
  });
});
