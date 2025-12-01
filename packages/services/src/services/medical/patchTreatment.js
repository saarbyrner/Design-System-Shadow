// @flow
import $ from 'jquery';
import moment from 'moment';
import type { Treatment } from '@kitman/modules/src/Medical/shared/types';

export type PatchTreatment = {
  referring_physician?: ?string,
  amount_charged?: ?string,
  discount?: ?string,
  amount_paid_insurance?: ?string,
  amount_due?: ?string,
  amount_paid_athlete?: ?string,
  date_paid?: ?moment,
  cpt_code?: ?string,
  is_billable?: ?boolean,
  athlete_id: number,
  id: number,
};

const patchTreatment = (
  id: number,
  treatment: PatchTreatment
): Promise<Treatment> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PATCH',
      url: `/medical/treatments/${id}`,
      contentType: 'application/json',
      data: JSON.stringify(treatment),
    })
      .done((response) => {
        resolve(response.treatment);
      })
      .fail(reject);
  });
};

export default patchTreatment;
