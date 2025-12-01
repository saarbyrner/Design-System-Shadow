// @flow
import { EventImpl } from '@fullcalendar/core/internal';
import type { Action } from './types';

/**
 * Called when a calendar event is clicked on
 * @returns Action
 */
export const displayEventTooltip = (
  calendarEvent: EventImpl,
  element: Element
): Action => ({
  type: 'DISPLAY_EVENT_TOOLTIP',
  payload: {
    calendarEvent,
    element,
  },
});

export const hideEventTooltip = (): Action => ({
  type: 'HIDE_EVENT_TOOLTIP',
});
