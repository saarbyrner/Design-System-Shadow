// @flow
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';

export type Lot = {
  id: ?number,
  dispensed_quantity: ?number,
};
export type Issue = {
  type: ?string,
  id: ?number,
};

export type StockMedicationData = {
  athlete_id: ?number,
  prescriber_sgid: ?string,
  prescription_date: ?string,
  tapered: boolean,
  dose: ?string, // not required if tapered == true
  drug_id?: number,
  external_drug_id?: ?string,
  stock_lots: Array<Lot>,
  directions: ?string, // not required if tapered == true
  frequency: ?string, // not required if tapered == true
  quantity: ?string,
  route: string,
  start_date: string,
  end_date: string,
  duration: string,
  note: string,
  issues: Array<Issue>,
  attachments: Array<AttachedTransformedFile>,
};

export type RequestResponse = {
  archived: boolean,
  athlete_id: ?number,
  attachments: Array<Attachment>,
  directions: ?string, // not required if tapered == true
  display_name: string,
  dose: ?string, // not required if tapered == true
  drug: { id: number, name: string },
  drug_type: string,
  external_prescriber_name: string,
  frequency: ?string, // not required if tapered == true
  id: number,
  issue: { id: number, issue_type: string },
  medication_stock_lots: Array<Lot>,
  pause_reason: ?string,
  paused: boolean,
  pharmacy: ?string,
  prescriber_sgid: string,
  prescription_date: string,
  illness_occurrence_ids: number[],
  injury_occurrence_ids: number[],
  chronic_issue_ids: number[],
  medication: string,
  stock_lots: Array<Lot>,
  tapered: boolean,
  quantity: string,
  quantity_units: ?string,
  reason: ?string,
  refills: ?string,
  status: ?string,
  type: ?string,
  route: string,
  start_date: string,
  end_date: string,
  duration: string,
  note: string,
};
