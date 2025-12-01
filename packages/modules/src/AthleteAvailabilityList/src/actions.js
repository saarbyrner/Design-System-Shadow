// @flow
import type { GroupBy } from '@kitman/common/src/types/index';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type {
  Athlete as TreatmentAthlete,
  Action as TreatmentAction,
  treatableAreOptionResponse,
} from '@kitman/modules/src/TreatmentSessionModal/types';
import type {
  GroupedDropdownItem,
  ToastAction,
} from '@kitman/components/src/types';
import type {
  AlarmFilterOptions,
  AthleteFilterOptions,
  AvailabilityFilterOptions,
} from '@kitman/common/src/types/__common';
import $ from 'jquery';
import closeToastItem from '@kitman/components/src/Toast/actions';
import {
  closeTreatmentSessionModal,
  saveTreatmentSessionLoading,
  populateTreatmentSessionModalLoading,
  populateTreatmentSessionModalFailure,
  saveTreatmentSessionSuccess,
  saveTreatmentSessionFailure,
} from '@kitman/modules/src/TreatmentSessionModal/actions';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { transformFilesForUpload } from '@kitman/common/src/utils/fileHelper';
import type {
  Action,
  ThunkAction,
  Athlete,
  AbsenceData,
  ModInfoData,
  ModRTPData,
  DiagnosticData,
} from '../types';

export const openAddAbsenceModal = (athlete: ?Athlete): Action => ({
  type: 'OPEN_ADD_ABSENCE_MODAL',
  payload: {
    athlete,
  },
});

export const closeAddAbsenceModal = (): Action => ({
  type: 'CLOSE_ADD_ABSENCE_MODAL',
});

export const updateAbsenceReasonType = (reasonId: number): Action => ({
  type: 'UPDATE_ABSENCE_REASON_TYPE',
  payload: {
    reasonId,
  },
});

export const updateAbsenceFromDate = (date: string): Action => ({
  type: 'UPDATE_ABSENCE_FROM_DATE',
  payload: {
    date,
  },
});

export const updateAbsenceToDate = (date: string): Action => ({
  type: 'UPDATE_ABSENCE_TO_DATE',
  payload: {
    date,
  },
});

export const openAddNoteModal = (athlete: ?Athlete): Action => ({
  type: 'OPEN_ADD_NOTE_MODAL',
  payload: {
    athlete,
  },
});

export const openModInfoModal = (athlete: ?Athlete): Action => ({
  type: 'OPEN_MOD_INFO_MODAL',
  payload: {
    athlete,
  },
});

export const closeModInfoModal = (): Action => ({
  type: 'CLOSE_MOD_INFO_MODAL',
});

export const openRTPModal = (athlete: ?Athlete): Action => ({
  type: 'OPEN_RTP_MODAL',
  payload: {
    athlete,
  },
});

export const closeRTPModal = (): Action => ({
  type: 'CLOSE_RTP_MODAL',
});

export const openTreatmentModal = (athlete: TreatmentAthlete): Action => ({
  type: 'OPEN_TREATMENT_MODAL',
  payload: {
    athlete,
  },
});

export const openDiagnosticModal = (athlete: ?Athlete): Action => ({
  type: 'OPEN_DIAGNOSTIC_MODAL',
  payload: {
    athlete,
  },
});

export const closeDiagnosticModal = (): Action => ({
  type: 'CLOSE_DIAGNOSTIC_MODAL',
});

export const openInjuryUploadModal = (): Action => ({
  type: 'OPEN_INJURY_UPLOAD_MODAL',
});

export const closeInjuryUploadModal = (): Action => ({
  type: 'CLOSE_INJURY_UPLOAD_MODAL',
});

export const toggleAthleteFilters = (isFilterShown: boolean): Action => ({
  type: 'TOGGLE_ATHLETE_FILTERS',
  payload: {
    isFilterShown,
  },
});

export const updateFilterOptions = (
  groupBy: GroupBy,
  alarmFilters: Array<?AlarmFilterOptions>,
  athleteFilters: Array<?AthleteFilterOptions>
): Action => ({
  type: 'UPDATE_FILTER_OPTIONS',
  payload: {
    groupBy,
    alarmFilters,
    athleteFilters,
  },
});
// serverRequestForAvailabilityFilteredAthletes
export const updateModInfoText = (text: string): Action => ({
  type: 'UPDATE_MOD_INFO_TEXT',
  payload: {
    text,
  },
});

