// @flow
import { EventImpl } from '@fullcalendar/core/internal';

type displayEventTooltip = {
  type: 'DISPLAY_EVENT_TOOLTIP',
  payload: {
    calendarEvent: EventImpl,
    element: Element,
  },
};

type hideEventTooltip = {
  type: 'HIDE_EVENT_TOOLTIP',
};

export type Action = displayEventTooltip | hideEventTooltip;
