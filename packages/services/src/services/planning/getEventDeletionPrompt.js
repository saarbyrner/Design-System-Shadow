// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SessionType } from '@kitman/services/src/services/getSessionTypes';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';
import type {
  RecurrenceChangeScope,
  CreatableEventType,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import type { Competition, OpponentTeam } from '@kitman/common/src/types/Event';

type DetailedEvent = {
  id: number,
  name: string,
  session_type: SessionType,
  start_date: string,
  type?: CreatableEventType,
  competition?: Competition,
  opponent_team?: OpponentTeam,
  organisation_team?: { id: number, name: string, logo_full_path?: string },
};

export type EventDeletionPromptResponse = {
  assessments: Array<{
    detailed_event: DetailedEvent,
    detailed_assessments: [
      {
        name: string,
      }
    ],
    permission_granted: boolean,
  }>,
  imported_data: Array<{
    detailed_event: DetailedEvent,
    detailed_imports: Array<{
      id: string,
      type: 'CSV' | 'API',
      name: string,
      created_at: string,
      updated_at: string,
      source: {
        id: number,
        name: string,
        source_identifier: string,
      },
    }>,
  }>,
  issues: Array<{
    detailed_event: DetailedEvent,
    detailed_issues: Array<{
      athlete_fullname: string,
      occurrence_date: string,
      full_pathology: string,
      issue_occurrence_title: string,
      athlete_id: number,
      id: number,
      issue_type: IssueType,
    }>,
    permission_granted: boolean,
  }>,
};

const getEventDeletionPrompt = async ({
  eventId,
  eventScope,
  isRepeatEvent,
}: {
  eventId: number,
  eventScope: RecurrenceChangeScope,
  isRepeatEvent: boolean,
}): Promise<EventDeletionPromptResponse> => {
  const searchParams = new URLSearchParams();

  // $FlowIgnore[incompatible-call] search params can take in number
  searchParams.append('event_id', eventId);

  if (isRepeatEvent) {
    searchParams.append('scope', eventScope);
  }

  const { data } = await axios.get(
    `/ui/planning_hub/event_deletion_prompt?${searchParams.toString()}`
  );
  return data;
};

export default getEventDeletionPrompt;
