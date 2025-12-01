import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import supportedLocales from '@kitman/components/src/Calendar/supportedLocales';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { styleFullCalendar } from './utilities/calendar_page';

export default () => {
  $(document).ready(() => {
    const athleteCalendarEl = document.getElementById('calendar_athlete');
    if (athleteCalendarEl) {
      const orgTimeZone =
        document.getElementsByTagName('body')[0].dataset.timezone || null;
      const userLocale =
        document.getElementsByTagName('body')[0].dataset.userLocale || null;
      const userTimezone = athleteCalendarEl.dataset.userTimezone;
      const athleteId = athleteCalendarEl.dataset.athleteId;
      const url = athleteCalendarEl.dataset.url;
      const calendarParams = () =>
        // implementation omitted
        ({
          timezone: userTimezone,
          athlete_id: athleteId,
        });

      const calendarView = new Calendar(athleteCalendarEl, {
        /* eslint-enable no-undef */
        timeZone: orgTimeZone,
        locale: userLocale,
        locales: supportedLocales,
        plugins: [dayGridPlugin, momentTimezonePlugin],
        initialView: 'dayGridMonth',
        height: 600,
        headerToolbar: {
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,dayGridWeek',
        },
        firstDay: window.featureFlags['calendar-sunday-start'] ? 0 : 1,
        editable: false,
        events: {
          url,
          extraParams: () => calendarParams(),
        },
        droppable: false,
        loading: (bool) => {
          if (bool) {
            $('.km_loader').show();
          } else {
            styleFullCalendar();
            $('.km_loader').hide();
          }
        },
        eventClick: (info) => {
          if (!info.event.url || info.event.url === 'null') {
            info.jsEvent.preventDefault();
          } else {
            window.open(info.event.url, '_self');
          }
        },
        eventDisplay: 'block',
        displayEventTime: false,
        defaultTimedEventDuration: '00:01',
        viewDidMount: () => {
          styleFullCalendar();
        },
      });
      calendarView.render();
      styleFullCalendar();
      $('body')
        .find('input[type="checkbox"]')
        .on('change', () => {
          calendarView.refetchEvents();
        });
    }
  });
};
