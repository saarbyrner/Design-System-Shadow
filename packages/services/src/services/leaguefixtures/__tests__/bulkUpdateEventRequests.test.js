import { axios } from '@kitman/common/src/utils/services';
import bulkUpdateEventRequests from '../bulkUpdateEventRequests';

describe('bulkUpdateEventRequests service', () => {
  let postMock;

  beforeEach(() => {
    postMock = jest.spyOn(axios, 'post').mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends correct payload when only required params are provided', async () => {
    const params = {
      eventId: 123,
      requests: [
        {
          id: 10,
          reason: 'Insufficient performance',
          rejection_reason_id: 99,
          status: 'rejected',
        },
      ],
    };

    await bulkUpdateEventRequests(params);

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith(
      '/planning_hub/user_event_requests/bulk_save',
      {
        event_id: 123,
        user_event_request_attributes: [
          {
            id: 10,
            reason: 'Insufficient performance',
            rejection_reason_id: 99,
            status: 'rejected',
          },
        ],
      }
    );
  });

  it('includes optional fields when provided', async () => {
    const params = {
      eventId: 456,
      attachment: {
        url: 'test_url',
        name: 'test_name',
        type: 'test_type,',
      },
      requests: [
        {
          id: 10,
          reason: 'Insufficient performance',
          rejection_reason_id: 99,
          status: 'rejected',
        },
      ],
    };

    await bulkUpdateEventRequests(params);

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith(
      '/planning_hub/user_event_requests/bulk_save',
      {
        event_id: 456,
        attachment: {
          url: 'test_url',
          name: 'test_name',
          type: 'test_type,',
        },
        user_event_request_attributes: [
          {
            id: 10,
            status: 'rejected',
            rejection_reason_id: 99,
            reason: 'Insufficient performance',
          },
        ],
      }
    );
  });
});
