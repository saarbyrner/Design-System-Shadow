// @flow
import type {
  FormAthlete,
  FormDescription,
  IssueDetails,
  ConcussionDiagnosed,
  InjuryOccurrence,
} from '@kitman/modules/src/Medical/shared/types';

export type BaselineValues = {
  form_id?: number,
  status: FormDescription,
  test: string,
  group: string,
  examiner: string,
  expiry_date?: string,
  editorFullName?: string,
  date_completed?: string,
};

export type Baselines = {
  athlete?: FormAthlete,
  baselines: Array<BaselineValues>,
};

export type BaselinesRoster = {
  athlete_baselines: Array<Baselines>,
  meta: {
    current_page: number,
    next_page: ?number,
    prev_page: ?number,
    total_count: number,
    total_pages: number,
  },
};

export type AnswerSet = {
  id: number,
  organisation_id: number,
  form: {
    id: number,
    category: string,
    group: string,
    key: string,
    name: string,
    fullname: string,
    enabled: boolean,
    created_at: string,
    updated_at: string,
  },
  status?: FormDescription,
  expiry_date?: string,
  date: string,
  editor: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  concussion_diagnosed?: ConcussionDiagnosed,
  concussion_injury?: {
    injury: IssueDetails,
    injury_occurrence: InjuryOccurrence,
  },
  athlete?: FormAthlete,
  baselines: ?Array<BaselineValues>,
};

export type FormAnswerSet = Baselines | AnswerSet;
