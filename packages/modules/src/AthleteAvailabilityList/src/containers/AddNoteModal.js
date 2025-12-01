import { connect } from 'react-redux';
import { AddNoteModalTranslated as AddNoteModalComponent } from '@kitman/modules/src/AddNoteModal';
import {
  closeAddNoteModal,
  updateNoteDate,
  updateNoteType,
  updateRelevantNoteInjuries,
  updateRelevantNoteIllnesses,
  getLastNote,
  updateNote,
  updateNoteMedicalType,
  updateNoteMedicalTypeName,
  updateNoteAttachments,
  updateNoteExpDate,
  updateNoteBatchNumber,
  updateNoteRenewalDate,
  updateIsRestricted,
  updatePsychOnly,
  saveAthleteProfileNote,
  uploadAttachments,
  hideAppStatus,
  getNoteIssues,
  hideRequestStatus,
} from '@kitman/modules/src/AddNoteModal/actions';

const mapStateToProps = (state) => ({
  isOpen: state.noteModal.isModalOpen,
  athleteId: state.noteModal.athlete ? state.noteModal.athlete.id : null,
  athleteFullName: state.noteModal.athlete
    ? state.noteModal.athlete.fullname
    : '',
  athleteInjuries: state.noteModal.athleteInjuries,
  athleteIllnesses: state.noteModal.athleteIllnesses,
  attachments: state.noteModal.attachments,
  noteData: state.noteModal.noteData,
  injuryOsicsPathologies: state.issueStaticData.injuryOsicsPathologies,
  illnessOsicsPathologies: state.issueStaticData.illnessOsicsPathologies,
  sides: state.issueStaticData.sides,
  appStatus: state.appStatus.status,
  appStatusMessage: state.appStatus.message,
  noteMedicalTypeOptions: state.noteModal.noteMedicalTypeOptions,
  requestStatus: state.noteModal.requestStatus,
  injuryStatuses: state.issueStaticData.issueStatusOptions,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeAddNoteModal());
  },
  updateNoteDate: (date) => {
    dispatch(updateNoteDate(date));
  },
  updateNoteType: (type) => {
    dispatch(updateNoteType(type));
  },
  updateRelevantNoteInjuries: (issueId) => {
    dispatch(updateRelevantNoteInjuries(issueId));
  },
  updateRelevantNoteIllnesses: (issueId) => {
    dispatch(updateRelevantNoteIllnesses(issueId));
  },
  getLastNote: (athleteId) => {
    dispatch(getLastNote(athleteId));
  },
  updateNote: (note) => {
    dispatch(updateNote(note));
  },
  updateNoteMedicalType: (medicalType) => {
    dispatch(updateNoteMedicalType(medicalType));
  },
  updateNoteMedicalTypeName: (name) => {
    dispatch(updateNoteMedicalTypeName(name));
  },
  updateNoteAttachments: (file, index) => {
    dispatch(updateNoteAttachments(file, index));
  },
  updateNoteExpDate: (date) => {
    dispatch(updateNoteExpDate(date));
  },
  updateNoteBatchNumber: (batchNumber) => {
    dispatch(updateNoteBatchNumber(batchNumber));
  },
  updateNoteRenewalDate: (date) => {
    dispatch(updateNoteRenewalDate(date));
  },
  updateIsRestricted: (checked) => {
    dispatch(updateIsRestricted(checked));
  },
  updatePsychOnly: (checked) => {
    dispatch(updatePsychOnly(checked));
  },
  saveNote: (athleteId, noteData) => {
    dispatch(saveAthleteProfileNote(athleteId, noteData, false));
  },
  uploadAttachments: (file) => {
    dispatch(uploadAttachments(file));
  },
  closeAppStatus: () => {
    dispatch(hideAppStatus());
  },
  populateAthleteIssuesForNote: (athleteId) => {
    dispatch(getNoteIssues(athleteId));
  },
  hideRequestStatus: () => {
    dispatch(hideRequestStatus());
  },
});

const AddNoteModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNoteModalComponent);

export default AddNoteModal;
