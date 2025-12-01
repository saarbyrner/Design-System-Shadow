import { connect } from 'react-redux';
import { AthleteAvailabilityHistoryTranslated as AthleteAvailabilityHistory } from '../components/AthleteAvailabilityHistory';
import {
  addNewEvent,
  removeEvent,
  updateIssueStatus,
  updateEventDate,
} from '../actions';

const mapStateToProps = (state) => ({
  injuryStatusOptions: state.ModalData.injuryStatusOptions || [],
  initialEventsOrder: state.ModalData.eventsOrder || [],
  events: state.IssueData.events || {},
  updatedEventsOrder: state.IssueData.events_order,
  // The form should be disabled if the user
  // is editing an old injury recurrence.
  // The user should be able to edit the last injury recurrence
  // or a none recurrent injury.
  isDisabled:
    state.ModalData.formMode === 'EDIT' &&
    state.IssueData.has_recurrence &&
    !state.IssueData.is_last_occurrence,
});

const mapDispatchToProps = (dispatch) => ({
  addInjuryStatusEvent: () => {
    dispatch(addNewEvent());
  },
  removeInjuryStatusEvent: (statusId) => {
    dispatch(removeEvent(statusId));
  },
  onInjuryStatusChange: (optionId, statusId) => {
    dispatch(updateIssueStatus(optionId, statusId));
  },
  onInjuryStatusEventDateChange: (editedDate, statusId) => {
    dispatch(updateEventDate(editedDate, statusId));
  },
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AthleteAvailabilityHistory);

export default App;
