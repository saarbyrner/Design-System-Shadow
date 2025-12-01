// @flow
import type { Annotation } from '@kitman/common/src/types/Annotation';
import type { IssueOccurrenceRequested } from './Issues';

export type TreatmentBodyArea = {
  id: number,
  name: string,
  treatable_area_type: string,
  treatable_area: {
    id: number,
    name: string,
  },
  side: {
    id: number,
    name: string,
  },
};

export type Treatment = {
  id: number,
  treatment_modality: {
    id: number,
    name: string,
    treatment_category: {
      id: number,
      name: string,
    },
  },
  duration: number,
  reason: string,
  issue_name: ?string,
  issue_id: ?number,
  issue_type: string,
  issue: IssueOccurrenceRequested,
  treatment_body_areas: Array<TreatmentBodyArea>,
  note: string,
};

export type TreatmentSession = {
  id: ?number,
  user: {
    id: ?number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  athlete: {
    id: ?number,
    firstname: string,
    lastname: string,
    shortname: string,
  },
  start_time: string,
  end_time: string,
  timezone: string,
  title: string,
  created_by: {
    id: ?number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  note: ?string,
  treatments: Array<Treatment>,
  annotation: Annotation,
};

export type RehabSessionExercise = {
  id: number,
  rehab_exercise: {
    id: number,
    name: string,
    rehab_category: {
      id: number,
      name: string,
    },
  },
  sets: number,
  reps: number,
  weight: number,
  reason: string,
  issue_type: string,
  issue_name: string,
  issue_id: number,
  note: string,
};

export type RehabSession = {
  id: ?number,
  user: {
    id: ?number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  athlete: {
    id: ?number,
    firstname: string,
    lastname: string,
    shortname: string,
    fullname: string,
  },
  start_time: string,
  end_time: string,
  timezone: string,
  title: string,
  created_at: string,
  created_by: {
    id: ?number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  rehab_session_exercises: Array<RehabSessionExercise>,
  annotation: Annotation,
};
