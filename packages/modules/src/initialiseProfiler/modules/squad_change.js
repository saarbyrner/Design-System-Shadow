export default () => {
  $(document).ready(() => {
    // when the squad has been changed, show the loading overlay to prevent data from being queried
    // in the context of another squad
    $('.js-squadLink').on('click', () => {
      $('.js-squadChange').show();
    });
  });
};
