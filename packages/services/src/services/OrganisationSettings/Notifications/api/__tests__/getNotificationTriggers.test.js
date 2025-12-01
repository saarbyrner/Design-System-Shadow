import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/services/OrganisationSettings/Notifications/api/handlers/getNotificationTriggers';
import getNotificationTriggers, {
  GET_NOTIFICATION_TRIGGERS_URL,
} from '../getNotificationTriggers';

describe('getNotificationTriggers', () => {
  let getNotificationTriggersRequest;

  beforeEach(() => {
    getNotificationTriggersRequest = jest
      .spyOn(axios, 'get')
      .mockReturnValue({ data });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getNotificationTriggers();

    expect(returnedData).toEqual(data);
    expect(getNotificationTriggersRequest).toHaveBeenCalledTimes(1);
    expect(getNotificationTriggersRequest).toHaveBeenCalledWith(
      GET_NOTIFICATION_TRIGGERS_URL
    );
  });
});
