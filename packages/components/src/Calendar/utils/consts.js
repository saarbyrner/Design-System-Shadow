// @flow

export const headerToolbar = {
  start: 'prev,next today',
  center: 'title',
  end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
};

export const eventTimeFormat = {
  hour: 'numeric',
  minute: '2-digit',
  meridiem: 'short',
};

export const calendarViews = {
  dayGridMonth: {
    dayMaxEvents: 2,
  },
  timeGrid: {
    eventMinHeight: 15,
    dayHeaderFormat: { weekday: 'short', day: 'numeric' },
  },
  timeGridDay: {
    dayHeaderFormat: { weekday: 'short' },
  },
  list: {
    listDayFormat: {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    },
    listDaySideFormat: false,
  },
};
