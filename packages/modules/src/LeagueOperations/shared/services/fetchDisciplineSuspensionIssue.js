// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SuspensionStatus } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';

type Reason = {
  id: number,
  reason_name: string,
};

type AdditionalNote = {
  id: number,
  content: string,
};

export type FetchDisciplineSuspensionIssueResponse = {
  id: number,
  kind: string,
  start_date: string | null,
  end_date: string | null,
  reasons: ?Array<Reason>,
  additional_notes: ?Array<AdditionalNote>,
  competitions: Array<string> | [],
  game_events: Array<any> | [],
  number_of_games: number | null,
  squad: any | null,
};

type ResponseType = {
  data: Array<FetchDisciplineSuspensionIssueResponse>,
  meta: {
    current_page: number,
    next_page: number | null,
    prev_page: number | null,
    total_count: number,
    total_pages: number,
  },
};

type RequestParams = {
  userId: number,
  suspensionStatus: SuspensionStatus,
  page?: number,
};

const fetchDisciplineSuspensionIssue = async ({
  userId,
  suspensionStatus = 'current',
  page,
}: RequestParams): Promise<ResponseType> => {
  const { data } = await axios.post('/discipline/search', {
    user_id: userId,
    current_only: suspensionStatus === 'current',
    past_only: suspensionStatus === 'past',
    archived: false,
    page,
  });

  return data;
};

export default fetchDisciplineSuspensionIssue;
