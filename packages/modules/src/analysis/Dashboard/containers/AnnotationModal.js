import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnnotationModalTranslated as AnnotationModal } from '@kitman/modules/src/Annotations/components/AnnotationModal';
import {
  closeNotesModal,
  noteTypeChange,
  noteTitleChange,
  noteTextChange,
  noteRichTextChange,
  noteDateChange,
  noteAthleteChange,
  updateNoteActionText,
  updateNoteActionAssignee,
  addNoteAction,
  removeNoteAction,
  toggleActionCheckbox,
  removeUploadedFile,
  updateActionDueDate,
} from '@kitman/modules/src/Annotations/components/AnnotationModal/actions';
import {
  saveAnnotation,
  editAnnotation,
} from '../redux/actions/annotationModal';

export default (props) => {
  const [attachedFiles, setAttachedFiles] = useState([]);
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.notesWidget.notesModal.isNotesModalOpen
  );
  const annotation = useSelector((state) => state.annotation);
  const modalType = annotation.modalType;
  const widgetAnnotationTypes = useSelector(
    (state) => state.notesWidget.widget_annotation_types
  );
  const athletes = useSelector((state) => state.notesWidget.availableAthletes);
  const timeRange = useSelector((state) => state.notesWidget.time_range) || {};

  return (
    <AnnotationModal
      isTextOptional
      isOpen={isOpen}
      modalType={modalType}
      close={() => {
        dispatch(closeNotesModal(props.annotationTypes));
      }}
      onTypeChange={(typeId) => {
        dispatch(noteTypeChange(typeId));
      }}
      onTitleChange={(newTitle) => {
        dispatch(noteTitleChange(newTitle));
      }}
      onNoteTextChange={(newText) => {
        dispatch(noteTextChange(newText));
      }}
      onNoteRichTextChange={(content) => {
        dispatch(noteRichTextChange(content));
      }}
      onDateChange={(newDate) => {
        dispatch(noteDateChange(newDate));
      }}
      onAthleteChange={(newAthleteId, newAthleteName) => {
        dispatch(noteAthleteChange(newAthleteId, newAthleteName));
      }}
      onUpdateActionText={(newContent, actionIndex) => {
        dispatch(updateNoteActionText(newContent, actionIndex));
      }}
      onUpdateAssignee={(selectedId, actionIndex) => {
        dispatch(updateNoteActionAssignee(selectedId, actionIndex));
      }}
      onAddAction={() => {
        dispatch(addNoteAction());
      }}
      onRemoveAction={(actionIndex) => {
        dispatch(removeNoteAction(actionIndex));
      }}
      onToggleActionCheckbox={(actionIndex) => {
        dispatch(toggleActionCheckbox(actionIndex));
      }}
      onUpdateActionDueDate={(dueDate, actionIndex) =>
        dispatch(updateActionDueDate(dueDate, actionIndex))
      }
      onSaveAnnotation={() => {
        dispatch(saveAnnotation(attachedFiles));
      }}
      onEditAnnotation={() => {
        dispatch(editAnnotation(attachedFiles));
      }}
      onUpdateFiles={setAttachedFiles}
      onRemoveUploadedFile={(fileId) => {
        dispatch(removeUploadedFile(fileId));
      }}
      attachedFiles={attachedFiles}
      annotation={annotation}
      widgetAnnotationTypes={widgetAnnotationTypes}
      athletes={athletes}
      timeRange={timeRange}
      {...props}
    />
  );
};