export const updateModInfoRtp = (rtp: string): Action => ({
  type: 'UPDATE_MOD_INFO_RTP',
  payload: {
    rtp,
  },
});

export const updateInjuryUploadFile = (file: File): Action => ({
  type: 'UPDATE_INJURY_UPLOAD_FILE',
  payload: {
    file,
  },
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const serverRequest = (): Action => ({
  type: 'SERVER_REQUEST',
});

export const serverRequestSuccess = (): Action => {
  window.location.reload(true);
  return {
    type: 'SERVER_REQUEST_SUCCESS',
  };
};

export const serverRequestError = (): Action => ({
  type: 'SERVER_REQUEST_ERROR',
});

export const saveAthleteAvailabilityModInfoSuccess = (): Action => ({
  type: 'SAVE_ATHLETE_AVAILABILITY_MOD_INFO_SUCCESS',
});

export const saveAthleteAvailabilityDiagnosticSuccess = (): Action => ({
  type: 'SAVE_ATHLETE_AVAILABILITY_DIAGNOSTIC_SUCCESS',
});

export const saveUploadInjurySuccess = (): Action => ({
  type: 'SAVE_UPLOAD_INJURY_SUCCESS',
});

export const saveUploadInjuryError = (
  errors: Array<string>,
  totalRows: number,
  skippedRows: number
): Action => ({
  type: 'SAVE_UPLOAD_INJURY_ERROR',
  payload: {
    errors,
    totalRows,
    skippedRows,
  },
});

export const updateAthleteModInfo = (
  athleteId: number,
  info: string,
  rtp: string
): Action => ({
  type: 'UPDATE_ATHLETE_MODINFO',
  payload: {
    athleteId,
    info,
    rtp,
  },
});

export const serverRequestForDiagnosticIssues = (): Action => ({
  type: 'SERVER_REQUEST_FOR_DIAGNOSTIC_ISSUES',
});

export const updateDiagnosticIssues = (
  injuries: Array<?IssueOccurrenceRequested>,
  illnesses: Array<?IssueOccurrenceRequested>
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_ISSUES',
  payload: {
    injuries,
    illnesses,
  },
});

export const getDiagnosticIssues =
  (athleteId: string) => (dispatch: (action: Action) => void) => {
    dispatch(serverRequestForDiagnosticIssues());
    $.ajax({
      url: `/athletes/availability/${athleteId}/issues`,
      contentType: 'application/json',
      method: 'GET',
    })
      .done((response) => {
        dispatch(hideAppStatus());
        dispatch(updateDiagnosticIssues(response.injuries, response.illnesses));
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const updateDiagnosticAttachments = (
  file: File,
  index: number
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_ATTACHMENTS',
  payload: {
    file,
    index,
  },
});

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
        dispatch(updateDiagnosticAttachments(file, index));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const updateDiagnosticType = (typeId: number): Action => ({
  type: 'UPDATE_DIAGNOSTIC_TYPE',
  payload: {
    typeId,
  },
});

export const updateDiagnosticDate = (date: string): Action => ({
  type: 'UPDATE_DIAGNOSTIC_DATE',
  payload: {
    date,
  },
});

export const updateRelevantDiagnosticInjuries = (issueId: number): Action => ({
  type: 'UPDATE_RELEVANT_DIAGNOSTIC_INJURIES',
  payload: {
    issueId,
  },
});

export const updateRelevantDiagnosticIllnesses = (issueId: number): Action => ({
  type: 'UPDATE_RELEVANT_DIAGNOSTIC_ILLNESSES',
  payload: {
    issueId,
  },
});

export const updateDiagnosticMedicationType = (type: string): Action => ({
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_TYPE',
  payload: {
    type,
  },
});

export const updateDiagnosticMedicationDosage = (dosage: string): Action => ({
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_DOSAGE',
  payload: {
    dosage,
  },
});

export const updateDiagnosticMedicationFrequency = (
  frequency: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_FREQUENCY',
  payload: {
    frequency,
  },
});

export const updateDiagnosticMedicationNotes = (notes: string): Action => ({
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_NOTES',
  payload: {
    notes,
  },
});

export const updateDiagnosticMedicationCompleted = (
  isCompleted: boolean
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_COMPLETED',
  payload: {
    isCompleted,
  },
});

export const saveDiagnostic =
  (athleteId: number, diagnosticData: DiagnosticData) =>
  (dispatch: (action: Action) => void) => {
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: `/athletes/${athleteId}/diagnostics`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        diagnostic: {
          attachment_ids: diagnosticData.attachment_ids,
          diagnostic_type_id: diagnosticData.diagnostic_type,
          diag_date: diagnosticData.diagnostic_date,
          injury_ids: diagnosticData.injury_ids,
          illness_ids: diagnosticData.illness_ids,
          medication_type: diagnosticData.medication_type,
          medication_dosage: diagnosticData.medication_dosage,
          medication_frequency: diagnosticData.medication_frequency,
          medication_notes: diagnosticData.medication_notes,
          medication_completed: diagnosticData.medication_completed,
          medication_completed_at: diagnosticData.medication_completed_at,
          covid_test_date: diagnosticData.covid_test_date,
          covid_test_type: diagnosticData.covid_test_type,
          covid_result: diagnosticData.covid_result,
          covid_reference: diagnosticData.covid_reference,
          covid_antibody_test_date: diagnosticData.covid_antibody_test_date,
          covid_antibody_test_type: diagnosticData.covid_antibody_test_type,
          covid_antibody_result: diagnosticData.covid_antibody_result,
          covid_antibody_reference: diagnosticData.covid_antibody_reference,
          annotation_content: diagnosticData.annotation_content,
          restrict_access_to: diagnosticData.restrict_access_to,
        },
      }),
    })
      .done(() => {
        dispatch(saveAthleteAvailabilityDiagnosticSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
        setTimeout(() => {
          dispatch(closeDiagnosticModal());
        }, 1050);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const saveAbsence =
  (athleteId: number, absenceData: AbsenceData) =>
  (dispatch: (action: Action) => void) => {
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: `/athletes/${athleteId}/absences`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        athlete_id: athleteId,
        reason_id: absenceData.reason_id,
        from: absenceData.from,
        to: absenceData.to,
      }),
    })
      .done(() => {
        dispatch(serverRequestSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
        setTimeout(() => {
          dispatch(closeAddAbsenceModal());
        }, 1050);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const saveAthleteAvailabilityModInfo =
  (athleteId: number, modInfoData: ModInfoData | ModRTPData) =>
  (dispatch: (action: Action) => void) => {
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: `/athletes/availability/${athleteId}/quick_update`,
      contentType: 'application/json',
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      data: JSON.stringify({
        id: athleteId,
        athlete: modInfoData,
        from_api: true,
      }),
    })
      .done((response) => {
        dispatch(saveAthleteAvailabilityModInfoSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
        setTimeout(() => {
          dispatch(closeModInfoModal());
          dispatch(closeRTPModal());
          // update the availability table cells without reloading the page
          dispatch(
            updateAthleteModInfo(response.id, response.info, response.rtp)
          );
        }, 1010);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const saveUploadInjury =
  (file: File, trackEvent: (eventName: string) => void) =>
  (dispatch: (action: Action) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: '/athletes/availability/import_file',
      contentType: false,
      processData: false,
      data: formData,
    })
      .done((response) => {
        if (response.errors && response.errors.length > 0) {
          dispatch(hideAppStatus());
          let errors = [];
          response.errors.forEach((error) => {
            const dividedError = error.split(': ');
            errors.push(dividedError[0]);
            const separatedMsgs = dividedError[1].split(', ');
            errors = errors.concat(separatedMsgs);
          });
          dispatch(
            saveUploadInjuryError(
              errors,
              response.total_rows,
              response.skipped_rows
            )
          );
        } else {
          dispatch(saveUploadInjurySuccess());
          setTimeout(() => {
            dispatch(hideAppStatus());
          }, 1000);
          setTimeout(() => {
            dispatch(closeInjuryUploadModal());
          }, 1050);
          trackEvent('Import injuries');
        }
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const triggerFileUploadFailure = (fileId: number): Action => ({
  type: 'TRIGGER_FILE_UPLOAD_FAILURE',
  payload: {
    fileId,
  },
});

export const confirmFileUploadFailure = (fileId: number): Action => ({
  type: 'CONFIRM_FILE_UPLOAD_FAILURE',
  payload: {
    fileId,
  },
});

export const finishFileUpload = (fileId: number): Action => ({
  type: 'FINISH_FILE_UPLOAD',
  payload: {
    fileId,
  },
});

export const confirmFileUpload =
  (fileId: number): ThunkAction =>
  (dispatch: (action: Action | ToastAction | ThunkAction) => Action) => {
    $.ajax({
      type: 'PATCH',
      url: `/attachments/${fileId}/confirm`,
      processData: false,
      contentType: false,
      cache: false,
    })
      .done(() => {
        dispatch(finishFileUpload(fileId));
        setTimeout(() => {
          dispatch(closeToastItem(fileId));
        }, 5000);
      })
      .fail(() => {
        dispatch(confirmFileUploadFailure(fileId));
      });
  };

// S3 upload workflow:
// Save treatment session -> response contains S3 url for upload
// upload each file using the S3 url
// once upload is completed it sets a flag "confirmed: true" on the attachment (sent back in response)
export const triggerFileUpload =
  (file: File, fileId: number, presignedPost: Object): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    const formData = new FormData();
    Object.entries(presignedPost.fields).forEach(([k, v]) => {
      // $FlowFixMe
      formData.append(k, v);
    });
    formData.append('file', file);

    $.ajax({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: presignedPost.url,
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
    })
      .done(() => {
        dispatch(confirmFileUpload(fileId));
      })
      .fail(() => {
        dispatch(triggerFileUploadFailure(fileId));
      });
  };

export const triggerToastDisplayProgress = (
  fileName: string,
  fileSize: number,
  fileId: number
): Action => ({
  type: 'TRIGGER_TOAST_DISPLAY_PROGRESS',
  payload: {
    fileName,
    fileSize,
    fileId,
  },
});

export const updateTreatmentSessionStaticData = (responseOptions: {
  issues_options: Array<GroupedDropdownItem>,
  treatable_area_options: Array<treatableAreOptionResponse>,
  treatment_modality_options: Array<GroupedDropdownItem>,
}): Action => ({
  type: 'UPDATE_TREATMENT_SESSION_STATIC_DATA',
  payload: {
    responseOptions,
  },
});

export const saveTreatmentSession =
  (
    startTime: string,
    endTime: string,
    attachedFiles: AttachedFile[]
  ): ThunkAction =>
  (
    dispatch: (action: Action | TreatmentAction) => Action,
    getState: Function
  ) => {
    dispatch(saveTreatmentSessionLoading());
    const treatmentSession = getState().treatmentSessionModal.treatmentSession;
    const unUploadedFiles = attachedFiles;
    const transformedAttachments = transformFilesForUpload(attachedFiles);
    treatmentSession.start_time = startTime;
    treatmentSession.end_time = endTime;
    treatmentSession.annotation_attributes.attachments_attributes =
      transformedAttachments;

    $.ajax({
      method: 'POST',
      url: '/treatment_sessions',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify(treatmentSession),
    })
      .done((response) => {
        const unConfirmedFiles =
          response.treatment_session.annotation &&
          response.treatment_session.annotation.attachments.filter(
            (file) => file.confirmed === false
          );
        if (unConfirmedFiles && unConfirmedFiles.length > 0) {
          // order of files is kept (last added will be the last in the list),
          // so response attachment order is the same as the original file order
          unConfirmedFiles.forEach((responseFile, index) => {
            dispatch(
              // $FlowFixMe
              triggerFileUpload(
                unUploadedFiles[index].file,
                responseFile.id,
                responseFile.presigned_post
              )
            );
            dispatch(
              triggerToastDisplayProgress(
                unUploadedFiles[index].file.name,
                unUploadedFiles[index].file.size,
                responseFile.id
              )
            );
          });
        }

        dispatch(closeTreatmentSessionModal());
        dispatch(saveTreatmentSessionSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(saveTreatmentSessionFailure());
      });
  };

export const populateTreatmentSessionModal =
  (athleteId: number): ThunkAction =>
  (dispatch: (action: Action | TreatmentAction) => Action) => {
    dispatch(populateTreatmentSessionModalLoading());
    $.ajax({
      method: 'GET',
      url: `/athletes/availability/${athleteId}/treatments`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
    })
      .done((response) => {
        dispatch(updateTreatmentSessionStaticData(response));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(populateTreatmentSessionModalFailure());
      });
  };

export const triggerTreatmentSessionModal =
  (athlete: TreatmentAthlete): ThunkAction =>
  (dispatch: (action: Action | TreatmentAction | ThunkAction) => Action) => {
    dispatch(openTreatmentModal(athlete));
    dispatch(populateTreatmentSessionModal(athlete.id));
  };

export const updateDiagnosticCovidTestDate = (
  covidTestDate: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_TEST_DATE',
  payload: {
    covidTestDate,
  },
});

export const updateDiagnosticCovidTestType = (
  covidTestType: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_TEST_TYPE',
  payload: {
    covidTestType,
  },
});

export const updateDiagnosticCovidResult = (covidResult: string): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_RESULT',
  payload: {
    covidResult,
  },
});

export const updateDiagnosticCovidReference = (
  covidReference: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_REFERENCE',
  payload: {
    covidReference,
  },
});

export const updateDiagnosticCovidAntibodyTestDate = (
  covidAntibodyTestDate: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_DATE',
  payload: {
    covidAntibodyTestDate,
  },
});

