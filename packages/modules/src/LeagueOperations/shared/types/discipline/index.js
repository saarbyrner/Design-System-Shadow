// @flow
// https://kitmanlabs.atlassian.net/wiki/spaces/ENG/pages/234324057/Discipline+API+Contracts

import type {
  Meta,
  Organisation,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type DisciplineSearchParams = {
  search_expression: string,
  page: number,
  per_page: number,
  competition_ids: number[],
  date_range: {
    start_date: string | null,
    end_date: string | null,
  },
  yellow_cards: { min: number | null, max: number | null },
  red_cards: { min: number | null, max: number | null },
};

export type IssueType = 'red_card' | 'yellow_card';

export type DisciplineOrganisation = {
  id: number,
  logo_full_path: string,
  name: string,
};

export type DisciplineSquad = {
  id: number,
  name: string,
};

export type DisciplinaryIssue = {
  type: IssueType,
  count?: number,
  game?: ?Object,
  competition_id?: ?Object,
  division?: {
    id: number,
    association_id: number,
    name: string,
  },
};

export type DisciplineReason = {
  id: number,
  reason_name: string,
};
export type DisciplineCompetition = {
  id: number,
  name: string,
};

export type DisciplinaryStatus = 'Eligible' | 'Suspended' | 'Banned';

export type DisciplinaryIssueMode =
  | 'CREATE_DISCIPLINARY_ISSUE'
  | 'UPDATE_DISCIPLINARY_ISSUE'
  | 'DELETE_DISCIPLINARY_ISSUE';

export type DisciplineActiveIssue = {
  id: number,
  start_date: string,
  end_date: string,
  reasons: Array<DisciplineReason>,
  kind: string,
  number_of_games: number,
  squad: DisciplineSquad,
  additional_notes: Array<{ id: number, content: string }>,
  competitions: Array<DisciplineCompetition>,
} | null;

export type DisciplineSearchItem = {
  user_id: number,
  firstname: string,
  lastname: string,
  avatar_url: string,
  organisations: Array<Organisation>,
  squads: Array<DisciplineSquad>,
  jersey_number?: number,
  disciplinary_issues: Array<DisciplinaryIssue>,
  total_disciplines: number,
  active_discipline_end_date: ?string,
  discipline_status: DisciplinaryStatus,
  active_discipline: DisciplineActiveIssue,
  number_of_active_disciplines?: number,
};

export type DisciplineSearchResponse = {
  data: Array<DisciplineSearchItem>,
  meta: Meta,
};

export type DisciplineProfile = {
  name: string,
  user_id: number,
  squads?: Array<{ id: number, name: string }>,
  organisations: Array<DisciplineOrganisation>,
};

export type CreateDisciplinaryIssueParams = {
  user_id: number,
  reason_ids: Array<number>,
  start_date: string,
  end_date: string,
  note: string,
  competition_ids: Array<number>,
  kind: string,
  squad_id: number,
  number_of_games: number,
};

export type UpdateDisciplinaryIssueParams = {
  id: number,
  user_id: number,
  reason_ids: Array<number>,
  start_date: string,
  end_date: string,
  note: string,
  active_discipline: DisciplineActiveIssue,
  competition_ids: Array<number>,
  kind: string,
  squad_id: number,
  number_of_games: number,
};

export type DeleteDisciplinaryIssueParams = {
  id: number,
};

export type DisciplinaryIssueParam = number | string | Array<number> | null;

export type DisciplineReasonOption = {
  id: number,
  reason_name: string,
};

export type DisciplineDispatch<T> = (action: T) => any;

export type NextGameDisciplineIssueParams = {
  number_of_games: number,
  squad_id: number,
  start_date: string,
  competition_ids: Array<number>,
};
