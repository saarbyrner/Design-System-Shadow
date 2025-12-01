import { connect } from 'react-redux';
import { AddDiagnosticInterventionModalTranslated as AddDiagnosticInterventionModalComponent } from '../components/AddDiagnosticInterventionModal';
import {
  closeDiagnosticModal,
  getDiagnosticIssues,
  updateDiagnosticAttachments,
  uploadAttachments,
  updateDiagnosticType,
  updateDiagnosticDate,
  updateRelevantDiagnosticInjuries,
  updateRelevantDiagnosticIllnesses,
  updateDiagnosticMedicationType,
  updateDiagnosticMedicationDosage,
  updateDiagnosticMedicationFrequency,
  updateDiagnosticMedicationNotes,
  updateDiagnosticMedicationCompleted,
  updateDiagnosticCovidTestDate,
  updateDiagnosticCovidTestType,
  updateDiagnosticCovidResult,
  updateDiagnosticCovidReference,
  updateDiagnosticCovidAntibodyTestDate,
  updateDiagnosticCovidAntibodyTestType,
  updateDiagnosticCovidAntibodyResult,
  updateDiagnosticCovidAntibodyReference,
  updateDiagnosticAnnotationContent,
  updateDiagnosticRestrictAccessTo,
  saveDiagnostic,
} from '../actions';

const mapStateToProps = (state) => ({
  isOpen: state.diagnosticModal.isModalOpen,
  athleteId: state.diagnosticModal.athlete
    ? state.diagnosticModal.athlete.id
    : null,
  athleteInjuries: state.diagnosticModal.athleteInjuries,
  athleteIllnesses: state.diagnosticModal.athleteIllnesses,
  diagnosticData: state.diagnosticModal.diagnosticData,
  attachments: state.diagnosticModal.attachments,
  injuryOsicsPathologies: state.issueStaticData.injuryOsicsPathologies,
  illnessOsicsPathologies: state.issueStaticData.illnessOsicsPathologies,
  sides: state.issueStaticData.sides,
  diagnosticTypes: state.issueStaticData.diagnosticTypes,
  diagnosticsWithExtraFields: state.issueStaticData.diagnosticsWithExtraFields,
  covidResults: state.issueStaticData.covidResults,
  covidAntibodyResults: state.issueStaticData.covidAntibodyResults,
  restrictAccessList: state.issueStaticData.restrictAccessList,
  injuryStatuses: state.issueStaticData.issueStatusOptions,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeDiagnosticModal());
  },
  updateRelevantInjuries: (issueId) => {
    dispatch(updateRelevantDiagnosticInjuries(issueId));
  },
  updateRelevantIllnesses: (issueId) => {
    dispatch(updateRelevantDiagnosticIllnesses(issueId));
  },
  updateDiagnosticAttachments: (file, index) => {
    dispatch(updateDiagnosticAttachments(file, index));
  },
  uploadAttachments: (file) => {
    dispatch(uploadAttachments(file));
  },
  populateAthleteIssuesForDiagnostics: (athleteId) => {
    dispatch(getDiagnosticIssues(athleteId));
  },
  updateDiagnosticType: (typeId) => {
    dispatch(updateDiagnosticType(typeId));
  },
  updateDiagnosticDate: (date) => {
    dispatch(updateDiagnosticDate(date));
  },
  updateDiagnosticMedicationType: (type) => {
    dispatch(updateDiagnosticMedicationType(type));
  },
  updateDiagnosticMedicationDosage: (dosage) => {
    dispatch(updateDiagnosticMedicationDosage(dosage));
  },
  updateDiagnosticMedicationFrequency: (frequency) => {
    dispatch(updateDiagnosticMedicationFrequency(frequency));
  },
  updateDiagnosticMedicationNotes: (notes) => {
    dispatch(updateDiagnosticMedicationNotes(notes));
  },
  updateDiagnosticMedicationCompleted: (isCompleted) => {
    dispatch(updateDiagnosticMedicationCompleted(isCompleted));
  },
  updateDiagnosticCovidTestDate: (covidTestDate) => {
    dispatch(updateDiagnosticCovidTestDate(covidTestDate));
  },
  updateDiagnosticCovidTestType: (covidTestType) => {
    dispatch(updateDiagnosticCovidTestType(covidTestType));
  },
  updateDiagnosticCovidResult: (covidResult) => {
    dispatch(updateDiagnosticCovidResult(covidResult));
  },
  updateDiagnosticCovidReference: (covidReference) => {
    dispatch(updateDiagnosticCovidReference(covidReference));
  },
  updateDiagnosticCovidAntibodyTestDate: (covidAntibodyTestDate) => {
    dispatch(updateDiagnosticCovidAntibodyTestDate(covidAntibodyTestDate));
  },
  updateDiagnosticCovidAntibodyTestType: (covidAntibodyTestType) => {
    dispatch(updateDiagnosticCovidAntibodyTestType(covidAntibodyTestType));
  },
  updateDiagnosticCovidAntibodyResult: (covidAntibodyResult) => {
    dispatch(updateDiagnosticCovidAntibodyResult(covidAntibodyResult));
  },
  updateDiagnosticCovidAntibodyReference: (covidAntibodyReference) => {
    dispatch(updateDiagnosticCovidAntibodyReference(covidAntibodyReference));
  },
  updateDiagnosticAnnotationContent: (annotationContent) => {
    dispatch(updateDiagnosticAnnotationContent(annotationContent));
  },
  updateDiagnosticRestrictAccessTo: (restrictAccessTo) => {
    dispatch(updateDiagnosticRestrictAccessTo(restrictAccessTo));
  },
  saveDiagnostic: (athleteId, diagnosticData) => {
    dispatch(saveDiagnostic(athleteId, diagnosticData));
  },
});

const AddDiagnosticInterventionModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDiagnosticInterventionModalComponent);

export default AddDiagnosticInterventionModal;
