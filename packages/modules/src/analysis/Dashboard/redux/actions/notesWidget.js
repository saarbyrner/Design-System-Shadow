// @flow
import $ from 'jquery';
import _isEmpty from 'lodash/isEmpty';
import type {
  Annotation,
  AnnotationAction,
  AnnotationResponse,
} from '@kitman/common/src/types/Annotation';
import type { Action as AnnotationsAction } from '@kitman/modules/src/Annotations/components/AnnotationModal/types';
import type { ToastAction } from '@kitman/components/src/types';
import {
  hideAppStatus,
  populateNoteModal,
} from '@kitman/modules/src/Annotations/components/AnnotationModal/actions';
import closeToastItem from '@kitman/components/src/Toast/actions';
import type { Action, ThunkAction } from '../types/actions';
import { fetchWidgetContent, getPivotData } from './widgets';

export const openNoteModal = (
  widgetId: number,
  widgetName: string,
  annotationTypes: Array<Object>,
  population: Object,
  timeScope: Object,
  timeRange: Object
): Action => ({
  type: 'OPEN_NOTE_MODAL',
  payload: {
    widgetId,
    widgetName,
    annotationTypes,
    population,
    timeScope,
    timeRange,
  },
});

export const populateAthleteDropdownLoading = (): Action => ({
  type: 'POPULATE_ATHLETE_DROPDOWN_LOADING',
});

export const populateAthleteDropdownFailure = (): Action => ({
  type: 'POPULATE_ATHLETE_DROPDOWN_FAILURE',
});

export const updateAthleteOptions = (
  athletes: Array<{ id: number, title: string }>
): Action => ({
  type: 'UPDATE_ATHLETE_OPTIONS',
  payload: {
    athletes,
  },
});

export const populateAthleteDropdown =
  (): ThunkAction =>
  (
    dispatch: (action: Action | AnnotationsAction) => Action,
    getState: Function
  ) => {
    const widgetData = getState().notesWidget;
    const pivotData = getPivotData(getState().dashboard).population;
    dispatch(populateAthleteDropdownLoading());
    $.ajax({
      method: 'POST',
      url: '/athletes/population',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        population: _isEmpty(pivotData) ? widgetData.population : pivotData,
      }),
    })
      .done((response) => {
        dispatch(updateAthleteOptions(response.athletes));
        dispatch(hideAppStatus());
      })
      .fail(() => {
        dispatch(populateAthleteDropdownFailure());
      });
  };

export const triggerNoteModal =
  (
    annotation: Annotation,
    widgetId: number,
    widgetName: string,
    annotationTypes: Array<Object>,
    population: Object,
    timeScope: Object,
    timeRange: Object,
    options: {
      isEditing: boolean,
      isDuplicating: boolean,
      isAthleteProfile: boolean,
    }
  ): ThunkAction =>
  (dispatch: (action: Action | AnnotationsAction | ThunkAction) => Action) => {
    // openNoteModal needs to be the first dispatch to populate the state correctly
    dispatch(
      openNoteModal(
        widgetId,
        widgetName,
        annotationTypes,
        population,
        timeScope,
        timeRange
      )
    );
    dispatch(populateNoteModal(annotation, options));
    dispatch(populateAthleteDropdown());
  };

export const updateAction = (action: AnnotationAction): Action => ({
  type: 'UPDATE_ACTION',
  payload: {
    action,
  },
});

export const updateActionSuccess = (): Action => ({
  type: 'UPDATE_ACTION_SUCCESS',
});

export const updateActionFailure = (): Action => ({
  type: 'UPDATE_ACTION_FAILURE',
});