export const updateDiagnosticCovidAntibodyTestType = (
  covidAntibodyTestType: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_TYPE',
  payload: {
    covidAntibodyTestType,
  },
});

export const updateDiagnosticCovidAntibodyResult = (
  covidAntibodyResult: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_RESULT',
  payload: {
    covidAntibodyResult,
  },
});

export const updateDiagnosticCovidAntibodyReference = (
  covidAntibodyReference: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_REFERENCE',
  payload: {
    covidAntibodyReference,
  },
});

export const updateDiagnosticAnnotationContent = (
  annotationContent: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_ANNOTATION_CONTENT',
  payload: {
    annotationContent,
  },
});

export const updateDiagnosticRestrictAccessTo = (
  restrictAccessTo: string
): Action => ({
  type: 'UPDATE_DIAGNOSTIC_RESTRICT_ACCESS_TO',
  payload: {
    restrictAccessTo,
  },
});

export const serverRequestForAthletesByAvailability = (): Action => ({
  type: 'SERVER_REQUEST_FOR_ATHLETES_BY_AVAILABILITY',
});

export const updateFilterOptionsByAvailability = (
  groupBy: GroupBy,
  alarmFilters: Array<?AlarmFilterOptions>,
  athleteFilters: Array<?AthleteFilterOptions>,
  availabilityFilters: Array<?AvailabilityFilterOptions>,
  athleteData: Array<?Athlete>
): Action => ({
  type: 'UPDATE_FILTER_OPTIONS_BY_AVAILABILITY',
  payload: {
    groupBy,
    alarmFilters,
    athleteFilters,
    availabilityFilters,
    athleteData,
  },
});

export const getAthletesByAvailability =
  (
    groupBy: GroupBy,
    alarmFilters: Array<?AlarmFilterOptions>,
    athleteFilters: Array<?AthleteFilterOptions>,
    availabilityFilters: Array<?AvailabilityFilterOptions>
  ) =>
  (dispatch: (action: Action) => void) => {
    dispatch(serverRequestForAthletesByAvailability());
    $.ajax({
      url: `/athletes/availability/filter_by_availability`,
      contentType: 'application/json',
      method: 'GET',
      data: {
        availability_filters: availabilityFilters,
      },
    })
      .done((response) => {
        dispatch(hideAppStatus());
        dispatch(
          updateFilterOptionsByAvailability(
            groupBy,
            alarmFilters,
            athleteFilters,
            availabilityFilters,
            response.map((athlete) => ({
              ...athlete,
              positionGroupId: athlete.position_group_id,
              positionId: athlete.position_id,
            }))
          )
        );
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const loadAthletes =
  (): ThunkAction =>
  (
    dispatch: (action: Action | TreatmentAction) => Action,
    getState: Function
  ) => {
    dispatch(
      // $FlowFixMe
      getAthletesByAvailability(getState().athletes.groupBy, [], [], [])
    );
  };
