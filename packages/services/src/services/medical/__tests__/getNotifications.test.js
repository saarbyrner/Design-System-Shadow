import $ from 'jquery';
import getNotifications from '../getNotifications';

describe('getNotifications', () => {
  let getNotificationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = {
      message_count: 2,
      report_count: 1,
    };

    getNotificationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getNotifications();

    expect(returnedData).toEqual({
      message_count: 2,
      report_count: 1,
    });

    expect(getNotificationsRequest).toHaveBeenCalledTimes(1);
    expect(getNotificationsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/drfirst/notification_counts',
    });
  });
});
