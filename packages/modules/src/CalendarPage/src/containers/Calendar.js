// @flow
import { forwardRef } from 'react';
import { connect } from 'react-redux';
import { Calendar as CalendarComponent } from '@kitman/components';

import {
  setCalendarLoading,
  handleEventClick,
  handleEventDrop,
  handleEventReceive,
  handleEventResize,
  handleEventSelect,
  removeIncompleteEvents,
  onViewChange,
  onDatesRender,
} from '../actions';

const selectedCalendarView =
  window.localStorage && window.localStorage.getItem('selectedCalendarView')
    ? window.localStorage.getItem('selectedCalendarView')
    : 'dayGridMonth';

const mapStateToProps = (state) => ({
  events: state.calendarPage.events,
  selectedCalendarView,
});

const mapDispatchToProps = (dispatch) => ({
  setCalendarLoading: (isLoading) => {
    dispatch(setCalendarLoading(isLoading));
  },
  handleEventClick: (eventObj) => {
    dispatch(handleEventClick(eventObj));
  },
  handleEventReceive: (eventObj, timeZone) => {
    dispatch(handleEventReceive(eventObj, timeZone));
  },
  handleEventResize: (eventResizeInfo, timeZone) => {
    dispatch(handleEventResize(eventResizeInfo, timeZone));
  },
  handleEventDrop: (eventDropInfo, timeZone) => {
    dispatch(handleEventDrop(eventDropInfo, timeZone));
  },
  handleEventSelect: (selectionInfo, timeZone) => {
    dispatch(removeIncompleteEvents());
    dispatch(handleEventSelect(selectionInfo, timeZone));
  },
  onViewChange: (viewInfo) => {
    dispatch(onViewChange(viewInfo));
  },
  onDatesRender: (viewInfo) => {
    dispatch(onDatesRender(viewInfo));
  },
});

const ConnectedCalendar = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarComponent);

// TODO: Flow is complaining but I will have to read up on AbstractComponent to solve
// https://medium.com/flow-type/supporting-react-forwardref-and-beyond-f8dd88f35544
// $FlowFixMe
const Calendar = forwardRef((props, ref) => (
  <ConnectedCalendar {...props} forwardedRef={ref} />
));

export default Calendar;
