// @flow
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';

// note type IDs:
// STANDARD_NOTE_ID = 0
// INJURY_NOTE_ID = 1
// ILLNESS_NOTE_ID = 2
// MEDICAL_NOTE_ID = 3
export type NoteData = {
  attachment_ids: Array<?number>,
  note_date: ?string,
  min_date?: string,
  max_date?: string,
  note_type: 0 | 1 | 2 | 3 | null,
  medical_type: ?string, // eg. TUE
  medical_name: ?string, // eg. 'Custom name'
  injury_ids: Array<?number>,
  illness_ids: Array<?number>,
  note: string,
  expiration_date: ?string,
  batch_number: ?string,
  renewal_date: ?string,
  restricted: boolean,
  psych_only: boolean,
};

type closeAddNoteModal = {
  type: 'CLOSE_ADD_NOTE_MODAL',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type updateNoteDate = {
  type: 'UPDATE_NOTE_DATE',
  payload: {
    date: $PropertyType<NoteData, 'note_date'>,
  },
};

type updateNoteType = {
  type: 'UPDATE_NOTE_TYPE',
  payload: {
    type: $PropertyType<NoteData, 'note_type'>,
  },
};

type updateRelevantNoteInjuries = {
  type: 'UPDATE_RELEVANT_NOTE_INJURIES',
  payload: {
    issueId: number,
  },
};

type updateRelevantNoteIllnesses = {
  type: 'UPDATE_RELEVANT_NOTE_ILLNESSES',
  payload: {
    issueId: number,
  },
};

type copyLastNoteError = {
  type: 'COPY_LAST_NOTE_ERROR',
  payload: {
    errorMsg: string,
  },
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

type serverRequestForLastNote = {
  type: 'SERVER_REQUEST_FOR_LAST_NOTE',
};

type updateNote = {
  type: 'UPDATE_NOTE',
  payload: {
    note: $PropertyType<NoteData, 'note'>,
  },
};

type updateNoteMedicalType = {
  type: 'UPDATE_NOTE_MEDICAL_TYPE',
  payload: {
    medicalType: $PropertyType<NoteData, 'medical_type'>,
  },
};

type updateNoteMedicalTypeName = {
  type: 'UPDATE_NOTE_MEDICAL_TYPE_NAME',
  payload: {
    name: $PropertyType<NoteData, 'medical_name'>,
  },
};

type updateNoteAttachments = {
  type: 'UPDATE_NOTE_ATTACHMENTS',
  payload: {
    file: File,
    index: number,
  },
};

type updateNoteExpDate = {
  type: 'UPDATE_NOTE_EXP_DATE',
  payload: {
    date: $PropertyType<NoteData, 'expiration_date'>,
  },
};

type updateNoteBatchNumber = {
  type: 'UPDATE_NOTE_BATCH_NUMBER',
  payload: {
    batchNumber: $PropertyType<NoteData, 'batch_number'>,
  },
};

type updateNoteRenewalDate = {
  type: 'UPDATE_NOTE_RENEWAL_DATE',
  payload: {
    date: $PropertyType<NoteData, 'renewal_date'>,
  },
};

type updateIsRestricted = {
  type: 'UPDATE_IS_RESTRICTED',
  payload: {
    checked: $PropertyType<NoteData, 'restricted'>,
  },
};

type updatePsychOnly = {
  type: 'UPDATE_PSYCH_ONLY',
  payload: {
    checked: $PropertyType<NoteData, 'psych_only'>,
  },
};

type saveAthleteProfileNoteSuccess = {
  type: 'SAVE_ATHLETE_PROFILE_NOTE_SUCCESS',
  payload: {
    isRestricted: boolean,
  },
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type updateAttachmentIds = {
  type: 'UPDATE_ATTACHMENT_IDS',
  payload: {
    attachmentId: number,
  },
};

type serverRequestForNoteIssues = {
  type: 'SERVER_REQUEST_FOR_NOTE_ISSUES',
};

type updateNoteIssues = {
  type: 'UPDATE_NOTE_ISSUES',
  payload: {
    injuries: Array<?IssueOccurrenceRequested>,
    illnesses: Array<?IssueOccurrenceRequested>,
  },
};

type hideRequestStatus = {
  type: 'HIDE_REQUEST_STATUS',
};

export type Action =
  | closeAddNoteModal
  | updateNoteDate
  | updateNoteType
  | updateRelevantNoteInjuries
  | updateRelevantNoteIllnesses
  | updateNote
  | updateIsRestricted
  | updatePsychOnly
  | hideAppStatus
  | serverRequest
  | serverRequestError
  | saveAthleteProfileNoteSuccess
  | updateNoteMedicalType
  | updateNoteMedicalTypeName
  | updateNoteAttachments
  | updateNoteExpDate
  | updateNoteBatchNumber
  | updateNoteRenewalDate
  | serverRequestForLastNote
  | copyLastNoteError
  | serverRequestForNoteIssues
  | updateNoteIssues
  | hideRequestStatus
  | updateAttachmentIds;
