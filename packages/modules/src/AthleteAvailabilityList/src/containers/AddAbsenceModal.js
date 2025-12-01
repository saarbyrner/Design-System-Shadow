import { connect } from 'react-redux';
import { AddAbsenceModalTranslated as AddAbsenceModalComponent } from '@kitman/modules/src/AddAbsenceModal';
import {
  closeAddAbsenceModal,
  updateAbsenceReasonType,
  updateAbsenceFromDate,
  updateAbsenceToDate,
  saveAbsence,
} from '../actions';

const mapStateToProps = (state) => ({
  absenceData: state.addAbsenceModal.absenceData,
  absenceReasons: state.issueStaticData.absenceReasons,
  athlete: state.addAbsenceModal.athlete,
  isOpen: state.addAbsenceModal.isModalOpen,
  feedbackModalStatus: state.appStatus.status,
  feedbackModalMessage: state.appStatus.message,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeAddAbsenceModal());
  },
  updateAbsenceReasonType: (reasonId) => {
    dispatch(updateAbsenceReasonType(reasonId));
  },
  updateAbsenceFromDate: (date) => {
    dispatch(updateAbsenceFromDate(date));
  },
  updateAbsenceToDate: (date) => {
    dispatch(updateAbsenceToDate(date));
  },
  saveAbsence: (athleteId, absenceData) => {
    dispatch(saveAbsence(athleteId, absenceData));
  },
});

const AddAbsenceModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAbsenceModalComponent);

export default AddAbsenceModal;
