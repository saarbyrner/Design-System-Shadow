// @flow
import $ from 'jquery';
import type {
  EventActivityDrill,
  DrillAttachment,
} from '@kitman/common/src/types/Event';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';

export type EventActivityDrillForRequest = {
  name: string,
  sets: ?number,
  reps: ?number,
  rest_duration: ?number,
  pitch_width: ?number,
  pitch_length: ?number,
  notes: string,
  diagram: ?AttachedTransformedFile,
  attachments_attributes: Array<AttachedTransformedFile | DrillAttachment>,
  links: Array<{
    id?: number,
    uri: string,
    title: string,
  }>,
  event_activity_drill_label_ids: Array<number>,
};

const updateActivityDrill = (
  eventId: number,
  activityId: number,
  activityDrill: EventActivityDrillForRequest
): Promise<EventActivityDrill> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/event_activities/${activityId}/event_activity_drills`,
      contentType: 'application/json',
      data: JSON.stringify(activityDrill),
    })
      .done((drill) => {
        resolve(drill);
      })
      .fail(() => {
        reject();
      });
  });

export default updateActivityDrill;
