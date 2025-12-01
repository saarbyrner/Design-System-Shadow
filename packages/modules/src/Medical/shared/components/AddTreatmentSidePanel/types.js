// @flow
import moment from 'moment-timezone';

import type { MedicalLocationType } from '@kitman/services/src/services/medical/getMedicalLocations';
import type { Annotation, Athlete, User, Issue } from '../../types';

export type UnuploadedFile = {
  filename: string,
  fileType: string,
  fileSize: number,
  file: File,
};

export type Reason = {
  issue_id: ?number,
  issue_type: ?string,
  reason: string,
};

export type QueuedAttachment = {
  filename: string,
  fileType: string,
  fileSize: number,
  file: File,
  id: string,
};

export type TreatmentModality = {
  id: number,
  name: string,
  treatment_category: {
    id: number,
    name: string,
  },
};

export type BodyArea = {
  id: number,
  name: string,
  side: {
    id: number,
    name: string,
  },
  treatable_area: {
    id: number,
    name: string,
  },
  treatable_area_type: string,
};

export type TreatmentAttribute = {
  treatment_modality: number,
  duration: ?string,
  reason: ?string,
  issue_type: ?string,
  issue_id: ?number,
  issue: ?Issue,
  treatment_body_areas: Array<string>,
  is_billable: boolean,
  cpt_code: string,
  icd_code: string,
  amount_charged: string,
  discount: string,
  amount_paid_insurance: string,
  amount_due: string,
  amount_paid_athlete: string,
  date_paid: string,
  note: ?string,
};

export type BillableItem = {
  icd_code: string,
  cpt_code: string,
  is_billable: boolean,
  amount_charged: string,
  discount: string,
  amount_paid_insurance: string,
  amount_due: string,
  amount_paid_athlete: string,
  date_paid: ?string,
};

export type DuplicateTreatmentAttribute = {
  treatment_modality: TreatmentModality,
  duration: ?string,
  reason: ?string,
  issue_type: ?string,
  issue_id: ?string,
  issue: ?Issue,
  treatment_body_areas: Array<BodyArea>,
  is_billable: boolean,
  billable_items: Array<BillableItem>,
  cpt_code: string,
  icd_code: string,
  amount_charged: string,
  discount: string,
  amount_paid_insurance: string,
  amount_due: string,
  amount_paid_athlete: string,
  date_paid: string,
  note: ?string,
};

export type DuplicateTreatmentSession = {
  annotation: Annotation,
  athlete: Athlete,
  created_at: string,
  created_by: User,
  end_time: string,
  id: number,
  start_time: string,
  timezone: string,
  treatments: Array<DuplicateTreatmentAttribute>,
  user: User,
};

export type AttachmentAttribute = {
  original_filename: string,
  filetype: string,
  filesize: number,
};

export type TreatmentTimeDate = {
  startDate: moment,
  startTime: moment,
  endDate: moment,
  endTime: moment,
  timezone: string,
  duration: string,
};

export type CreateTreatmentFormState = {
  athleteId?: ?number,
  practitionerId?: ?number,
  referringPhysician: string,
  date: TreatmentTimeDate,
  duration: ?string,
  treatmentsAttributes: Array<TreatmentAttribute>,
  queuedAttachments?: ?Array<QueuedAttachment>,
  queuedAttachmentTypes: Array<string>,
  annotationAttributes: {
    content: string,
    attachments_attributes: Array<any>,
  },
  issue: ?Issue,
  modalities: Array<number>,
  bodyAreas: Array<string>,
  reason: ?Reason,
  multiDuration: ?string,
  medicalLocations: Array<MedicalLocationType>,
};
