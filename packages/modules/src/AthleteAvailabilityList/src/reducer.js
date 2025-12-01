// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  groupAthletesByPosition,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByName,
  groupAthletesByPositionGroup,
  getFilteredAthletes,
  getIsLocalStorageAvailable,
} from '@kitman/common/src/utils';
import type {
  GroupedDropdownItem,
  ToastAction,
} from '@kitman/components/src/types';
import type { Action as NoteAction } from '@kitman/modules/src/AddNoteModal/types';
import type {
  TreatmentAttribute,
  Action as TreatmentAction,
} from '@kitman/modules/src/TreatmentSessionModal/types';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { getDefaultDiagnosticData } from '../utils';
import type {
  Action,
  Athlete,
  TreatmentState,
  FileUploadToastState,
  AthleteState,
  IssueStaticDataState,
  AbsenceState,
  NoteState,
  ModInfoState,
  RTPModalState,
  DiagnosticModalState,
  InjuryUploadModalState,
  AppStatusState,
} from '../types';

export const athletes = (
  state: AthleteState = {},
  action: Action | NoteAction
) => {
  let newState;
  let newFilteredAtletes;
  let newGroupedAthletes;
  switch (action.type) {
    case 'TOGGLE_ATHLETE_FILTERS':
      newState = Object.assign({}, state, {
        isFilterShown: !action.payload.isFilterShown,
      });
      return newState;
    case 'UPDATE_FILTER_OPTIONS':
      newFilteredAtletes = getFilteredAthletes(
        state.grouped[action.payload.groupBy],
        '',
        null,
        [],
        action.payload.athleteFilters,
        null,
        ''
      );
      if (getIsLocalStorageAvailable()) {
        window.localStorage.setItem('groupBy', action.payload.groupBy);
      }
      newState = Object.assign({}, state, {
        groupBy: action.payload.groupBy,
        athleteFilters: action.payload.athleteFilters,
        currentlyVisible: newFilteredAtletes,
      });
      return newState;
    case 'UPDATE_FILTER_OPTIONS_BY_AVAILABILITY':
      newGroupedAthletes = {
        position: groupAthletesByPosition(action.payload.athleteData),
        positionGroup: groupAthletesByPositionGroup(
          action.payload.athleteData,
          state.groupOrderingByType.position
        ),
        availability: groupAthletesByAvailability(action.payload.athleteData),
        last_screening: groupAthletesByScreening(action.payload.athleteData),
        name: groupAthletesByName(action.payload.athleteData),
      };

      newFilteredAtletes = getFilteredAthletes(
        newGroupedAthletes[action.payload.groupBy],
        '',
        null,
        [],
        action.payload.athleteFilters,
        null,
        ''
      );

      if (getIsLocalStorageAvailable()) {
        window.localStorage.setItem('groupBy', action.payload.groupBy);
      }
      newState = Object.assign({}, state, {
        isLoading: false,
        all: action.payload.athleteData,
        grouped: newGroupedAthletes,
        groupBy: action.payload.groupBy,
        athleteFilters: action.payload.athleteFilters,
        availabilityFilters: action.payload.athleteFilters,
        currentlyVisible: newFilteredAtletes,
      });
      return newState;
    case 'UPDATE_ATHLETE_MODINFO':
      /* eslint-disable no-case-declarations */
      const newAthletes: Array<Athlete> = state.all.slice();
      const editedAthlete: ?Athlete = newAthletes.find((athlete) => {
        // $FlowFixMe: action.payload.athleteId always exists
        return athlete.id === action.payload.athleteId;
      });
      newAthletes[newAthletes.indexOf(editedAthlete)].modification_info =
        action.payload.info;
      newAthletes[newAthletes.indexOf(editedAthlete)].rtp = action.payload.rtp;
      /* eslint-enable no-case-declarations */

      newState = Object.assign({}, state, {
        all: newAthletes,
      });
      return newState;
    case 'SERVER_REQUEST_FOR_ATHLETES_BY_AVAILABILITY': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'SERVER_REQUEST_ERROR': {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};

export const issueStaticData = (
  state: IssueStaticDataState = {},
  action: Action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const injuryUploadModal = (
  state: InjuryUploadModalState = {},
  action: Action
) => {
  let newState;
  let newErrorData;

  const resetFileData = null;
  const resetErrors = {
    messages: null,
    totalRows: null,
    skippedRows: null,
  };

  switch (action.type) {
    case 'OPEN_INJURY_UPLOAD_MODAL':
      newState = Object.assign({}, state, {
        isModalOpen: true,
        file: state.file,
      });
      return newState;
    case 'CLOSE_INJURY_UPLOAD_MODAL':
      newState = Object.assign({}, state, {
        isModalOpen: false,
        file: resetFileData,
        errors: resetErrors,
      });
      return newState;
    case 'UPDATE_INJURY_UPLOAD_FILE':
      newState = Object.assign({}, state, {
        file: action.payload.file,
        errors: action.payload.file !== null ? resetErrors : state.errors,
      });
      return newState;
    case 'SAVE_UPLOAD_INJURY_ERROR':
      newErrorData = Object.assign({}, state.errors, {
        messages: action.payload.errors,
        totalRows: action.payload.totalRows,
        skippedRows: action.payload.skippedRows,
      });
      newState = Object.assign({}, state, {
        errors: newErrorData,
      });
      return newState;
    default:
      return state;
  }
};

export const addAbsenceModal = (state: AbsenceState = {}, action: Action) => {
  let newState;
  let newAbsenceData;

  const resetAbsenceData = {
    reason_id: null,
    from: '',
    to: '',
    athlete_id: null,
  };

  switch (action.type) {
    case 'OPEN_ADD_ABSENCE_MODAL':
      newState = Object.assign({}, state, {
        athlete: action.payload.athlete,
        isModalOpen: true,
        absenceData: state.absenceData,
      });
      return newState;
    case 'CLOSE_ADD_ABSENCE_MODAL':
      newState = Object.assign({}, state, {
        athlete: null,
        isModalOpen: false,
        absenceData: resetAbsenceData,
      });
      return newState;
    case 'UPDATE_ABSENCE_REASON_TYPE':
      newAbsenceData = Object.assign({}, state.absenceData, {
        reason_id: action.payload.reasonId,
      });
      newState = Object.assign({}, state, {
        absenceData: newAbsenceData,
      });
      return newState;
    case 'UPDATE_ABSENCE_FROM_DATE':
      // eslint-disable-next-line no-case-declarations
      const fromDate = moment(action.payload.date).format(
        'YYYY-MM-DDTHH:mm:ss'
      );
      const utcFromDate = moment.utc(fromDate); // eslint-disable-line no-case-declarations
      newAbsenceData = Object.assign({}, state.absenceData, {
        from: utcFromDate.isValid() ? utcFromDate.format() : '',
      });
      newState = Object.assign({}, state, {
        absenceData: newAbsenceData,
      });
      return newState;
    case 'UPDATE_ABSENCE_TO_DATE':
      // eslint-disable-next-line no-case-declarations
      const toDate = action.payload.date
        ? moment(action.payload.date).format('YYYY-MM-DDTHH:mm:ss')
        : '';
      const utcToDate = moment.utc(toDate); // eslint-disable-line no-case-declarations
      newAbsenceData = Object.assign({}, state.absenceData, {
        to: utcToDate.isValid() ? utcToDate.format() : '',
      });
      newState = Object.assign({}, state, {
        absenceData: newAbsenceData,
      });
      return newState;
    default:
      return state;
  }
};

export const treatmentSessionModal = (
  state: TreatmentState = {},
  action: Action | TreatmentAction
) => {
  switch (action.type) {
    case 'OPEN_TREATMENT_MODAL': {
      return {
        ...state,
        isModalOpen: true,
        athlete: action.payload.athlete,
        treatmentSession: {
          ...state.treatmentSession,
          athlete_id: action.payload.athlete.id,
        },
      };
    }
    case 'CLOSE_TREATMENT_SESSION_MODAL': {
      return {
        ...state,
        isModalOpen: false,
        athlete: {
          fullname: '',
          id: null,
        },
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: [
            {
              treatment_modality_id: null,
              duration: null,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [],
              note: '',
            },
          ],
          annotation_attributes: {
            content: '',
            attachments_attributes: [],
          },
          athlete_id: null,
        },
        unUploadedFiles: [],
        staticData: {
          ...state.staticData,
          bodyAreaOptions: [],
          treatmentModalityOptions: [],
        },
      };
    }
    case 'UPDATE_TREATMENT_SESSION_STATIC_DATA': {
      const formattedBodyAreas: Array<GroupedDropdownItem> =
        action.payload.responseOptions.treatable_area_options.map(
          (bodyArea) => ({
            id: JSON.stringify(bodyArea.value),
            name: bodyArea.name,
            description: bodyArea.description,
            isGroupOption: bodyArea.isGroupOption,
          })
        );
      return {
        ...state,
        staticData: {
          ...state.staticData,
          reasonOptions: action.payload.responseOptions.issues_options,
          bodyAreaOptions: formattedBodyAreas,
          treatmentModalityOptions:
            action.payload.responseOptions.treatment_modality_options,
        },
      };
    }
    case 'ADD_TREATMENT_ATTRIBUTE': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];

      const lastTreatmentAttribute =
        treatmentAttributes[treatmentAttributes.length - 1];

      if (treatmentAttributes.length) {
        treatmentAttributes.push({
          treatment_modality_id: null,
          duration: null,
          reason: lastTreatmentAttribute.reason,
          issue_type: lastTreatmentAttribute.issue_type,
          issue_id: lastTreatmentAttribute.issue_id,
          treatment_body_areas_attributes: [],
          note: '',
        });
      }

      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'ADD_TREATMENT_ATTRIBUTES': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];

      if (
        treatmentAttributes.length === 1 &&
        treatmentAttributes[0].treatment_modality_id === null
      ) {
        treatmentAttributes[0] = {
          ...treatmentAttributes[0],
          ...action.payload.attributes[0],
        };
        treatmentAttributes.push(...action.payload.attributes.slice(1));
      } else {
        treatmentAttributes.push(...action.payload.attributes);
      }

      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'REMOVE_TREATMENT_ATTRIBUTE': {
      const treatmentAttributes: Array<TreatmentAttribute> = [
        ...state.treatmentSession.treatments_attributes,
      ].filter((item, index) => index !== action.payload.index);
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'SELECT_BODY_AREA': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];
      const selectedBodyAreas =
        state.treatmentSession.treatments_attributes[action.payload.index]
          .treatment_body_areas_attributes;

      if (
        !selectedBodyAreas.some(
          (selectedBodyArea) =>
            JSON.stringify(selectedBodyArea) ===
            JSON.stringify(action.payload.bodyArea)
        )
      ) {
        treatmentAttributes[
          action.payload.index
          // bodyArea is parsed before, that's why it's a string elsewhere,
          // here it's an object
          // $FlowFixMe
        ].treatment_body_areas_attributes.push(action.payload.bodyArea);
      }

      if (
        action.payload.bodyAreaParent &&
        !selectedBodyAreas.some(
          (selectedBodyArea) =>
            JSON.stringify(selectedBodyArea) ===
            JSON.stringify(action.payload.bodyAreaParent)
        )
      ) {
        treatmentAttributes[
          action.payload.index
          // bodyAreaParent is parsed before, that's why it's a string elsewhere,
          // here it's an object
          // $FlowFixMe
        ].treatment_body_areas_attributes.push(action.payload.bodyAreaParent);
      }

      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'SELECT_PRACTITIONER': {
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          user_id: action.payload.practitionerId,
        },
      };
    }
    case 'SELECT_TIMEZONE': {
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          timezone: action.payload.timezone,
        },
      };
    }
    case 'SELECT_TREATMENT_MODALITY': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];
      treatmentAttributes[action.payload.index].treatment_modality_id =
        action.payload.modalityId;
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'SELECT_TREATMENT_REASON': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];
      treatmentAttributes[action.payload.index].reason =
        action.payload.reasonObj.reason;
      treatmentAttributes[action.payload.index].issue_type =
        action.payload.reasonObj.issue_type;
      treatmentAttributes[action.payload.index].issue_id =
        action.payload.reasonObj.issue_id;
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'SET_TREATMENT_DURATION': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];
      treatmentAttributes[action.payload.index].duration =
        action.payload.duration;
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'UPDATE_TREATMENT_NOTE_ATTRIBUTE': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];
      treatmentAttributes[action.payload.index].note = action.payload.text;

      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'UNSELECT_BODY_AREA': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];
      const selectedBodyAreas =
        state.treatmentSession.treatments_attributes[action.payload.index]
          .treatment_body_areas_attributes;

      treatmentAttributes[
        action.payload.index
      ].treatment_body_areas_attributes = selectedBodyAreas.filter(
        (bodyArea) => JSON.stringify(bodyArea) !== action.payload.bodyArea
      );

      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'UNSELECT_PARENT_BODY_AREA': {
      const treatmentAttributes = [
        ...state.treatmentSession.treatments_attributes,
      ];
      const selectedBodyAreas =
        state.treatmentSession.treatments_attributes[action.payload.index]
          .treatment_body_areas_attributes;

      treatmentAttributes[
        action.payload.index
      ].treatment_body_areas_attributes = selectedBodyAreas.filter((bodyArea) =>
        action.payload.bodyAreas.every(
          (bodyAreaId) => bodyAreaId !== JSON.stringify(bodyArea)
        )
      );

      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          treatments_attributes: treatmentAttributes,
        },
      };
    }
    case 'UPDATE_TREATMENT_FILES': {
      return {
        ...state,
        unUploadedFiles: action.payload.files,
      };
    }
    case 'UPDATE_TREATMENT_NOTE_TEXT': {
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          annotation_attributes: {
            ...state.treatmentSession.annotation_attributes,
            content: action.payload.text,
          },
        },
      };
    }
    case 'UPDATE_TREATMENT_NOTE_RICH_TEXT': {
      return {
        ...state,
        treatmentSession: {
          ...state.treatmentSession,
          annotation_attributes: {
            ...state.treatmentSession.annotation_attributes,
            content: action.payload.content,
          },
        },
      };
    }
    default:
      return state;
  }
};

