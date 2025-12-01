import initDatepickerWithLocale from '../init_datepicker_with_locale';

// /app/views/fixtures/_form.html.erb
export default () => {
  $(document).ready(() => {
    if (
      document.getElementsByClassName('edit_marker').length > 0 ||
      document.getElementsByClassName('new_marker').length > 0
    ) {
      let disabledDates = null;
      if ($('.input-group.date').attr('data-date-dates-disabled')) {
        disabledDates = $('.input-group.date')
          .attr('data-date-dates-disabled')
          .split(',');
      }
      // init datepicker with locale and custom options first
      initDatepickerWithLocale($('.date'), {
        format: 'dd/mm/yyyy',
      });
      $('.date').datepicker('setDatesDisabled', disabledDates);
    }
  });
};
