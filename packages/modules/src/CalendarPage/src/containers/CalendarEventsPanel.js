// @flow
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import $ from 'jquery';

import { EditEventPanelTranslated as EventSidePanel } from '@kitman/modules/src/PlanningEventSidePanel';
import type { EventFormData } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import type { FullCalendarRef } from '@kitman/modules/src/CalendarPage/src/types';

import {
  editEventDetails,
  removeIncompleteEvents,
  refreshCalendarEvents,
} from '../actions';
import { CalendarEventsPanelTranslated as CalendarEventsPanel } from '../components/CalendarEventsPanel';
import { closeCalendarEventsPanel } from '../components/CalendarEventsPanel/actions';
import {
  eventFormDataToCalendarBaseEvent,
  resetFullCalendarEventState,
} from '../utils/eventUtils';

export type Props = {
  defaultEventDuration?: number,
  defaultGameDuration?: number,
  calendarRef: FullCalendarRef,
  canManageWorkload: boolean,
  eventConditions: EventConditions,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
};

const CalendarEventsPanelContainer = (props: Props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.eventsPanel.isOpen);
  const mode = useSelector((state) => state.eventsPanel.mode);
  const event = useSelector((state) => state.eventsPanel.event);
  const fullCalendarEvents = useSelector((state) => state.calendarPage.events);

  const calendarEventId = event?.virtualEventId ?? event?.calendarEventId;

  const getFullCalendarAPI = () => props.calendarRef.current?.getApi();
  const getFullCalendarEventById = () =>
    getFullCalendarAPI()?.getEventById(calendarEventId);

  const updateEventTimeInfo = (updatedFormData: EventFormData) => {
    const calEvent = getFullCalendarEventById();
    if (calEvent) {
      const startTimeMoment = moment.tz(
        updatedFormData.start_time,
        updatedFormData.local_timezone
      );
      const endTimeMoment = moment.tz(
        updatedFormData.start_time,
        updatedFormData.local_timezone
      );

      if (updatedFormData.duration) {
        endTimeMoment.add(updatedFormData.duration, 'minutes');
      }

      calEvent.setDates(
        startTimeMoment.toISOString(),
        endTimeMoment.toISOString()
      );

      // Copy over just the time data to a copy of the existing event
      const updatedEvent = { ...event }; // Deep copy not required
      updatedEvent.local_timezone = updatedFormData.local_timezone;
      // N.B planning event & CalendarBaseEvent use prop named start_date not start_time
      updatedEvent.start_date = updatedFormData.start_time;
      updatedEvent.duration = updatedFormData.duration;
      dispatch(editEventDetails(updatedEvent));
    }
  };

  const updateEventTitle = (eventTitle: ?string) => {
    const defaultEventTitle = '';
    // We use session_type.name for the event name when when no title is
    // specified. These gets cleared when editing the event, so ensuring it is
    // set again if it exists.
    const titleToUse =
      eventTitle === defaultEventTitle ? event.session_type?.name : eventTitle;
    const calEvent = getFullCalendarEventById();
    if (calEvent) {
      calEvent.setProp('title', titleToUse ?? '');
    }
    const updatedEvent = { ...event, name: eventTitle };
    dispatch(editEventDetails(updatedEvent));
  };

  const updateEventDetails = (
    updatedDetail: Object,
    updatedFormData: EventFormData
  ) => {
    const updatedEvent = {
      ...event,
      ...eventFormDataToCalendarBaseEvent(updatedFormData),
    };
    dispatch(editEventDetails(updatedEvent));
  };

  return (
    <>
      {mode === 'VIEW_TEMPLATES' && (
        <CalendarEventsPanel
          isOpen={isOpen}
          defaultEventDuration={props.defaultEventDuration}
          defaultGameDuration={props.defaultGameDuration}
          onClose={() => {
            dispatch(removeIncompleteEvents());
            dispatch(closeCalendarEventsPanel());
          }}
        />
      )}
      {mode !== 'VIEW_TEMPLATES' && (
        <EventSidePanel
          isCalendarMode
          isOpen={isOpen}
          panelType="EXPANDING"
          panelMode={mode}
          planningEvent={event}
          canManageWorkload={props.canManageWorkload}
          onUpdatedEventTimeInfoCallback={updateEventTimeInfo}
          onUpdatedEventTitleCallback={updateEventTitle}
          onUpdatedEventDetailsCallback={updateEventDetails}
          redirectToEventOnClose={
            window.getFlag('planning-tab-sessions') &&
            window.getFlag('selection-tab-displaying-in-session') &&
            mode === 'DUPLICATE'
          }
          onSaveEventSuccess={() => {
            dispatch(removeIncompleteEvents());
            const token = $('meta[name=csrf-token]').attr('content');
            dispatch(refreshCalendarEvents(JSON.stringify(token)));
            dispatch(closeCalendarEventsPanel());
          }}
          onClose={() => {
            resetFullCalendarEventState({
              fullCalendarEventsFromRedux: fullCalendarEvents,
              fullCalendarEventId: calendarEventId,
              fullCalendarApi: getFullCalendarAPI(),
            });
            dispatch(removeIncompleteEvents());
            dispatch(closeCalendarEventsPanel());
          }}
          eventConditions={props.eventConditions}
          onFileUploadStart={props.onFileUploadStart}
          onFileUploadSuccess={props.onFileUploadSuccess}
          onFileUploadFailure={props.onFileUploadFailure}
          calendarRef={props.calendarRef}
        />
      )}
    </>
  );
};

CalendarEventsPanelContainer.defaultProps = {
  defaultEventDuration: 60,
  defaultGameDuration: 60,
};

export default CalendarEventsPanelContainer;