export const fileUploadToast = (
  state: FileUploadToastState = {},
  action: Action | ToastAction
) => {
  switch (action.type) {
    case 'CONFIRM_FILE_UPLOAD_FAILURE':
    case 'TRIGGER_FILE_UPLOAD_FAILURE': {
      const newFileMap = { ...state.fileMap };
      // $FlowFixMe
      newFileMap[action.payload.fileId].status = 'ERROR';
      return {
        ...state,
        fileMap: newFileMap,
      };
    }
    case 'FINISH_FILE_UPLOAD': {
      const newFileMap = {
        ...state.fileMap,
        [action.payload.fileId]: {
          ...state.fileMap[action.payload.fileId],
          status: 'SUCCESS',
        },
      };
      return {
        ...state,
        fileMap: newFileMap,
      };
    }
    case 'TRIGGER_TOAST_DISPLAY_PROGRESS': {
      const newFileOrder = [...state.fileOrder];
      const newFileMap = { ...state.fileMap };
      const fileId = action.payload.fileId;
      newFileOrder.push(fileId);
      newFileMap[fileId] = {
        text: action.payload.fileName,
        subText: fileSizeLabel(action.payload.fileSize, true),
        status: 'PROGRESS',
        id: fileId,
      };
      return {
        ...state,
        fileOrder: newFileOrder,
        fileMap: newFileMap,
      };
    }
    case 'CLOSE_TOAST_ITEM': {
      const newFileOrder: Array<?number> = [...state.fileOrder].filter(
        (itemId) => itemId !== action.payload.itemId
      );
      const newFileMap = { ...state.fileMap };
      delete newFileMap[action.payload.itemId];
      return {
        ...state,
        fileMap: newFileMap,
        fileOrder: newFileOrder,
      };
    }
    default:
      return state;
  }
};

