// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';

export type CreateIssueEventRequest = {
  issue_occurrence_id: number,
  issue_occurrence_type: IssueType,
  issue_status_id: number,
  event_date: string,
};

export type CreateIssueEventResponse = CreateIssueEventRequest & {
  id: number,
  injury_status_id: number,
};

export const createIssueEventUrl = '/emr/issue_occurrence_events';

const createIssueEvent = async (
  eventData: CreateIssueEventRequest
): Promise<CreateIssueEventResponse> => {
  const payload = {
    event: {
      issue_occurrence_id: eventData.issue_occurrence_id,
      issue_occurrence_type: eventData.issue_occurrence_type,
      issue_status_id: eventData.issue_status_id,
      event_date: eventData.event_date,
    },
  };

  const { data } = await axios.post(createIssueEventUrl, payload);
  return data;
};

export default createIssueEvent;
