import { connect } from 'react-redux';
import { AppTranslated as App } from '../components/App';
import {
  updateIssueInfo,
  editIssue,
  createIssue,
  updateFormType,
  updateHasRecurrence,
  updateRecurrence,
  updateExaminationDate,
} from '../actions';

const mapStateToProps = (state) => ({
  athleteName: state.ModalData.athleteName,
  formMode: state.ModalData.formMode,
  hasRecurrence: state.IssueData.has_recurrence,
  examinationDate: state.IssueData.examination_date,
  occurrenceDate: state.IssueData.occurrence_date,
  isFirstOccurrence: state.IssueData.is_first_occurrence,
  eventsOrder: state.IssueData.events_order,
  events: state.IssueData.events,
  info: state.IssueData.modification_info || '',
  formType: state.ModalData.formType || 'INJURY',
  recurrenceId: state.IssueData.recurrence_id,
  priorInjuryOptions: state.ModalData.priorInjuryOptions,
  priorIllnessOptions: state.ModalData.priorIllnessOptions,
});

const mapDispatchToProps = (dispatch) => ({
  updateInfo: (info) => {
    dispatch(updateIssueInfo(info));
  },
  createIssue: () => {
    dispatch(createIssue());
  },
  editIssue: () => {
    dispatch(editIssue());
  },
  updateFormType: (formType) => {
    dispatch(updateFormType(formType));
  },
  updateHasRecurrence: (hasRecurrence) => {
    dispatch(updateHasRecurrence(hasRecurrence));
  },
  updateRecurrence: (issueId) => {
    dispatch(updateRecurrence(issueId));
  },
  updateExaminationDate: (examinationDate) => {
    dispatch(updateExaminationDate(examinationDate));
  },
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
