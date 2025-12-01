// @flow
import { nonInfoEventTypes } from '@kitman/modules/src/Medical/shared/utils';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';

export const isOtherClassedEvent = (eventType: string) =>
  ['other', ...nonInfoEventTypes].includes(eventType.toLowerCase());

export const getEventId = (issue: IssueOccurrenceRequested) => {
  if (issue.game_id || issue.training_session_id) {
    return issue.game_id || issue.training_session_id;
  }

  if (!issue.activity_type) {
    return null;
  }

  if (isOtherClassedEvent(issue.activity_type)) {
    return '';
  }

  return ''; // Must be unlisted
};
