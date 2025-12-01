import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import { hideAppStatus } from '@kitman/modules/src/Annotations/components/AnnotationModal/actions';
import transformAnnotationResponse from '@kitman/modules/src/Annotations/components/AnnotationModal/utils';
import { NotesWidgetTranslated as NotesWidget } from '../components/NotesWidget';
import {
  archiveNote,
  clickActionCheckbox,
  fetchNextNotes,
  restoreNote,
  triggerNoteModal,
  confirmDeleteAttachment,
  hideNotesWidgetStatus,
  deleteAttachment,
  updateNotesNameRequest,
} from '../redux/actions/notesWidget';
import { fetchWidgetContent } from '../redux/actions/widgets';

export default (props) => {
  const dispatch = useDispatch();
  const canViewNotes = useSelector((state) => state.staticData.canViewNotes);
  const canCreateNotes = useSelector(
    (state) => state.staticData.canCreateNotes
  );
  const canEditNotes = useSelector((state) => state.staticData.canEditNotes);
  const updatedAction = useSelector((state) => state.notesWidget.updatedAction);
  const notesModalStatus = useSelector(
    (state) => state.notesWidget.notesModal.status
  );
  const notesModalMessage = useSelector(
    (state) => state.notesWidget.notesModal.message
  );
  const noteViewStatus = useSelector(
    (state) => state.notesWidget.noteViewStatus.status
  );
  const noteViewMessage = useSelector(
    (state) => state.notesWidget.noteViewStatus.message
  );
  const notesWidgetStatus = useSelector(
    (state) => state.notesWidget.notesWidgetStatus.status
  );
  const notesWidgetMessage = useSelector(
    (state) => state.notesWidget.notesWidgetStatus.message
  );
  const notesWidgetSecondaryMessage = useSelector(
    (state) => state.notesWidget.notesWidgetStatus.secondaryMessage
  );
  const containerType = useSelector((state) => state.staticData.containerType);

  const setNotesWidgetName = useCallback(
    (name, annotationTypes, population, timeScope) => {
      dispatch(
        updateNotesNameRequest(
          props.widgetId,
          name,
          annotationTypes,
          population,
          timeScope
        )
      );
    },
    [dispatch, props.widgetId]
  );

  return (
    <ErrorBoundary>
      <NotesWidget
        onUpdateName={setNotesWidgetName}
        onAddNote={(
          annotation,
          notesWidgetSettingsId,
          notesWidgetName,
          selectedAnnotationTypes,
          selectedPopulation,
          selectedTimeScope,
          selectedTimeRange
        ) => {
          dispatch(
            triggerNoteModal(
              annotation,
              notesWidgetSettingsId,
              notesWidgetName,
              selectedAnnotationTypes,
              selectedPopulation,
              selectedTimeScope,
              selectedTimeRange,
              {
                isEditing: false,
                isDuplicating: false,
                isAthleteProfile: false,
              }
            )
          );
        }}
        onClickActionCheckbox={(action) =>
          dispatch(clickActionCheckbox(action))
        }
        onClickViewArchivedNotes={(widgetId, archived) =>
          dispatch(fetchWidgetContent(widgetId, 'annotation', { archived }))
        }
        onArchiveNote={(annotation) => dispatch(archiveNote(annotation))}
        onEditNote={(
          annotation,
          notesWidgetSettingsId,
          notesWidgetName,
          selectedAnnotationTypes,
          selectedPopulation,
          selectedTimeScope,
          selectedTimeRange
        ) =>
          dispatch(
            triggerNoteModal(
              transformAnnotationResponse(annotation),
              notesWidgetSettingsId,
              notesWidgetName,
              selectedAnnotationTypes,
              selectedPopulation,
              selectedTimeScope,
              selectedTimeRange,
              { isEditing: true, isDuplicating: false, isAthleteProfile: false }
            )
          )
        }
        onDuplicateNote={(
          annotation,
          notesWidgetSettingsId,
          notesWidgetName,
          selectedAnnotationTypes,
          selectedPopulation,
          selectedTimeScope,
          selectedTimeRange
        ) =>
          dispatch(
            triggerNoteModal(
              transformAnnotationResponse(annotation),
              notesWidgetSettingsId,
              notesWidgetName,
              selectedAnnotationTypes,
              selectedPopulation,
              selectedTimeScope,
              selectedTimeRange,
              { isEditing: false, isDuplicating: true, isAthleteProfile: false }
            )
          )
        }
        onRestoreNote={(annotation) => dispatch(restoreNote(annotation))}
        onFetchNextNotes={(widgetId, page) => {
          dispatch(fetchNextNotes(widgetId, page));
        }}
        notesWidgetStatus={notesWidgetStatus}
        notesWidgetMessage={notesWidgetMessage}
        notesWidgetSecondaryMessage={notesWidgetSecondaryMessage}
        onDeleteAttachment={(widgetId, annotation, fileId) => {
          dispatch(confirmDeleteAttachment(widgetId, annotation, fileId));
        }}
        deleteAttachment={(annotation, fileId) => {
          dispatch(deleteAttachment(annotation, fileId));
        }}
        hideNotesWidgetStatus={() => {
          dispatch(hideNotesWidgetStatus());
        }}
        updatedAction={updatedAction}
        canViewNotes={canViewNotes}
        canCreateNotes={canCreateNotes}
        canEditNotes={canEditNotes}
        notesModalStatus={notesModalStatus}
        notesModalMessage={notesModalMessage}
        hideNotesModalStatus={() => dispatch(hideAppStatus())}
        noteViewStatus={noteViewStatus}
        noteViewMessage={noteViewMessage}
        hideNoteViewStatus={() => dispatch(hideAppStatus())}
        containerType={containerType}
        {...props}
      />
    </ErrorBoundary>
  );
};
