// @flow

/*
 *   This is a shameless copy and paste from the existing save note action
 *   found in app/javascript/components/AddNoteModal/actions.js
 *   Currently adding this here as:
 *     - The original service is tightly coupled within the note store
 *     - The note parameter is now optional
 *   This is a temporary shared service for use with TUE, Vaccinations and Allergies
 *   Each of these datamodels will have thier own endpoint in the future
 */
import $ from 'jquery';

type MedicalType = 'TUE' | 'Allergy' | 'Vaccination';
type NoteType = 0 | 1 | 2 | 3;
type NoteData = {
  attachment_ids: Array<number>,
  note_date: ?string,
  note_type: NoteType,
  medical_type: MedicalType,
  medical_name: ?string,
  injury_ids: Array<number>,
  illness_ids: Array<number>,
  note: string,
  expiration_date?: ?string,
  batch_number?: ?string,
  renewal_date?: ?string,
  restricted: boolean,
  psych_only: boolean,
};

export const prepareNoteData = (noteData: NoteData) => {
  const preparedNoteData = Object.assign({}, noteData);

  if (preparedNoteData.injury_ids && preparedNoteData.injury_ids.length === 0) {
    delete preparedNoteData.injury_ids;
  }

  if (
    preparedNoteData.illness_ids &&
    preparedNoteData.illness_ids.length === 0
  ) {
    delete preparedNoteData.illness_ids;
  }

  if (
    preparedNoteData.chronic_issue_ids &&
    preparedNoteData.chronic_issue_ids.length === 0
  ) {
    delete preparedNoteData.chronic_issue_ids;
  }

  preparedNoteData.restricted_to_psych = preparedNoteData.psych_only;
  delete preparedNoteData.psych_only;

  return preparedNoteData;
};

const saveNote = (athleteId: number, noteData: NoteData): Promise<any> => {
  return new Promise((resolve, reject) => {
    const preparedNoteData = prepareNoteData(noteData);
    $.ajax({
      method: 'POST',
      url: `/athletes/${athleteId}/medical_notes`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        athlete_id: athleteId,
        note: preparedNoteData,
        from_api: true,
        scope_to_org: true,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveNote;
