// @flow
import type { TreatmentSession } from '@kitman/modules/src/Medical/shared/types';

export type RequestResponse = {
  treatment_sessions: Array<TreatmentSession>,
  total_count: number,
  meta: {
    next_page: number,
    current_page: number,
    prev_page: number,
    total_count: number,
    total_pages: number,
  },
};

export type IssuesOption = {
  key_name: string,
  name: string,
  isGroupOption: boolean,
};

export type TreatableAreaOption = {
  description: string,
  isGroupOption: boolean,
  name: string,
  value: {
    side_id: number,
    treatable_area_id: number,
    treatable_area_type: string,
  },
};

export type TreatmentModalityOption = {
  key_name?: number,
  name: string,
  isGroupOption?: boolean,
};

export type CreateTreatmentState = {
  athlete_id: number,
  date: string,
  user_id: number,
  referring_physician: string,
  start_time: string,
  end_time: string,
  timezone: string,
  treatments_attributes: Array<{
    treatment_modality_id: ?number,
    duration: ?string,
    reason: ?string,
    issue_type: ?string,
    issue_id: ?string,
    treatment_body_areas_attributes: Array<string>,
    is_billable: boolean,
    cpt_code: string,
    amount_paid_insurance: string,
    amount_paid_athlete: string,
    note: ?string,
  }>,
  annotation_attributes: {
    content: string,
  },
};
