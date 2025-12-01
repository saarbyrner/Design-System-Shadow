import { axios } from '@kitman/common/src/utils/services';
import { data } from '../handlers/updateNotificationTriggers';
import updateNotificationTriggers, {
  generateUpdateBulkUpdateNotificationTriggersUrl,
} from '../bulkUpdateNotificationTriggers';

describe('updateNotificationTriggers', () => {
  let bulkUpdateNotificationTriggersRequest;

  beforeEach(() => {
    bulkUpdateNotificationTriggersRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = {
      requestBody: {
        notification_trigger: { enabled_channels: { athlete: [], staff: [] } },
      },
    };

    const returnedData = await updateNotificationTriggers(props);

    expect(returnedData).toEqual(data);
    expect(bulkUpdateNotificationTriggersRequest).toHaveBeenCalledTimes(1);
    expect(bulkUpdateNotificationTriggersRequest).toHaveBeenCalledWith(
      generateUpdateBulkUpdateNotificationTriggersUrl(),
      props.requestBody
    );
  });
});
