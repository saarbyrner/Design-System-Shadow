/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
import i18n from '@kitman/common/src/utils/i18n';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import annotationEmptyData from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/annotationEmptyData';

export default function (state = {}, action) {
  switch (action.type) {
    case 'ADD_NOTES_WIDGET_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'ADD_NOTES_WIDGET_SUCCESS': {
      return {
        ...state,
        status: 'success',
      };
    }
    case 'ADD_NOTES_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'OPEN_NOTE_MODAL': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          isNotesModalOpen: true,
          widgetId: action.payload.widgetId,
        },
        widgetId: action.payload.widgetId,
        widget_annotation_types: action.payload.annotationTypes,
        population: action.payload.population,
        time_scope: action.payload.timeScope,
        time_range: action.payload.timeRange,
      };
    }
    case 'CLOSE_NOTES_MODAL': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          isNotesModalOpen: false,
          widgetId: null,
        },
        annotation: { ...annotationEmptyData(action.payload.annotationTypes) },
      };
    }
    case 'UPDATE_ATHLETE_OPTIONS': {
      const response = action.payload.athletes;
      const transformedAthleteOptions = response.map((athlete) => ({
        id: athlete.id,
        title: athlete.fullname,
      }));
      return {
        ...state,
        availableAthletes: transformedAthleteOptions,
      };
    }
    case 'UPDATE_ACTION': {
      return {
        ...state,
        updatedAction: action.payload.action,
      };
    }
    case 'UPDATE_ACTION_SUCCESS': {
      return {
        ...state,
        updatedAction: null,
      };
    }
    case 'UPDATE_ACTION_FAILURE': {
      return {
        ...state,
        noteViewStatus: {
          ...state.noteViewStatus,
          status: 'error',
        },
      };
    }
    case 'POPULATE_ATHLETE_DROPDOWN_LOADING': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          status: 'loading',
          message: `${i18n.t('Fetching data')}...`,
        },
      };
    }
    case 'EDIT_ANNOTATION_LOADING':
    case 'SAVE_ANNOTATION_LOADING': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          status: 'loading',
          message: `${i18n.t('Loading')}...`,
        },
      };
    }
    case 'SAVE_ANNOTATION_SUCCESS': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          status: 'success',
          message: i18n.t('Note saved successfully'),
        },
      };
    }
    case 'EDIT_ANNOTATION_FAILURE':
    case 'SAVE_ANNOTATION_FAILURE': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          status: 'error',
        },
      };
    }
    case 'POPULATE_ATHLETE_DROPDOWN_FAILURE': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          status: 'error',
          message: i18n.t(
            '#sport_specific__There_was_an_error_fetching_athletes.'
          ),
        },
      };
    }
    case 'EDIT_ANNOTATION_SUCCESS': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          status: 'success',
          message: i18n.t('Note updated successfully'),
        },
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        ...state,
        notesModal: {
          ...state.notesModal,
          status: null,
          message: null,
        },
        noteViewStatus: {
          ...state.noteViewStatus,
          status: null,
          message: null,
        },
      };
    }
    case 'HIDE_NOTES_WIDGET_STATUS': {
      return {
        ...state,
        notesWidgetStatus: {
          ...state.notesWidgetStatus,
          status: null,
          annotation: null,
          fileId: null,
          message: null,
          secondaryMessage: null,
        },
      };
    }
    case 'CONFIRM_DELETE_ATTACHMENT': {
      return {
        ...state,
        widgetId: action.payload.widgetId,
        notesWidgetStatus: {
          ...state.notesWidgetStatus,
          status: 'warning',
          annotation: action.payload.annotation,
          fileId: action.payload.fileId,
          message: i18n.t('Delete file?'),
          secondaryMessage: i18n.t('This action is irreversible.'),
        },
      };
    }
    case 'DELETE_ATTACHMENT_LOADING': {
      return {
        ...state,
        notesWidgetStatus: {
          ...state.notesWidgetStatus,
          status: 'loading',
          message: i18n.t('Removing file...'),
          secondaryMessage: null,
        },
      };
    }
    case 'DELETE_ATTACHMENT_FAILURE': {
      return {
        ...state,
        notesWidgetStatus: {
          ...state.notesWidgetStatus,
          status: 'error',
          message: null,
          secondaryMessage: null,
        },
      };
    }
    case 'CONFIRM_FILE_UPLOAD_FAILURE':
    case 'TRIGGER_FILE_UPLOAD_FAILURE': {
      const newFileMap = { ...state.toast.fileMap };
      // $FlowFixMe
      newFileMap[action.payload.fileId].status = 'ERROR';
      return {
        ...state,
        toast: {
          ...state.toast,
          fileMap: newFileMap,
        },
      };
    }
    case 'FINISH_FILE_UPLOAD': {
      const newFileMap = {
        ...state.toast.fileMap,
        [action.payload.fileId]: {
          ...state.toast.fileMap[action.payload.fileId],
          status: 'SUCCESS',
        },
      };
      return {
        ...state,
        toast: {
          ...state.toast,
          fileMap: newFileMap,
        },
      };
    }
    case 'CLOSE_TOAST_ITEM': {
      const newFileOrder = [...state.toast.fileOrder].filter(
        (itemId) => itemId !== action.payload.itemId
      );
      const newFileMap = { ...state.toast.fileMap };
      delete newFileMap[action.payload.itemId];
      return {
        ...state,
        toast: {
          ...state.toast,
          fileMap: newFileMap,
          fileOrder: newFileOrder,
        },
      };
    }
    case 'TRIGGER_TOAST_DISPLAY_PROGRESS': {
      const newFileOrder = [...state.toast.fileOrder];
      const newFileMap = { ...state.toast.fileMap };
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
        toast: {
          ...state.toast,
          fileOrder: newFileOrder,
          fileMap: newFileMap,
        },
      };
    }
    default:
      return state;
  }
}
