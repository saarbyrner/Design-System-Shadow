// @flow
import $ from 'jquery';

type CreatedBy = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

type MedicalMeta = {
  note_medical_type: string,
  medical_name: string,
  expiration_date: Date,
  batch_number: string,
  renewal_date: Date,
};

type Attachment = {
  filetype: string,
  filesize: number,
  filename: string,
  url: string,
};

export type MedicalHistory = {
  id: number,
  date: Date,
  note?: string,
  created_by: CreatedBy,
  restricted?: boolean,
  psych_only?: boolean,
  medical_meta: MedicalMeta,
  attachments: Array<Attachment>,
};

export type MedicalHistories = Array<MedicalHistory>;

type MedicalHistoryResponse = Promise<MedicalHistories>;

const getAthleteMedicalHistory = (
  athleteId: number
): MedicalHistoryResponse => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/medical/athletes/${athleteId}/medical_history`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthleteMedicalHistory;
