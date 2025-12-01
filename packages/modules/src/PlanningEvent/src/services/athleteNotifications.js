// @flow
import $ from 'jquery';
import type { Notification } from '../../types';

type Params = {
  eventId: number,
};

export const sendNotification = ({ eventId }: Params): Promise<any> => {
  return new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/athlete_notifications`,
      contentType: 'application/json',
    })
      .done(() => resolve())
      .fail(() => reject());
  });
};

export const fetchNotifications = ({
  eventId,
}: Params): Promise<Array<Notification>> => {
  return new Promise((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'GET',
      url: `/planning_hub/events/${eventId}/athlete_notifications`,
      contentType: 'application/json',
    })
      .done((notifications) => resolve(notifications))
      .fail(() => reject());
  });
};

export const deleteNotificationSchedule = (eventId: number): Promise<any> => {
  return new Promise((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `/planning_hub/events/${eventId}/notification_schedules`,
      contentType: 'application/json',
    })
      .done((event) => resolve(event))
      .fail(() => reject());
  });
};

export const createNotificationSchedule = (
  eventId: number,
  scheduledTime: ?string
): Promise<any> => {
  return new Promise((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/notification_schedules`,
      contentType: 'application/json',
      data: JSON.stringify(
        scheduledTime ? { scheduled_time: scheduledTime } : {}
      ),
    })
      .done((event) => resolve(event))
      .fail(() => reject());
  });
};
