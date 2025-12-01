// @flow
import $ from 'jquery';
import type { TreatmentSession } from '@kitman/modules/src/Medical/shared/types';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';

export type RequestResponse = {
  treatment_session: TreatmentSession,
};

type PostTreatmentBodyAreaAttribute = {
  treatable_area_type: string,
  treatable_area_id: number,
  side_id: number,
};

type PostBillableItemAttributes = {
  cpt_code: string,
  amount_charged: string,
  discount: string,
  amount_paid_insurance: string,
  amount_due: string,
  amount_paid_athlete: string,
  date_paid: string,
};

type TreatmentAttribute = {
  treatment_modality_id: ?number,
  duration: ?string,
  reason: ?string,
  issue_type: ?string,
  issue_id: ?number,
  treatment_body_areas_attributes: Array<PostTreatmentBodyAreaAttribute>,
  treatment_billable_item_attributes: PostBillableItemAttributes,
  is_billable: boolean,
  note: ?string,
};

export type TreatmentRequest = {
  athlete_id: number,
  user_id: number,
  start_time: string,
  end_time: string,
  timezone: string,
  title: string,
  referring_physician: string,
  treatments_attributes: Array<TreatmentAttribute>,
  annotation_attributes: {
    content: string,
    attachments_attributes: Array<AttachedTransformedFile>,
  },
};

const saveTreatment = (
  treatmentRequest: TreatmentRequest
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/treatment_sessions',
      contentType: 'application/json',
      data: JSON.stringify(treatmentRequest),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default saveTreatment;
