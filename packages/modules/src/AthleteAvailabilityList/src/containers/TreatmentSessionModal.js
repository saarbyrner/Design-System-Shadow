import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { TreatmentSessionModalTranslated as TreatmentSessionModal } from '@kitman/modules/src/TreatmentSessionModal';
import {
  closeTreatmentSessionModal,
  addTreatmentAttribute,
  removeTreatmentAttribute,
  selectBodyArea,
  selectPractitioner,
  selectTimezone,
  selectTreatmentModality,
  selectTreatmentReason,
  setTreatmentDuration,
  unselectBodyArea,
  unselectParentBodyArea,
  updateTreatmentNoteText,
  updateTreatmentNoteRichText,
  updateTreatmentNoteAttribute,
  addTreatmentAttributes,
} from '@kitman/modules/src/TreatmentSessionModal/actions';
import { saveTreatmentSession } from '../actions';

export default (props) => {
  const dispatch = useDispatch();
  const [attachedFiles, setAttachedFiles] = useState([]);
  const athlete = useSelector((state) => state.treatmentSessionModal.athlete);
  const isOpen = useSelector(
    (state) => state.treatmentSessionModal.isModalOpen
  );
  const noteContent = useSelector(
    (state) =>
      state.treatmentSessionModal.treatmentSession.annotation_attributes.content
  );
  const selectedPractitioner = useSelector(
    (state) => state.treatmentSessionModal.treatmentSession.user_id
  );
  const selectedTimezone = useSelector(
    (state) => state.treatmentSessionModal.treatmentSession.timezone
  );
  const treatmentAttributes = useSelector(
    (state) =>
      state.treatmentSessionModal.treatmentSession.treatments_attributes
  );
  const bodyAreaOptions = useSelector(
    (state) => state.treatmentSessionModal.staticData.bodyAreaOptions
  );
  const treatmentModalityOptions = useSelector(
    (state) => state.treatmentSessionModal.staticData.treatmentModalityOptions
  );
  const reasonOptions = useSelector(
    (state) => state.treatmentSessionModal.staticData.reasonOptions
  );
  const users = useSelector(
    (state) => state.treatmentSessionModal.staticData.users
  );

  return (
    <TreatmentSessionModal
      athlete={athlete}
      attachedFiles={attachedFiles}
      isOpen={isOpen}
      noteContent={noteContent}
      onAddTreatmentAttribute={() => {
        dispatch(addTreatmentAttribute());
      }}
      onClickCloseModal={() => {
        dispatch(closeTreatmentSessionModal());
      }}
      onClickSaveTreatmentSession={(startTime, endTime) => {
        dispatch(saveTreatmentSession(startTime, endTime, attachedFiles));
      }}
      onRemoveTreatmentAttribute={(index) => {
        dispatch(removeTreatmentAttribute(index));
      }}
      onSelectBodyArea={(bodyAreaId, bodyPartParentId, index) => {
        dispatch(selectBodyArea(bodyAreaId, bodyPartParentId, index));
      }}
      onSelectPractitioner={(practitionerId) => {
        dispatch(selectPractitioner(practitionerId));
      }}
      onSelectTimezone={(timezone) => {
        dispatch(selectTimezone(timezone));
      }}
      onSelectTreatmentModality={(modalityId, index) => {
        dispatch(selectTreatmentModality(modalityId, index));
      }}
      onSelectTreatmentReason={(reasonId, index) => {
        const reasonObj = JSON.parse(reasonId);
        dispatch(selectTreatmentReason(reasonObj, index));
      }}
      onSetTreatmentDuration={(duration, index) => {
        dispatch(setTreatmentDuration(duration, index));
      }}
      onUnselectBodyArea={(bodyAreaId, index) => {
        dispatch(unselectBodyArea(bodyAreaId, index));
      }}
      onUnselectParentBodyArea={(bodyAreaIdArray, index) => {
        dispatch(unselectParentBodyArea(bodyAreaIdArray, index));
      }}
      onUpdateFiles={setAttachedFiles}
      onUpdateTreatmentNoteText={(newText) => {
        dispatch(updateTreatmentNoteText(newText));
      }}
      onUpdateTreatmentNoteRichText={(content) => {
        dispatch(updateTreatmentNoteRichText(content));
      }}
      onUpdateTreatmentNoteAttribute={(newText, index) => {
        dispatch(updateTreatmentNoteAttribute(newText, index));
      }}
      onAddTreatmentAttributes={(templateAttributes) => {
        dispatch(addTreatmentAttributes(templateAttributes));
      }}
      selectedPractitioner={selectedPractitioner}
      selectedTimezone={selectedTimezone}
      treatmentAttributes={treatmentAttributes}
      bodyAreaOptions={bodyAreaOptions}
      treatmentModalityOptions={treatmentModalityOptions}
      reasonOptions={reasonOptions}
      users={users}
      {...props}
    />
  );
};
