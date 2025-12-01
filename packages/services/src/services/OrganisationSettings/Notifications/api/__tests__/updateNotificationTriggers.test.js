import { axios } from '@kitman/common/src/utils/services';
import { data } from '../handlers/updateNotificationTriggers';
import updateNotificationTriggers, {
  generateUpdateNotificationTriggersUrl,
} from '../updateNotificationTriggers';

describe('updateNotificationTriggers', () => {
  let updateNotificationTriggersRequest;

  beforeEach(() => {
    updateNotificationTriggersRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = {
      id: 1,
      requestBody: {
        notification_trigger: { enabled_channels: { athlete: [], staff: [] } },
      },
    };

    const returnedData = await updateNotificationTriggers(props);

    expect(returnedData).toEqual(data);
    expect(updateNotificationTriggersRequest).toHaveBeenCalledTimes(1);
    expect(updateNotificationTriggersRequest).toHaveBeenCalledWith(
      generateUpdateNotificationTriggersUrl(props.id),
      props.requestBody
    );
  });
});
