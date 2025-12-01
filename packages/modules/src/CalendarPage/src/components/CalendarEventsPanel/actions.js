// @flow
import type { Action } from './types';

export const closeCalendarEventsPanel = (): Action => ({
  type: 'CLOSE_CALENDAR_EVENTS_PANEL',
});

export const openCalendarEventsPanel = (): Action => ({
  type: 'OPEN_CALENDAR_EVENTS_PANEL',
});
