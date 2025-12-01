// @flow
import { connect } from 'react-redux';
import $ from 'jquery';
import { AppTranslated as AppComponent } from '../components/App';
import {
  fetchCalendarEvents,
  updateCalendarFilters,
  openGameModal,
  closeGameModal,
  openSessionModal,
  closeSessionModal,
  openCustomEventModal,
  closeCustomEventModal,
  onSessionSaveSuccess,
  onGameSaveSuccess,
  updateSquadSelection,
  serverRequestError,
  removeIncompleteEvents,
  refreshCalendarEvents,
} from '../actions';
import { openCalendarEventsPanel } from '../components/CalendarEventsPanel/actions';

const mapStateToProps = (state) => ({
  calendarFilters: state.calendarPage.calendarFilters,
  isGameModalOpen: state.calendarPage.gameModal.isOpen,
  isSessionModalOpen: state.calendarPage.sessionModal.isOpen,
  isCustomEventModalOpen: state.calendarPage.customEventModal.isOpen,
  isEventsPanelOpen: state.eventsPanel.isOpen,
  calendarDates: state.calendarPage.calendarDates,
  squadSelection: state.calendarPage.squadSelection,
});

const mapDispatchToProps = (dispatch) => ({
  fetchEvents: (token, startDate, endDate) => {
    dispatch(fetchCalendarEvents(token, startDate, endDate));
  },
  updateCalendarFilters: (checkbox) => {
    dispatch(updateCalendarFilters(checkbox));
  },
  openGameModal: () => {
    dispatch(openGameModal());
  },
  closeGameModal: () => {
    dispatch(closeGameModal());
  },
  openSessionModal: () => {
    dispatch(openSessionModal());
  },
  closeSessionModal: () => {
    dispatch(closeSessionModal());
  },
  openCustomEventModal: () => {
    dispatch(openCustomEventModal());
  },
  closeCustomEventModal: () => {
    dispatch(closeCustomEventModal());
  },
  onGameSaveSuccess: (token) => {
    dispatch(onGameSaveSuccess(token));
  },
  onSessionSaveSuccess: (token) => {
    dispatch(onSessionSaveSuccess(token));
  },
  updateSquadSelection: (squadSelection) => {
    dispatch(updateSquadSelection(squadSelection));
  },
  openEventsPanel: () => {
    dispatch(openCalendarEventsPanel());
  },
  onInitialDataLoadFailure: () => {
    dispatch(serverRequestError());
  },
  onSaveEventSuccess: () => {
    dispatch(removeIncompleteEvents());
    const token = $('meta[name=csrf-token]').attr('content');
    dispatch(refreshCalendarEvents(JSON.stringify(token)));
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
