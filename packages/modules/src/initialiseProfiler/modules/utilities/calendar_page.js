import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import supportedLocales from '@kitman/components/src/Calendar/supportedLocales';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
/* possibly remove this file when removing "react-web-calendar" feature flag */
export const styleFullCalendar = () => {
  const fcButtonClasses =
    'fc-button fc-next-button fc-prev-button fc-button-primary fc-dayGridWeek-button fc-dayGridMonth-button fc-button-active';
  const fcTodayButtonClasses = 'fc-today-button fc-button fc-button-primary';
  const fcIconClasses = 'fc-icon fc-icon-chevron-left fc-icon-chevron-right';

  // 'Prev' and 'Next' buttons
  $('.fc-toolbar-chunk .fc-button-group .fc-prev-button')
    .removeClass('fc-next-button fc-prev-button fc-button-primary')
    .addClass('km-btn-plain km-btn-small km-calendar__arrow');

  $('.fc-toolbar-chunk .fc-button-group .fc-next-button')
    .removeClass(fcButtonClasses)
    .addClass('km-btn-plain km-btn-small km-calendar__arrow');

  $('.fc-icon.fc-icon-chevron-left')
    .removeClass(fcIconClasses)
    .addClass('icon-next-left');

  $('.fc-icon.fc-icon-chevron-right')
    .removeClass(fcIconClasses)
    .addClass('icon-next-right');

  // 'Today' button
  $('.fc-today-button')
    .removeClass(fcTodayButtonClasses)
    .addClass('btn km-btn-secondary km-btn-small km-calendar__today');

  const rightHeaderMenu = $('.fc-header-toolbar').last();
  rightHeaderMenu.addClass('btn-group');
  rightHeaderMenu.find('.fc-button').addClass('btn');

  rightHeaderMenu
    .find('.fc-dayGridWeek-button')
    .prop('style', 'text-transform: capitalize');

  rightHeaderMenu
    .find('.fc-dayGridMonth-button')
    .prop('style', 'text-transform: capitalize !important');
};

// TODO: review do we still need this? I don't believe we do as calendar component is used on main calendar page
export default () => {
  $(() => {
    const setActive = (row) => {
      // Add active class & Check form input
      $(row).prop('checked', true);
    };

    const setInactive = (row) => {
      // Remove active class & Uncheck form input
      $(row).prop('checked', false);
    };

    const calendarParams = () => ({
      squad_sessions: $('input[name="squad_sessions"]').prop('checked'),
      individual_sessions: $('input[name="individual_sessions"]').prop(
        'checked'
      ),
      planned_workloads: $('input[name="planned_workloads"]').prop('checked'),
      games: $('input[name="games"]').prop('checked'),
      authenticity_token: $('meta[name=csrf-token]').attr('content'),
    });

    /* Initialize the calendar
    -----------------------------------------------------------------*/

    $(document).ready(() => {
      if (document.getElementById('calendar')) {
        const orgTimeZone =
          document.getElementsByTagName('body')[0].dataset.timezone || null;
        const userLocale =
          document.getElementsByTagName('body')[0].dataset.userLocale || null;
        const calendarEl = document.getElementById('calendar');
        const calendarView = new Calendar(calendarEl, {
          /* eslint-enable no-undef */
          timeZone: orgTimeZone,
          locale: userLocale,
          locales: supportedLocales,
          plugins: [dayGridPlugin, momentTimezonePlugin],
          initialView: 'dayGridMonth',
          headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth, dayGridWeek',
          },
          firstDay: window.featureFlags['calendar-sunday-start'] ? 0 : 1,
          aspectRatio: 2.3,
          editable: false,
          events: {
            url: '/calendar/events',
            method: 'POST',
            extraParams: () => calendarParams(),
          },
          eventDisplay: 'block',
          eventOrder: [
            (firstEvent) => {
              if (firstEvent.type === 'GAME') {
                return -1;
              }
              return 0;
            },
            'start',
          ],
          eventClick: (info) => {
            if (!info.event.url || info.event.url === 'null') {
              info.jsEvent.preventDefault();
            } else {
              window.open(info.event.url, '_self');
            }
          },
          droppable: false,
          loading: (bool) => {
            if (bool) {
              $('.km-calender-spinner').show();
            } else {
              $('.km-calender-spinner').hide();
              styleFullCalendar();
            }
          },
          displayEventTime: true,
          eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            meridiem: 'lowercase',
          },
          eventLimit: true,
          defaultTimedEventDuration: '00:01',
          viewDidMount: () => {
            styleFullCalendar();
          },
        });
        calendarView.render();

        // eslint-disable-next-line func-names
        $('.calendar-label').on('click', function () {
          const checkbox = $('.calendar-controls').find(
            `input[name="${$(this).attr('for')}"]`
          );
          if (!checkbox.prop('checked')) {
            setActive(checkbox);
          } else {
            setInactive(checkbox);
          }
          calendarView.refetchEvents();
        });
      }
    });
  });
};
