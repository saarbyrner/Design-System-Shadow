import moment from 'moment-timezone';
import $ from 'jquery';

export default () => {
  $(document).ready(() => {
    const orgTimeZone =
      document.getElementsByTagName('body')[0].dataset.timezone || null;
    moment.tz.setDefault(orgTimeZone);
  });
};
