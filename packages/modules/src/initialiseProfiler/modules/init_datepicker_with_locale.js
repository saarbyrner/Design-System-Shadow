/*
 * Initialize bootstrap datepicker with default option to use the given user locale
 * without making changes to the base bootstrap-datepicker.js
 * http://bootstrap-datepicker.readthedocs.io/
 */
const initDatepickerWithLocale = (el, options = {}) => {
  const defaultOptions = {
    language: window.userLocale,
    orientation: 'bottom auto',
  };
  // can't use Object.assign at the moment because babel-polyfill cannot be imported here
  // see https://github.com/KitmanLabs/projects/issues/5653
  const updatedOptions = $.extend({}, defaultOptions, options);

  el.datepicker(updatedOptions);

  // When scrolling in a modal, reposition the datepicker
  $('#km-modal').on('scroll', () => {
    $(el).datepicker('place');
  });
};

export default initDatepickerWithLocale;
