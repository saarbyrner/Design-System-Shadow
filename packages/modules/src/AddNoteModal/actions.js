// @flow
import $ from 'jquery';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { NoteData, Action } from './types';
import prepareNoteData from './utils';

export const closeAddNoteModal = (): Action => ({
  type: 'CLOSE_ADD_NOTE_MODAL',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const updateNoteDate = (date: string): Action => ({
  type: 'UPDATE_NOTE_DATE',
  payload: {
    date,
  },
});

export const updateNoteType = (
  type: $PropertyType<NoteData, 'note_type'>
): Action => ({
  type: 'UPDATE_NOTE_TYPE',
  payload: {
    type,
  },
});

export const updateRelevantNoteInjuries = (issueId: number): Action => ({
  type: 'UPDATE_RELEVANT_NOTE_INJURIES',
  payload: {
    issueId,
  },
});

export const updateRelevantNoteIllnesses = (issueId: number): Action => ({
  type: 'UPDATE_RELEVANT_NOTE_ILLNESSES',
  payload: {
    issueId,
  },
});

export const copyLastNoteError = (errorMsg: string): Action => ({
  type: 'COPY_LAST_NOTE_ERROR',
  payload: {
    errorMsg,
  },
});

export const serverRequestError = (): Action => ({
  type: 'SERVER_REQUEST_ERROR',
});

export const serverRequestForLastNote = (): Action => ({
  type: 'SERVER_REQUEST_FOR_LAST_NOTE',
});

export const updateNote = (note: string): Action => ({
  type: 'UPDATE_NOTE',
  payload: {
    note,
  },
});

export const hideRequestStatus = (): Action => ({
  type: 'HIDE_REQUEST_STATUS',
});

export const getLastNote =
  (athleteId: string) => (dispatch: (action: Action) => void) => {
    dispatch(serverRequestForLastNote());
    $.ajax({
      url: `/athletes/${athleteId}/medical_notes/last_medical_note_by_current_user`,
      contentType: 'application/json',
      method: 'GET',
    })
      .done((data) => {
        if (data.error) {
          dispatch(hideAppStatus());
          dispatch(copyLastNoteError(data.error));
        } else {
          const note = `[Copied from note: ${data.note_date}] ${data.note}`;
          dispatch(hideAppStatus());
          dispatch(updateNote(note));
        }
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const updateNoteMedicalType = (medicalType: string): Action => ({
  type: 'UPDATE_NOTE_MEDICAL_TYPE',
  payload: {
    medicalType,
  },
});

export const updateNoteMedicalTypeName = (name: string): Action => ({
  type: 'UPDATE_NOTE_MEDICAL_TYPE_NAME',
  payload: {
    name,
  },
});

export const updateNoteAttachments = (file: File, index: number): Action => ({
  type: 'UPDATE_NOTE_ATTACHMENTS',
  payload: {
    file,
    index,
  },
});

export const updateNoteExpDate = (date: string): Action => ({
  type: 'UPDATE_NOTE_EXP_DATE',
  payload: {
    date,
  },
});

export const updateNoteBatchNumber = (batchNumber: string): Action => ({
  type: 'UPDATE_NOTE_BATCH_NUMBER',
  payload: {
    batchNumber,
  },
});

export const updateNoteRenewalDate = (date: string): Action => ({
  type: 'UPDATE_NOTE_RENEWAL_DATE',
  payload: {
    date,
  },
});

export const updateIsRestricted = (checked: boolean): Action => ({
  type: 'UPDATE_IS_RESTRICTED',
  payload: {
    checked,
  },
});

export const updatePsychOnly = (checked: boolean): Action => ({
  type: 'UPDATE_PSYCH_ONLY',
  payload: {
    checked,
  },
});

export const saveAthleteProfileNoteSuccess = (
  isRestricted: boolean
): Action => ({
  type: 'SAVE_ATHLETE_PROFILE_NOTE_SUCCESS',
  payload: {
    isRestricted,
  },
});

export const serverRequest = (): Action => ({
  type: 'SERVER_REQUEST',
});

export const saveAthleteProfileNote =
  (athleteId: number, noteData: NoteData, triggerReloadPage: boolean) =>
  (dispatch: (action: Action) => void) => {
    const preparedNoteData = prepareNoteData(noteData);
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: `/athletes/${athleteId}/medical_notes`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        athlete_id: athleteId,
        note: preparedNoteData,
        from_api: true,
      }),
    })
      .done((response) => {
        dispatch(
          saveAthleteProfileNoteSuccess(
            response.note.restricted || response.note.restricted_to_psych
          )
        );
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
        setTimeout(() => {
          dispatch(closeAddNoteModal());
          // when called from a Rails environment we have to reload the page
          // to see the newly added note
          if (triggerReloadPage) {
            window.location.reload();
          }
        }, 1050);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const updateAttachmentIds = (attachmentId: number): Action => ({
  type: 'UPDATE_ATTACHMENT_IDS',
  payload: {
    attachmentId,
  },
});

export const uploadAttachments =
  (file: File, index: number) => (dispatch: (action: Action) => void) => {
    const formData = new FormData();
    formData.append('attachment', file);
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: '/attachments',
      contentType: false,
      processData: false,
      data: formData,
    })
      .done((response) => {
        dispatch(updateAttachmentIds(response.attachment_id));
        dispatch(updateNoteAttachments(file, index));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const serverRequestForNoteIssues = (): Action => ({
  type: 'SERVER_REQUEST_FOR_NOTE_ISSUES',
});

export const updateNoteIssues = (
  injuries: Array<?IssueOccurrenceRequested>,
  illnesses: Array<?IssueOccurrenceRequested>
): Action => ({
  type: 'UPDATE_NOTE_ISSUES',
  payload: {
    injuries,
    illnesses,
  },
});

export const getNoteIssues =
  (athleteId: string) => (dispatch: (action: Action) => void) => {
    dispatch(serverRequestForNoteIssues());
    $.ajax({
      url: `/athletes/${athleteId}/issues`,
      contentType: 'application/json',
      method: 'GET',
    })
      .done((response) => {
        dispatch(hideAppStatus());
        dispatch(updateNoteIssues(response.injuries, response.illnesses));
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };
