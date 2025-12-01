import $ from 'jquery';
import { sendNotification, fetchNotifications } from '../athleteNotifications';

describe('sendNotification', () => {
  let sendNotificationRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    sendNotificationRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await sendNotification({
      eventId: 1,
    });

    expect(sendNotificationRequest).toHaveBeenCalledTimes(1);
    expect(sendNotificationRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      url: '/planning_hub/events/1/athlete_notifications',
    });
  });
});

describe('fetchNotifications', () => {
  const mockedNotifications = [{ sent_at: '2021-04-23T15:24:57.000+01:00' }];

  let fetchNotificationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    fetchNotificationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedNotifications));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchNotifications({
      eventId: 1,
    });

    expect(returnedData).toEqual(mockedNotifications);

    expect(fetchNotificationsRequest).toHaveBeenCalledTimes(1);
    expect(fetchNotificationsRequest).toHaveBeenCalledWith({
      method: 'GET',
      contentType: 'application/json',
      url: '/planning_hub/events/1/athlete_notifications',
    });
  });
});
