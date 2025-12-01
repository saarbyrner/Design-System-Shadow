// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';

export type MedicalAlert = {
  id: number,
  name: string,
};

export type RequestResponse = {
  alert_title: string,
  athlete_id: number,
  diagnosed_on?: string,
  id: number,
  severity: string,
  athlete: Athlete,
  medical_alert: MedicalAlert,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  display_name: string,
  created_at?: string,
  created_by?: {
    firstname: string,
    fullname: string,
    id: number,
    lastname: string,
  },
  versions: Object,
};
