// @flow
import { useEffect, useRef, useState } from 'react';
import { Draggable } from '@fullcalendar/interaction';
import { withNamespaces } from 'react-i18next';
import { Accordion, AppStatus, ExpandingPanel } from '@kitman/components';
import { getSessionTypes } from '@kitman/services';
import type { SessionTypes } from '@kitman/services/src/services/getSessionTypes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import eventTypesData from '../../mockData/eventTypesData';
import styling from './style';
import type { EventCategory, EventGroup, CalendarBaseEvent } from './types';

export type Props = {
  onClose: Function,
  isOpen: boolean,
  defaultEventDuration: number,
  defaultGameDuration: number,
};

const CalendarEventsPanel = (props: I18nProps<Props>) => {
  const draggableEventsHolder = useRef();
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const [eventTypes, setEventTypes] = useState<Array<EventGroup>>([]);

  useEffect(() => {
    let mounted = true;

    if (draggableEventsHolder.current) {
      // eslint-disable-next-line no-new
      new Draggable(draggableEventsHolder.current, {
        itemSelector: '.draggableEvent',
      });
    }
    getSessionTypes().then(
      (sessions: SessionTypes) => {
        if (mounted) {
          const events = sessions.map(({ id, name }) => {
            return {
              type: 'session_event',
              session_type: { id },
              defaultDurationMins: props.defaultEventDuration,
              name,
              title: name,
              workload_type: 1,
              templateId: `session_event_${id}`,
            };
          });
          const eventGroups = [...eventTypesData];

          // Force game durations to be defaultGameDuration
          eventGroups[0].categories[0].events.forEach((gameEvent) => {
            // eslint-disable-next-line no-param-reassign
            gameEvent.defaultDurationMins = props.defaultGameDuration;
          });

          eventGroups[1].categories[0].events = events;
          setEventTypes(eventGroups);
          setRequestStatus('SUCCESS');
        }
      },
      () => {
        if (mounted) {
          setRequestStatus('FAILURE');
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  const style = styling(props);

  const displayEvents = (events: Array<CalendarBaseEvent>) => {
    const eventElements = events.map((event) => (
      <div
        key={`${event.templateId ? event.templateId : ''}_row`}
        css={style.eventRow}
      >
        <div
          css={style.draggableEvent}
          className="icon-drag-handle draggableEvent"
          data-event={JSON.stringify(event)}
        >
          {event.name}
        </div>
      </div>
    ));

    return eventElements;
  };

  const displayEventCategories = (categories: Array<EventCategory>) =>
    categories.map((category) => {
      return (
        <div css={style.category} key={`${category.id}_row`}>
          <span css={style.categoryName}>{category.displayName}</span>
          <div>{displayEvents(category.events)}</div>
        </div>
      );
    });

  return (
    <>
      <ExpandingPanel
        isOpen={props.isOpen}
        onClose={props.onClose}
        title={props.t('Add event')}
      >
        <div css={style.eventGroups} ref={draggableEventsHolder}>
          {eventTypes.map((eventGroup) => {
            return (
              <Accordion
                css={style.accordion}
                key={eventGroup.id}
                title={
                  <span css={style.eventGroupTitle}>
                    {eventGroup.displayName}
                  </span>
                }
                content={displayEventCategories(eventGroup.categories)}
              />
            );
          })}
        </div>
      </ExpandingPanel>
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </>
  );
};

export const CalendarEventsPanelTranslated =
  withNamespaces()(CalendarEventsPanel);
export default CalendarEventsPanel;
