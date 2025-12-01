// @flow
import type {
  DatesSetArg,
  EventReceiveArg,
  EventResizeDoneArg,
  EventDropArg,
  DateSelectArg,
  EventImpl,
} from '@fullcalendar/core';

import { calendarEventTypeEnumLike } from '@kitman/components/src/Calendar/utils/enum-likes';
import type { EventRecurrenceBasic } from '@kitman/common/src/types/Event';
import { calendarViewOptionEnumLike } from './enum-likes';
import type { TooltipItem } from '../../TooltipMenu';

export type CalendarEventTypeEnumLike = $Values<
  typeof calendarEventTypeEnumLike
>;

type Squad = {
  id: number,
  name: string,
};

type FullCalendarExtendedProps = $Exact<{
  description: string | null,
  recurrence: {
    ...EventRecurrenceBasic,
    rule: string | null,
    rrule_instances: Array<string> | null,
  },
  squad?: Squad,
  type: CalendarEventTypeEnumLike,
  eventCollectionComplete?: boolean | null, // only set for TRAINING_SESSION and not present on migrated TSO events
  visibilityIds?: Array<number>,
  incompleteEvent?: boolean,
}>;

type CalendarEventCommon = $Exact<{
  backgroundColor: string,
  borderColor: string,
  textColor?: string,
  title: string,
  url: string,
  start: string,
  end?: string,
  theme?: ?{
    id: number,
    name: string,
  },
  // Will be extendedProps in the event from FullCalendar
  ...FullCalendarExtendedProps,
}>;

export type CalendarEventFromBE = {
  ...CalendarEventCommon,
  id: number,
};

export type CalendarEventBeforeFullCalendar = {
  ...CalendarEventCommon,
  id?: string, // can be undefined for a new event
  editable?: boolean,
  setEnd?: Function,
  allDay?: boolean,
};

export type ViewObject = {
  type: string,
  title: string,
  activeState: Date,
  currentStart: Date,
  currentEnd: Date,
  calendar: Object,
};

export type EventRenderArg = {
  event: EventImpl,
  backgroundColor: string,
  borderColor: string,
  textColor?: string,
  timeText: string,
  isStart: boolean,
  isEnd: boolean,
  isMirror: boolean,
  isPast: boolean,
  isFuture: boolean,
  isToday: boolean,
  el: Element,
  view: ViewObject,
};

export type EventClickObject = {
  el: Element,
  event: EventImpl,
  jsEvent: PointerEvent,
  view: ViewObject,
};

export type GetAddEventMenuItems = () => Array<TooltipItem>;

export type CalendarViewOption = $Values<typeof calendarViewOptionEnumLike>;

export type FullCalendarDrilledDownProps = {
  events: Array<CalendarEventBeforeFullCalendar>,
  orgTimeZone: string,
  userLocale: string,
  setCalendarLoading: (isLoading: boolean) => void,
  onDatesRender: (datesRenderInfo: DatesSetArg) => void,
  handleEventReceive: (eventObj: EventReceiveArg, timeZone: string) => void,
  handleEventResize: (
    eventResizeInfo: EventResizeDoneArg,
    timeZone: string
  ) => void,
  handleEventDrop: (eventDropInfo: EventDropArg, timeZone: string) => void,
  handleEventSelect: (selectionInfo: DateSelectArg, timeZone: string) => void,
};
