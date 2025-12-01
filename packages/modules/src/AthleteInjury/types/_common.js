// @flow
import type { Note, Osics } from '@kitman/common/src/types/Issues';

export type IssueStatusOption = {
  title: string,
  description?: string,
  id: string,
  cause_unavailability: boolean,
  restore_availability: boolean,
  order: number,
};

export type IssueStatusEvent = {
  id: number,
  injury_status_id: string,
  date: string,
};

export type IssueOccurrence = {
  id: number,
  athlete_id: string,
  side_id: string,
  acivity_id: string,
  game_id: string,
  training_session_id: string,
  occurrence_min: number,
  supplementary_pathology: string,
  occurrence_date: string,
  created_at: string,
  created_by: string,
  position_when_injured_id: string,
  notes: Array<Note>,
  modification_info: string,
  events_order: Array<string>,
  events: { string: IssueStatusEvent },
  osics: Osics,
  type_id: string,
  onset_id?: string,
};

export type PriorIssue = {
  id: $PropertyType<IssueOccurrence, 'id'>,
  name: string,
  side_id: $PropertyType<IssueOccurrence, 'side_id'>,
  occurrence_date: $PropertyType<IssueOccurrence, 'occurrence_date'>,
  resolved_date: string,
  osics: Osics,
  type_id: $PropertyType<IssueOccurrence, 'type_id'>,
  onset_id?: $PropertyType<IssueOccurrence, 'onset_id'>,
};

export type PriorIssues = {
  prior_injuries: Array<PriorIssue>,
  prior_illnesses: Array<PriorIssue>,
};

export type Site = {
  [string]: string,
};

export type BamicGrades = {
  bamicGrades: {
    [string]: {
      name: string,
      sites: Array<?Site>,
    },
  },
};

export type Onset = {
  id: number,
  name: string,
};
