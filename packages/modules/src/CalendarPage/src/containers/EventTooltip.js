// @flow
import moment from 'moment-timezone';
import type { EventImpl } from '@fullcalendar/core';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep } from 'lodash';

import { getCurrentUser, getPermissions } from '@kitman/services';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import type { Event } from '@kitman/common/src/types/Event';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { VIRTUAL_EVENT_ID_SEPARATOR } from '@kitman/common/src/consts/events';
import { getDeleteEventData } from '@kitman/common/src/utils/TrackingData/src/data/calendar/getCalendarEventData';
import { resetFullCalendarEventState } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import type { RecurrenceChangeScope } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

import { EventTooltipTranslated as EventTooltip } from '../components/EventTooltip';
import { EventActionConfirmationTranslated as EventActionConfirm } from '../components/EventActionConfirmation';
import { hideEventTooltip } from '../components/EventTooltip/actions';
import {
  deleteEvent,
  fetchEvent,
  removeIncompleteEvents,
  editEventDetails,
  addCalendarEvent,
} from '../actions';
import {
  convertFullCalEvent,
  convertPlanningEventToCalendarEvent,
} from '../utils/eventUtils';
import type { CustomEventPermissions, FullCalendarRef } from '../types';
import { calculatePermission } from '../../../PlanningEvent/src/helpers/utils';

type FetchEventById = {
  isDuplicate: boolean,
  isDeletingEvent?: boolean,
  shouldOpenEditEventSidePanel: boolean,
};

export type Props = {
  defaultEventDuration: number,
  defaultGameDuration: number,
  orgTimeZone: string,
  calendarRef: FullCalendarRef,
};

