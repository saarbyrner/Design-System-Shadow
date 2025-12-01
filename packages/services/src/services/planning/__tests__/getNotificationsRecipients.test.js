import { axios } from '@kitman/common/src/utils/services';
import data from '@kitman/services/src/mocks/handlers/planningHub/getNotificationsRecipients';
import getNotificationsRecipients, {
  notificationsrecipientsRequestUrl,
} from '@kitman/services/src/services/planning/getNotificationsRecipients';

describe('getNotificationsRecipients', () => {
  let getNotificationsRecipientsRequest;

  beforeAll(() => {
    getNotificationsRecipientsRequest = jest
      .spyOn(axios, 'get')
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          return resolve({ data });
        });
      });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getNotificationsRecipients({});
    expect(returnedData).toEqual(data);

    expect(getNotificationsRecipientsRequest).toHaveBeenCalledTimes(1);
    expect(getNotificationsRecipientsRequest).toHaveBeenCalledWith(
      notificationsrecipientsRequestUrl
    );
  });
});
