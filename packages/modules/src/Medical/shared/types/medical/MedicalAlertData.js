// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';

export type MedicalAlertData = {
  medical_alert_id: ?number,
  alert_title: string,
  athlete_id: ?number,
  severity: string,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  diagnosed_on?: string,
};

export type RequestResponse = {
  medical_alert_id: ?number,
  alert_title: string,
  athlete_id: number,
  diagnosed_on?: string,
  id: number,
  severity: string,
  athlete: Athlete,
  medical_alert: Object,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
};