const EventTooltipContainer = (props: Props) => {
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const [needsDeleteActionConfirm, setNeedsDeleteActionConfirm] =
    useState(false);
  const [isGamesAdmin, setIsGamesAdmin] = useState(false);
  const [canCreateGames, setCanCreateGames] = useState(false);
  const [canEditGames, setCanEditGames] = useState(false);
  const [canDeleteGames, setCanDeleteGames] = useState(false);
  const [isTrainingSessionsAdmin, setIsTrainingSessionsAdmin] = useState(false);
  const [customEventPermissions, setCustomEventPermissions] =
    useState<CustomEventPermissions>({
      canCreate: false,
      canEdit: false,
      canDelete: false,
      isSuperAdmin: false,
    });
  const [canViewIssues, setCanViewIssues] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const dispatch = useDispatch();
  const element = useSelector((state) => state.eventTooltip.element);
  const active = useSelector((state) => state.eventTooltip.active);
  const calendarEvent: EventImpl = useSelector(
    (state) => state.eventTooltip.calendarEvent
  );
  const fullCalendarEvents = useSelector((state) => state.calendarPage.events);
  const eventDataInSidePanel = useSelector((state) => state.eventsPanel.event);
  const calendarEventId =
    eventDataInSidePanel?.virtualEventId ??
    eventDataInSidePanel?.calendarEventId;

  const { trackEvent } = useEventTracking();

  const eventToDelete: Event =
    useSelector((state) => state.deleteEvent.event) ?? {};

  const shouldUseNewCustomEventPermissions: boolean =
    window.featureFlags['custom-events'] &&
    window.featureFlags['staff-visibility-custom-events'];

  useEffect(() => {
    if (shouldUseNewCustomEventPermissions) {
      getCurrentUser().then((currentUser) => {
        setCurrentUserId(currentUser.id);
      });
    }

    getPermissions().then(
      (permissions) => {
        setIsGamesAdmin(permissions.workloads?.includes('games-admin'));
        setCanCreateGames(
          permissions.workloads?.includes('games-create') ||
            permissions.workloads?.includes('games-admin')
        );
        setCanEditGames(
          permissions.workloads?.includes('games-edit') ||
            permissions.workloads?.includes('games-admin')
        );
        setCanDeleteGames(
          permissions.workloads?.includes('games-delete') ||
            permissions.workloads?.includes('games-admin')
        );
        setIsTrainingSessionsAdmin(
          permissions.workloads?.includes('training-sessions-admin')
        );
        if (window.featureFlags['custom-events']) {
          const isSuperAdmin = calculatePermission(
            permissions['calendar-settings'],
            'super-admin-custom-event'
          );
          const eventPermissions = shouldUseNewCustomEventPermissions
            ? {
                canCreate:
                  calculatePermission(
                    permissions['calendar-settings'],
                    'create-custom-event'
                  ) || isSuperAdmin,
                canEdit:
                  calculatePermission(
                    permissions['calendar-settings'],
                    'edit-custom-event'
                  ) || isSuperAdmin,
                canDelete:
                  calculatePermission(
                    permissions['calendar-settings'],
                    'delete-custom-event'
                  ) || isSuperAdmin,
                isSuperAdmin,
              }
            : {
                canCreate: true,
                canEdit: true,
                canDelete: true,
                isSuperAdmin: true,
              };

          setCustomEventPermissions(eventPermissions);
        }
        setCanViewIssues(permissions.medical?.includes('issues-view') || false);

        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  const fetchEventById = ({
    isDuplicate,
    shouldOpenEditEventSidePanel,
    isDeletingEvent = false,
  }: FetchEventById) => {
    const { id, start } = calendarEvent;
    let idToSend = id;
    const isVirtualEvent = id.includes(VIRTUAL_EVENT_ID_SEPARATOR);
    if (isVirtualEvent) {
      const [originalEventId] = id.split(VIRTUAL_EVENT_ID_SEPARATOR);
      idToSend = originalEventId;
    }
    dispatch(
      fetchEvent({
        calendarEventId: idToSend,
        isDuplicate,
        shouldOpenEditEventSidePanel,
        isDeletingEvent,
        type: calendarEvent.extendedProps.type,
        ...(isVirtualEvent
          ? {
              // Date needs to be in UTC for RRule to function properly
              // https://github.com/jkbrzt/rrule?tab=readme-ov-file#important-use-utc-dates
              startTime: moment(start).toISOString(),
              virtualEventId: id,
            }
          : {}),
      })
    );
  };

  const onConfirm = (params: {
    recurrenceChangeScope?: RecurrenceChangeScope,
    sendNotifications?: boolean,
  }) => {
    const eventId = eventToDelete.id;
    const simplifiedEventType = eventToDelete.type.split('_')[0];
    const eventType =
      simplifiedEventType === 'custom' ? 'event' : simplifiedEventType;
    const eventScope = params?.recurrenceChangeScope || '';
    const sendNotifications = params?.sendNotifications || false;

    if (eventId) {
      dispatch(deleteEvent(eventToDelete, eventScope, sendNotifications));
      setNeedsDeleteActionConfirm(false);
      dispatch(hideEventTooltip());
      trackEvent(
        `Delete ${eventType}`,
        getDeleteEventData(eventToDelete, eventScope)
      );
    }
  };

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <>
          {!needsDeleteActionConfirm && (
            <EventTooltip
              active={active}
              isGamesAdmin={isGamesAdmin}
              isTrainingSessionsAdmin={isTrainingSessionsAdmin}
              canCreateGames={canCreateGames}
              canEditGames={canEditGames}
              canDeleteGames={canDeleteGames}
              customEventPermissions={customEventPermissions}
              currentUserId={currentUserId}
              element={element}
              calendarEvent={calendarEvent}
              orgTimeZone={props.orgTimeZone}
              onClickOutside={() => {
                dispatch(hideEventTooltip());
                if (
                  calendarEvent.type === 'UNKNOWN' ||
                  calendarEvent.extendedProps?.type === 'UNKNOWN'
                )
                  dispatch(removeIncompleteEvents());
              }}
              onDeleteEvent={() => {
                fetchEventById({
                  isDuplicate: false,
                  shouldOpenEditEventSidePanel: false,
                  isDeletingEvent: true,
                });
                setNeedsDeleteActionConfirm(true);
              }}
              onDuplicateEvent={() => {
                dispatch(removeIncompleteEvents());
                fetchEventById({
                  isDuplicate: true,
                  shouldOpenEditEventSidePanel: true,
                });
              }}
              onEditEvent={() => {
                if (eventDataInSidePanel) {
                  resetFullCalendarEventState({
                    fullCalendarEventsFromRedux: fullCalendarEvents,
                    fullCalendarEventId: calendarEventId,
                    fullCalendarApi: props.calendarRef.current?.getApi(),
                  });
                }
                dispatch(removeIncompleteEvents());
                fetchEventById({
                  isDuplicate: false,
                  shouldOpenEditEventSidePanel: true,
                });
              }}
              onEditNewEvent={(
                eventType: 'session_event' | 'game_event' | 'custom_event'
              ) => {
                const calendarEventCopy = cloneDeep(calendarEvent);

                // If end is not present set it with the default duration for the event type
                if (
                  calendarEvent.end == null &&
                  calendarEvent.extendedProps?.incompleteEvent
                ) {
                  const duration =
                    eventType === 'game_event'
                      ? props.defaultGameDuration
                      : props.defaultEventDuration;
                  const endStr = moment(calendarEvent.start)
                    .add(duration, 'minutes')
                    .toISOString();
                  if (typeof calendarEvent.setEnd === 'function') {
                    calendarEvent.setEnd(endStr);
                  } else {
                    calendarEvent.end = endStr;
                  }
                }

                // For some reason, when the user opens the event tooltip *just* when the page loads,
                // `calendarEvent.setEnd` (which we receive from FullCalendar) corrupts the `calendarEvent`
                // object, making it crash inside convertFullCalEvent, when `allDay` is accessed.
                // The clone is used if accessing `allDay` would make the app crash, thus avoiding a crash
                let eventToUse = calendarEvent;
                try {
                  // eslint-disable-next-line no-unused-vars
                  const allDay = calendarEvent.allDay;
                } catch {
                  eventToUse = calendarEventCopy;
                }
                const baseEvent = convertFullCalEvent(
                  eventToUse,
                  props.orgTimeZone
                );
                // $FlowIgnore
                baseEvent.type = eventType;
                delete baseEvent.name;
                const converted =
                  convertPlanningEventToCalendarEvent(baseEvent);
                dispatch(removeIncompleteEvents());
                dispatch(addCalendarEvent(converted));
                dispatch(editEventDetails(baseEvent, 'CREATE'));
                dispatch(hideEventTooltip());
              }}
            />
          )}
          {needsDeleteActionConfirm && (
            <EventActionConfirm
              onDismiss={() => {
                setNeedsDeleteActionConfirm(false);
                dispatch(hideEventTooltip());
              }}
              onConfirm={(params) => {
                onConfirm(params);
              }}
              canViewIssues={canViewIssues}
            />
          )}
        </>
      );
    default:
      return null;
  }
};

export default EventTooltipContainer;
