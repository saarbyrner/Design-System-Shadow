import {
  closeCalendarEventsPanel,
  openCalendarEventsPanel,
} from '../CalendarEventsPanel/actions';

describe('Calendar Events Panel Actions', () => {
  it('creates the correct action for CLOSE_CALENDAR_EVENTS_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_CALENDAR_EVENTS_PANEL',
    };

    expect(closeCalendarEventsPanel()).toEqual(expectedAction);
  });

  it('creates the correct action for OPEN_CALENDAR_EVENTS_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_CALENDAR_EVENTS_PANEL',
    };

    expect(openCalendarEventsPanel()).toEqual(expectedAction);
  });
});
