// @flow
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import momentTimezone from '@fullcalendar/moment-timezone';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import type { ViewMountArg } from '@fullcalendar/core';

import type { I18nProps } from '@kitman/common/src/types/i18n';

import supportedLocales from './supportedLocales';
import styles from './utils/styles';
import { calendarViewOptionEnumLike } from './utils/enum-likes';
import { sortEvents, getEventContent } from './utils/helpers';
import { calendarViews, eventTimeFormat, headerToolbar } from './utils/consts';
import type {
  FullCalendarDrilledDownProps,
  CalendarViewOption,
  EventRenderArg,
} from './utils/types';

type Props = {
  onViewDidMount: (view: ViewMountArg) => void,
  forwardedRef: any,
  handleEventClick: Function,
  currentCalendarView: CalendarViewOption,
} & FullCalendarDrilledDownProps;

export type TranslatedProps = I18nProps<Props>;

const FullCalendarComponent = ({
  t,
  onViewDidMount,
  forwardedRef,
  handleEventDrop,
  handleEventReceive,
  handleEventResize,
  handleEventSelect,
  handleEventClick,
  userLocale,
  orgTimeZone,
  events,
  currentCalendarView,
  setCalendarLoading,
  onDatesRender,
}: TranslatedProps) => {
  const onEventDidMount = (arg: EventRenderArg) => {
    const {
      el,
      backgroundColor,
      event: { extendedProps },
    } = arg;

    const $eventEl = $(el);
    const $marker = $eventEl.find('.fc-list-event-dot');

    if (currentCalendarView === 'listWeek' && backgroundColor === '#FFFFFF') {
      $marker.css('border-width', `1px`);
      $marker.css('padding', `4px`);
    }

    if (
      window.featureFlags['calendar-web-drag-n-drop'] &&
      extendedProps?.incompleteEvent &&
      extendedProps?.type === 'UNKNOWN'
    ) {
      handleEventClick(arg);
    }
  };

  const plugins = [
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    momentTimezone,
    interactionPlugin,
  ];

  const buttonText = window.featureFlags['optimized-calendar']
    ? false
    : {
        today: t('Today'),
        month: t('Month'),
        week: t('Week'),
        day: t('Day'),
        list: t('List'),
      };

  return (
    <div
      className="calendar"
      css={
        window.featureFlags['optimized-calendar']
          ? [styles.calendar, styles.optimizedCalendarFFCalendar]
          : [styles.calendar]
      }
    >
      <FullCalendar
        ref={forwardedRef}
        initialView={
          currentCalendarView || calendarViewOptionEnumLike.dayGridMonth
        }
        plugins={plugins}
        timeZone={orgTimeZone}
        locale={userLocale}
        locales={supportedLocales}
        headerToolbar={
          window.featureFlags['optimized-calendar'] ? false : headerToolbar
        }
        buttonText={buttonText}
        displayEventTime
        displayEventEnd
        firstDay={window.featureFlags['calendar-sunday-start'] ? 0 : 1}
        height="100%"
        selectable={window.featureFlags['calendar-web-drag-n-drop']}
        droppable={window.featureFlags['calendar-web-drag-n-drop']}
        select={(selectionInfo) =>
          handleEventSelect(selectionInfo, orgTimeZone)
        }
        editable={false}
        eventOverlap
        events={events}
        eventOrder={[
          (firstEvent, secondEvent) => sortEvents(firstEvent, secondEvent),
          'start',
        ]}
        eventClick={handleEventClick}
        eventReceive={(eventObj) => handleEventReceive(eventObj, orgTimeZone)}
        eventResize={(eventResizeInfo) =>
          handleEventResize(eventResizeInfo, orgTimeZone)
        }
        eventDrop={(eventDropInfo) =>
          handleEventDrop(eventDropInfo, orgTimeZone)
        }
        loading={setCalendarLoading}
        eventTimeFormat={eventTimeFormat}
        allDaySlot={!window.featureFlags['calendar-hide-all-day-slot']}
        eventContent={(eventRenderArg) =>
          getEventContent(currentCalendarView, eventRenderArg)
        }
        eventDidMount={onEventDidMount}
        datesSet={onDatesRender}
        dayMaxEventRows
        eventMinHeight={15}
        viewDidMount={onViewDidMount}
        slotDuration="00:30:00"
        defaultTimedEventDuration="00:01"
        slotLabelFormat={eventTimeFormat}
        snapDuration="00:15:00"
        views={calendarViews}
        nowIndicator
        navLinks
      />
    </div>
  );
};
export const FullCalendarComponentTranslated: ComponentType<Props> =
  withNamespaces()(FullCalendarComponent);
export default FullCalendarComponent;