export const noteModal = (
  state: NoteState = {},
  action: Action | NoteAction
) => {
  let newState;
  let newNoteData;

  const resetNoteData = {
    attachment_ids: [],
    note_date: null,
    note_type: null,
    medical_type: null,
    medical_name: null,
    injury_ids: [],
    illness_ids: [],
    note: '',
    expiration_date: null,
    batch_number: null,
    renewal_date: null,
    restricted: false,
    psych_only: false,
  };

  switch (action.type) {
    case 'OPEN_ADD_NOTE_MODAL':
      newState = Object.assign({}, state, {
        athlete: action.payload.athlete,
        athleteInjuries: state.athleteInjuries,
        athleteIllnesses: state.athleteIllnesses,
        isModalOpen: true,
        attachments: state.attachments,
        noteData: state.noteData,
      });
      return newState;
    case 'CLOSE_ADD_NOTE_MODAL':
      newState = Object.assign({}, state, {
        athlete: null,
        athleteInjuries: [],
        athleteIllnesses: [],
        isModalOpen: false,
        attachments: [],
        noteData: resetNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_DATE':
      newNoteData = Object.assign({}, state.noteData, {
        note_date: moment(action.payload.date).format(
          DateFormatter.dateTransferFormat
        ),
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_TYPE':
      newNoteData = Object.assign({}, state.noteData, {
        note_type: action.payload.type,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE':
      newNoteData = Object.assign({}, state.noteData, {
        note: action.payload.note,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_MEDICAL_TYPE':
      newNoteData = Object.assign({}, state.noteData, {
        medical_type: action.payload.medicalType,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_MEDICAL_TYPE_NAME':
      newNoteData = Object.assign({}, state.noteData, {
        medical_name: action.payload.name,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_ATTACHMENTS':
      const newAttachments: Array<?File> = state.attachments.slice(); // eslint-disable-line no-case-declarations
      const updatedAttachmentIds: Array<?number> = // eslint-disable-line no-case-declarations
        state.noteData.attachment_ids.slice();
      if (action.payload.file) {
        newAttachments.push(action.payload.file);
      } else {
        newAttachments.splice(action.payload.index, 1);
        updatedAttachmentIds.splice(action.payload.index, 1);
      }
      newNoteData = Object.assign({}, state.noteData, {
        attachment_ids: updatedAttachmentIds,
      });
      newState = Object.assign({}, state, {
        attachments: newAttachments,
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_ATTACHMENT_IDS':
      const newNoteAttachmentIds: Array<?number> = // eslint-disable-line no-case-declarations
        state.noteData.attachment_ids.slice();
      newNoteAttachmentIds.push(action.payload.attachmentId);
      newNoteData = Object.assign({}, state.noteData, {
        attachment_ids: newNoteAttachmentIds,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_EXP_DATE':
      newNoteData = Object.assign({}, state.noteData, {
        expiration_date: moment(action.payload.date).format(
          DateFormatter.dateTransferFormat
        ),
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_RENEWAL_DATE':
      newNoteData = Object.assign({}, state.noteData, {
        renewal_date: moment(action.payload.date).format(
          DateFormatter.dateTransferFormat
        ),
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_BATCH_NUMBER':
      newNoteData = Object.assign({}, state.noteData, {
        batch_number: action.payload.batchNumber,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_IS_RESTRICTED':
      newNoteData = Object.assign({}, state.noteData, {
        restricted: action.payload.checked,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_PSYCH_ONLY':
      newNoteData = Object.assign({}, state.noteData, {
        psych_only: action.payload.checked,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_RELEVANT_NOTE_INJURIES':
      const newInjuryIds: Array<?number> = state.noteData.injury_ids.slice(); // eslint-disable-line no-case-declarations
      if (newInjuryIds.indexOf(action.payload.issueId) !== -1) {
        newInjuryIds.splice(newInjuryIds.indexOf(action.payload.issueId), 1);
      } else {
        newInjuryIds.push(action.payload.issueId);
      }
      newNoteData = Object.assign({}, state.noteData, {
        injury_ids: newInjuryIds,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_RELEVANT_NOTE_ILLNESSES':
      const newIllnessIds: Array<?number> = state.noteData.illness_ids.slice(); // eslint-disable-line no-case-declarations
      if (newIllnessIds.indexOf(action.payload.issueId) !== -1) {
        newIllnessIds.splice(newIllnessIds.indexOf(action.payload.issueId), 1);
      } else {
        newIllnessIds.push(action.payload.issueId);
      }
      newNoteData = Object.assign({}, state.noteData, {
        illness_ids: newIllnessIds,
      });
      newState = Object.assign({}, state, {
        noteData: newNoteData,
      });
      return newState;
    case 'UPDATE_NOTE_ISSUES':
      newState = Object.assign({}, state, {
        athleteInjuries: action.payload.injuries,
        athleteIllnesses: action.payload.illnesses,
      });
      return newState;
    case 'COPY_LAST_NOTE_ERROR':
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          status: 'error',
          message: action.payload.errorMsg,
        },
      };
    case 'HIDE_REQUEST_STATUS':
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          status: null,
          message: null,
        },
      };
    default:
      return state;
  }
};

export const modInfoModal = (
  state: ModInfoState = {},
  action: Action | NoteAction
) => {
  let newState;
  let newModInfoData;

  const resetModInfoData = {
    info: '',
    rtp: '',
  };

  switch (action.type) {
    case 'OPEN_MOD_INFO_MODAL':
      newModInfoData = Object.assign({}, state.modInfoData, {
        info:
          action.payload.athlete && action.payload.athlete.modification_info
            ? action.payload.athlete.modification_info
            : '',
        rtp:
          action.payload.athlete && action.payload.athlete.rtp
            ? action.payload.athlete.rtp
            : '',
      });
      newState = Object.assign({}, state, {
        athlete: action.payload.athlete,
        isModalOpen: true,
        modInfoData: newModInfoData,
      });
      return newState;
    case 'CLOSE_MOD_INFO_MODAL':
      newModInfoData = resetModInfoData;
      newState = Object.assign({}, state, {
        athlete: null,
        isModalOpen: false,
        modInfoData: newModInfoData,
      });
      return newState;
    case 'UPDATE_MOD_INFO_TEXT':
      newModInfoData = Object.assign({}, state.modInfoData, {
        info: action.payload.text,
      });
      newState = Object.assign({}, state, {
        modInfoData: newModInfoData,
      });
      return newState;
    case 'UPDATE_MOD_INFO_RTP':
      newModInfoData = Object.assign({}, state.modInfoData, {
        rtp: action.payload.rtp
          ? moment(action.payload.rtp).format(DateFormatter.dateTransferFormat)
          : '',
      });
      newState = Object.assign({}, state, {
        modInfoData: newModInfoData,
      });
      return newState;
    default:
      return state;
  }
};

export const modRTPModal = (state: RTPModalState = {}, action: Action) => {
  switch (action.type) {
    case 'OPEN_RTP_MODAL': {
      return {
        ...state,
        athlete: action.payload.athlete,
        isModalOpen: true,
        modRTPData: {
          rtp:
            action.payload.athlete && action.payload.athlete.rtp
              ? action.payload.athlete.rtp
              : '',
        },
      };
    }
    case 'CLOSE_RTP_MODAL': {
      return {
        ...state,
        athlete: null,
        isModalOpen: false,
        modRTPData: {
          rtp: '',
        },
      };
    }
    case 'UPDATE_MOD_INFO_RTP': {
      return {
        ...state,
        modRTPData: {
          rtp: action.payload.rtp
            ? moment(action.payload.rtp).format(
                DateFormatter.dateTransferFormat
              )
            : '',
        },
      };
    }
    default:
      return state;
  }
};

export const diagnosticModal = (
  state: DiagnosticModalState = {},
  action: Action | NoteAction
) => {
  switch (action.type) {
    case 'OPEN_DIAGNOSTIC_MODAL': {
      return {
        ...state,
        athlete: action.payload.athlete,
        isModalOpen: true,
      };
    }
    case 'CLOSE_DIAGNOSTIC_MODAL': {
      return {
        ...state,
        athlete: null,
        isModalOpen: false,
        diagnosticData: {
          ...getDefaultDiagnosticData(),
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_ISSUES': {
      return {
        ...state,
        athleteInjuries: action.payload.injuries,
        athleteIllnesses: action.payload.illnesses,
      };
    }
    case 'UPDATE_DIAGNOSTIC_ATTACHMENTS': {
      const newAttachments = [...state.attachments];
      const updatedAttachmentIds = [...state.diagnosticData.attachment_ids];
      if (action.payload.file) {
        newAttachments.push(action.payload.file);
      } else {
        newAttachments.splice(action.payload.index, 1);
        updatedAttachmentIds.splice(action.payload.index, 1);
      }
      return {
        ...state,
        attachments: newAttachments,
        diagnosticData: {
          ...state.diagnosticData,
          attachment_ids: updatedAttachmentIds,
        },
      };
    }
    case 'UPDATE_ATTACHMENT_IDS': {
      const newAttachmentIds = [...state.diagnosticData.attachment_ids];
      newAttachmentIds.push(action.payload.attachmentId);
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          attachment_ids: newAttachmentIds,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_TYPE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          diagnostic_type: action.payload.typeId,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_DATE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          diagnostic_date: action.payload.date,
        },
      };
    }
    case 'UPDATE_RELEVANT_DIAGNOSTIC_INJURIES': {
      const newInjuryIds = [...state.diagnosticData.injury_ids];
      if (newInjuryIds.indexOf(action.payload.issueId) !== -1) {
        newInjuryIds.splice(newInjuryIds.indexOf(action.payload.issueId), 1);
      } else {
        newInjuryIds.push(action.payload.issueId);
      }
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          injury_ids: newInjuryIds,
        },
      };
    }
    case 'UPDATE_RELEVANT_DIAGNOSTIC_ILLNESSES': {
      const newIllnessIds = [...state.diagnosticData.illness_ids];
      if (newIllnessIds.indexOf(action.payload.issueId) !== -1) {
        newIllnessIds.splice(newIllnessIds.indexOf(action.payload.issueId), 1);
      } else {
        newIllnessIds.push(action.payload.issueId);
      }
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          illness_ids: newIllnessIds,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_MEDICATION_TYPE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          medication_type: action.payload.type,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_MEDICATION_DOSAGE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          medication_dosage: action.payload.dosage,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_MEDICATION_FREQUENCY': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          medication_frequency: action.payload.frequency,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_MEDICATION_NOTES': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          medication_notes: action.payload.notes,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_MEDICATION_COMPLETED': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          medication_completed: action.payload.isCompleted,
          medication_completed_at: action.payload.isCompleted
            ? moment().format(DateFormatter.dateTransferFormat)
            : null,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_TEST_DATE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_test_date: action.payload.covidTestDate,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_TEST_TYPE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_test_type: action.payload.covidTestType,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_RESULT': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_result: action.payload.covidResult,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_REFERENCE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_reference: action.payload.covidReference,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_DATE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_antibody_test_date: action.payload.covidAntibodyTestDate,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_TYPE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_antibody_test_type: action.payload.covidAntibodyTestType,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_RESULT': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_antibody_result: action.payload.covidAntibodyResult,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_REFERENCE': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          covid_antibody_reference: action.payload.covidAntibodyReference,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_ANNOTATION_CONTENT': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          annotation_content: action.payload.annotationContent,
        },
      };
    }
    case 'UPDATE_DIAGNOSTIC_RESTRICT_ACCESS_TO': {
      return {
        ...state,
        diagnosticData: {
          ...state.diagnosticData,
          restrict_access_to: action.payload.restrictAccessTo,
        },
      };
    }
    default:
      return state;
  }
};

export const appStatus = (
  state: AppStatusState = {},
  action: Action | NoteAction | TreatmentAction
) => {
  switch (action.type) {
    case 'SERVER_REQUEST':
      return {
        status: 'loading',
      };
    case 'SERVER_REQUEST_FOR_DIAGNOSTIC_ISSUES':
    case 'SERVER_REQUEST_FOR_NOTE_ISSUES':
    case 'SERVER_REQUEST_FOR_LAST_NOTE':
    case 'SERVER_REQUEST_FOR_ATHLETES_BY_AVAILABILITY':
      return {
        status: 'loading',
        message: i18n.t('Loading...'),
      };
    case 'SERVER_REQUEST_ERROR':
      return {
        status: 'error',
      };
    case 'SERVER_REQUEST_SUCCESS':
      return {
        status: 'success',
      };
    case 'HIDE_APP_STATUS': {
      return {
        status: null,
        message: null,
      };
    }
    case 'SAVE_ATHLETE_PROFILE_NOTE_SUCCESS':
      return {
        status: 'success',
        message: action.payload.isRestricted
          ? i18n.t('New private note has been created')
          : i18n.t('New note has been created'),
      };
    case 'SAVE_ATHLETE_AVAILABILITY_MOD_INFO_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Modification/Info changed successfully'),
      };
    case 'SAVE_ATHLETE_AVAILABILITY_DIAGNOSTIC_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Diagnostic/Intervention saved successfully'),
      };
    case 'SAVE_UPLOAD_INJURY_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('File uploaded successfully'),
      };
    case 'SAVE_TREATMENT_SESSION_LOADING': {
      return {
        ...state,
        status: 'loading',
        message: i18n.t('Saving treatment session...'),
      };
    }
    case 'SAVE_TREATMENT_SESSION_SUCCESS': {
      return {
        ...state,
        status: 'success',
        message: i18n.t('Treatment session saved successfully'),
      };
    }
    case 'SAVE_TREATMENT_SESSION_FAILURE': {
      return {
        ...state,
        status: 'error',
        message: null,
      };
    }
    default:
      return state;
  }
};
