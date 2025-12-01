// @flow
import $ from 'jquery';

type issuesOption = {
  key_name: string,
  name: string,
  isGroupOption?: boolean,
  occurrence_date?: string,
};

type treatableAreaOption = {
  description: string,
  isGroupOption: boolean,
  name: string,
  value: {
    side_id: number,
    treatable_area_id: number,
    treatable_area_type: string,
  },
};

type treatmentModalityOption = {
  key_name?: number,
  name: string,
  isGroupOption?: boolean,
};

export type TreatmentSessionOptions = {
  issues_options: Array<issuesOption>,
  treatable_area_options: Array<treatableAreaOption>,
  treatment_modality_options: Array<treatmentModalityOption>,
};

const getTreatmentSessionOptions = (
  athleteId: string | number
): Promise<TreatmentSessionOptions> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/medical/athletes/${athleteId}/treatment_session_options`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getTreatmentSessionOptions;
