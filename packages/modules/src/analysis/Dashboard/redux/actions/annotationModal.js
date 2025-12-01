// @flow
import $ from 'jquery';
import {
  closeNotesModal,
  editAnnotationFailure,
  editAnnotationLoading,
  editAnnotationSuccess,
  hideAppStatus,
  saveAnnotationFailure,
  saveAnnotationLoading,
  saveAnnotationSuccess,
  updateAnnotation,
} from '@kitman/modules/src/Annotations/components/AnnotationModal/actions';
import type { Action as AnnotationAction } from '@kitman/modules/src/Annotations/components/AnnotationModal/types';
import { saveAnnotation as saveAnnotationService } from '@kitman/services';
import { transformFilesForUpload } from '@kitman/common/src/utils/fileHelper';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { triggerFileUpload, triggerToastDisplayProgress } from './notesWidget';
import { fetchWidgetContent } from './widgets';
import type { Action, ThunkAction } from '../types/actions';

export const saveAnnotation =
  (attachedFiles: AttachedFile[]): ThunkAction =>
  (
    dispatch: (action: Action | AnnotationAction | ThunkAction) => Action,
    getState: Function
  ) => {
    dispatch(saveAnnotationLoading());
    const annotationData = getState().annotation;
    const annotationActionsTransformed = annotationData.annotation_actions.map(
      (action) => {
        const actionObject = {
          content: action.content,
          completed: action.completed,
          user_ids: action.user_ids,
          due_date: action.due_date,
        };
        return actionObject;
      }
    );

    const transformedAttachments = transformFilesForUpload(attachedFiles);

    saveAnnotationService({
      title: annotationData.title,
      content: annotationData.content,
      annotationable_type: annotationData.annotationable_type,
      annotationable_id: annotationData.annotationable.id,
      annotation_date: annotationData.annotation_date,
      organisation_annotation_type_id: annotationData.annotation_type_id,
      annotation_actions_attributes: annotationActionsTransformed,
      attachments_attributes: transformedAttachments,
      illness_occurrence_ids: [],
      injury_occurrence_ids: [],
      restricted_to_doc: false,
      restricted_to_psych: false,
    })
      .then((response) => {
        const unConfirmedFiles = response.annotation.attachments.filter(
          (file) => file.confirmed === false
        );
        if (unConfirmedFiles.length > 0) {
          // order of files is kept (last added will be the last in the list),
          // so response attachment order is the same as the original file order
          unConfirmedFiles.forEach((responseFile, index) => {
            dispatch(
              triggerFileUpload(
                attachedFiles[index].file,
                responseFile.id,
                responseFile.presigned_post
              )
            );
            dispatch(
              triggerToastDisplayProgress(
                attachedFiles[index].file.name,
                attachedFiles[index].file.size,
                responseFile.id
              )
            );
          });
        }

        dispatch(closeNotesModal());
        dispatch(saveAnnotationSuccess());
        // $FlowFixMe
        dispatch(fetchWidgetContent(getState().notesWidget.widgetId));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .catch(() => dispatch(saveAnnotationFailure()));
  };

export const editAnnotation =
  (attachedFiles: AttachedFile[]): ThunkAction =>
  (
    dispatch: (action: Action | AnnotationAction | ThunkAction) => Action,
    getState: Function
  ) => {
    dispatch(editAnnotationLoading());
    const annotationData = getState().annotation;
    const transformedAttachments = transformFilesForUpload(attachedFiles);

    let attachmentAttributes = [...annotationData.attachments];
    attachmentAttributes = attachmentAttributes.concat(transformedAttachments);

    $.ajax({
      method: 'PUT',
      url: `/annotations/${annotationData.id}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        title: annotationData.title,
        content: annotationData.content,
        annotationable_type: annotationData.annotationable_type,
        annotationable_id: annotationData.annotationable.id,
        annotation_date: annotationData.annotation_date,
        organisation_annotation_type_id: annotationData.annotation_type_id,
        annotation_actions_attributes: annotationData.annotation_actions,
        attachments_attributes: attachmentAttributes,
      }),
    })
      .done((response) => {
        const unConfirmedFiles = response.annotation.attachments.filter(
          (file) => file.confirmed === false
        );
        if (unConfirmedFiles.length > 0) {
          // order of files is kept (last added will be the last in the list),
          // so response attachment order is the same as the original file order
          unConfirmedFiles.forEach((responseFile, index) => {
            dispatch(
              triggerFileUpload(
                attachedFiles[index].file,
                responseFile.id,
                responseFile.presigned_post
              )
            );
            dispatch(
              triggerToastDisplayProgress(
                attachedFiles[index].file.name,
                attachedFiles[index].file.size,
                responseFile.id
              )
            );
          });
        }

        dispatch(closeNotesModal());
        dispatch(editAnnotationSuccess());
        dispatch(
          updateAnnotation(getState().notesWidget.widgetId, response.annotation)
        );

        const notesWidgets = getState().dashboard.widgets.filter((widget) => {
          return widget.widget_type === 'annotation';
        });

        // need to refresh all notes widget on the dashboard
        // because multiple notes widgets can contain the same note
        notesWidgets.forEach((widget) => {
          // $FlowFixMe
          dispatch(fetchWidgetContent(widget.id));
        });

        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(editAnnotationFailure());
      });
  };
