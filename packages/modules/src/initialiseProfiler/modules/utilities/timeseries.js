import BootstrapDateRangePicker, {
  getDateRangeText,
} from '@kitman/common/src/utils/dateRangePicker';

const onApply = (newValue) => {
  $('span#ts_selector').html(newValue.text);

  const $tsForm = $('form#ts_controls');
  const values = {};

  values.date_start = newValue.start;
  values.date_end = newValue.end;

  $('.loading-screen-daterange').text($tsForm.find('span#ts_selector').html());
  $('.loading-screen').fadeIn(200);

  $.ajax({
    type: 'POST',
    url: $tsForm.attr('action'),
    data: values,
    success: () => {
      // eslint-disable-next-line no-restricted-globals
      if (location.hash) {
        window.location.reload(true);
      } else {
        window.location = window.location.href.split('?')[0];
      }
    },
    error: (data) => {
      // eslint-disable-next-line no-console
      if (console && console.error) {
        console.error(data); // eslint-disable-line no-console
      }
    },
  });
};

export default () => {
  $(document).ready(() => {
    if ($('#ts_controls').length > 0) {
      const $daterangeElement = $('span#ts_selector');

      const dataStart = $('body').attr('data-ts-start');
      const dataEnd = $('body').attr('data-ts-end');
      const timezone = $('body').attr('data-timezone');

      const dateRangeText = getDateRangeText(
        moment.utc(dataStart),
        moment.utc(dataEnd),
        timezone
      );
      $daterangeElement.html(dateRangeText);

      const turnaroundList = JSON.parse(
        document.getElementById('ts_controls').dataset.turnaroundlist
      );
      new BootstrapDateRangePicker($daterangeElement, turnaroundList, onApply); // eslint-disable-line no-new
    }
  });
};