export const clickActionCheckbox =
  (action: Object): ThunkAction =>
  (dispatch: (action: Action | AnnotationsAction) => Action) => {
    $.ajax({
      method: 'PUT',
      url: `/annotation_actions/${action.id}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        completed: !action.completed,
      }),
    })
      .done((response) => {
        dispatch(updateAction(response.annotation_action));
        dispatch(updateActionSuccess());
      })
      .fail(() => {
        dispatch(updateActionFailure());
      });
  };

export const updateNotes = (
  widgetId: number,
  nextNotes: Array<Annotation>,
  nextPage: number
): Action => ({
  type: 'UPDATE_NOTES',
  payload: {
    widgetId,
    nextNotes,
    nextPage,
  },
});

export const fetchNextNotes =
  (widgetId: number, page?: number): ThunkAction =>
  (
    dispatch: (action: Action | AnnotationsAction) => Action,
    getState: Function
  ) => {
    if (page === null) {
      return;
    }

    $.ajax({
      method: 'POST',
      url: '/widgets/widget_render',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        container_widget_id: widgetId,
        options: {
          page,
        },
      }),
    }).done((response) => {
      dispatch(updateNotes(widgetId, response.annotations, response.next_page));
    });
  };

export const archiveNoteSuccess = (noteId: number): Action => ({
  type: 'ARCHIVE_NOTE_SUCCESS',
  payload: {
    noteId,
  },
});

export const archiveNote =
  (note: Annotation): ThunkAction =>
  (dispatch: (action: Action | AnnotationsAction) => Action) => {
    $.ajax({
      method: 'PUT',
      url: note.id ? `/annotations/${note.id}` : '',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        archived: true,
      }),
    }).done((response) => {
      dispatch(archiveNoteSuccess(response.annotation.id));
    });
  };

export const restoreNoteSuccess = (noteId: number): Action => ({
  type: 'RESTORE_NOTE_SUCCESS',
  payload: {
    noteId,
  },
});

export const restoreNote =
  (note: Annotation): ThunkAction =>
  (dispatch: (action: Action | AnnotationsAction) => Action) => {
    $.ajax({
      method: 'PUT',
      url: note.id ? `/annotations/${note.id}` : '',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        archived: false,
      }),
    }).done((response) => {
      dispatch(restoreNoteSuccess(response.annotation.id));
    });
  };

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
  (
    dispatch: (
      action: Action | AnnotationsAction | ToastAction | ThunkAction
    ) => Action,
    getState: Function
  ) => {
    $.ajax({
      type: 'PATCH',
      url: `/attachments/${fileId}/confirm`,
      processData: false,
      contentType: false,
      cache: false,
    })
      .done(() => {
        dispatch(finishFileUpload(fileId));
        // $FlowFixMe
        dispatch(fetchWidgetContent(getState().notesWidget.widgetId));
        setTimeout(() => {
          dispatch(closeToastItem(fileId));
        }, 5000);
      })
      .fail(() => {
        dispatch(confirmFileUploadFailure(fileId));
      });
  };

export const triggerFileUploadFailure = (fileId: number): Action => ({
  type: 'TRIGGER_FILE_UPLOAD_FAILURE',
  payload: {
    fileId,
  },
});

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

// S3 upload workflow:
// Save annotation -> response contains S3 url for upload, reference on annotation is saved
// upload each file using the S3 url
// once upload is completed it sets a flag "confirmed: true" on the attachment (sent back in response)
export const triggerFileUpload =
  (file: File, fileId: number, presignedPost: Object): ThunkAction =>
  (dispatch: (action: Action | AnnotationsAction | ThunkAction) => Action) => {
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

export const confirmDeleteAttachment = (
  widgetId: number,
  annotation: AnnotationResponse,
  fileId: number
): Action => ({
  type: 'CONFIRM_DELETE_ATTACHMENT',
  payload: {
    widgetId,
    annotation,
    fileId,
  },
});

export const hideNotesWidgetStatus = (): Action => ({
  type: 'HIDE_NOTES_WIDGET_STATUS',
});

export const deleteAttachmentLoading = (): Action => ({
  type: 'DELETE_ATTACHMENT_LOADING',
});

export const deleteAttachmentFailure = (): Action => ({
  type: 'DELETE_ATTACHMENT_FAILURE',
});

export const deleteAttachment =
  (): ThunkAction =>
  (
    dispatch: (action: Action | AnnotationsAction | ThunkAction) => Action,
    getState: Function
  ) => {
    const activeAnnotation =
      getState().notesWidget.notesWidgetStatus.annotation;

    dispatch(deleteAttachmentLoading());
    const newAttachments = activeAnnotation.attachments.filter(
      // $FlowFixMe file must exist
      (file) => file.id !== getState().notesWidget.notesWidgetStatus.fileId
    );

    $.ajax({
      method: 'PUT',
      url: `/annotations/${activeAnnotation.id}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        title: activeAnnotation.title,
        content: activeAnnotation.content,
        annotationable_type: activeAnnotation.annotationable_type,
        annotationable_id: activeAnnotation.annotationable.id,
        annotation_date: activeAnnotation.annotation_date,
        organisation_annotation_type_id:
          activeAnnotation.organisation_annotation_type.id,
        annotation_actions_attributes: activeAnnotation.annotation_actions,
        attachments_attributes: newAttachments,
      }),
    })
      .done(() => {
        // $FlowFixMe
        dispatch(fetchWidgetContent(getState().notesWidget.widgetId));
        dispatch(hideNotesWidgetStatus());
      })
      .fail(() => {
        dispatch(deleteAttachmentFailure());
      });
  };

export const updateNotesNameSuccess = (
  widgetId: number,
  widgetName: string
): Action => ({
  type: 'UPDATE_NOTES_NAME_SUCCESS',
  payload: {
    widgetId,
    widgetName,
  },
});

export const updateNotesNameFailure = (): Action => ({
  type: 'UPDATE_NOTES_NAME_FAILURE',
});

export const updateNotesNameRequest =
  (
    widgetId: number,
    notesWidgetName: string,
    selectedAnnotationTypes: Object,
    selectedPopulation: Object,
    selectedTimeScope: Object
  ): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    $.ajax({
      method: 'PUT',
      url: `/widgets/${widgetId}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        container_type: getState().staticData.containerType,
        container_id: getState().dashboard.activeDashboard.id,
        widget: {
          name: notesWidgetName,
          widget_annotation_types: selectedAnnotationTypes,
          population: selectedPopulation,
          time_scope: selectedTimeScope,
        },
      }),
    })
      .done(() => {
        dispatch(updateNotesNameSuccess(widgetId, notesWidgetName));
      })
      .fail(() => {
        dispatch(updateNotesNameFailure());
      });
  };
