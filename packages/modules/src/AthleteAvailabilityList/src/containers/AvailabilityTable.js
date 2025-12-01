import { connect } from 'react-redux';
import { AvailabilityTableTranslated as AvailabilityTableComponent } from '../components/AvailabilityTable';
import {
  openAddAbsenceModal,
  openAddNoteModal,
  openModInfoModal,
  openRTPModal,
  openDiagnosticModal,
  triggerTreatmentSessionModal,
} from '../actions';

const mapStateToProps = (state) => ({
  athletes: state.athletes.currentlyVisible,
  groupBy: state.athletes.groupBy,
  groupingLabels: state.athletes.groupingLabels,
  groupOrderingByType: state.athletes.groupOrderingByType,
  injuryOsicsPathologies: state.issueStaticData.injuryOsicsPathologies,
  illnessOsicsPathologies: state.issueStaticData.illnessOsicsPathologies,
  bamicGrades: state.issueStaticData.bamicGrades,
  absenceReasons: state.issueStaticData.absenceReasons,
  issueStatusOptions: state.issueStaticData.issueStatusOptions,
  canViewIssues: state.issueStaticData.canViewIssues,
  canManageIssues: state.issueStaticData.canManageIssues,
  canViewAbsences: state.issueStaticData.canViewAbsences,
  canManageAbsences: state.issueStaticData.canManageAbsences,
  canManageMedicalNotes: state.issueStaticData.canManageMedicalNotes,
  canViewNotes: state.issueStaticData.canViewNotes,
  groupAvailability:
    state.athletes.groupBy === 'position'
      ? state.athletes.availabilityByPosition
      : state.athletes.availabilityByPositionGroup,
  isNoteModalOpen: state.noteModal.isModalOpen,
  isModInfoModalOpen: state.modInfoModal.isModalOpen,
});

const mapDispatchToProps = (dispatch) => ({
  openAddAbsenceModal: (athlete) => {
    dispatch(openAddAbsenceModal(athlete));
  },
  openAddNoteModal: (athlete) => {
    dispatch(openAddNoteModal(athlete));
  },
  openModInfoModal: (athlete) => {
    dispatch(openModInfoModal(athlete));
  },
  openRTPModal: (athlete) => {
    dispatch(openRTPModal(athlete));
  },
  openDiagnosticModal: (athlete) => {
    dispatch(openDiagnosticModal(athlete));
  },
  openTreatmentModal: (athlete) => {
    dispatch(triggerTreatmentSessionModal(athlete));
  },
});

const AvailabilityTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailabilityTableComponent);

export default AvailabilityTable;
