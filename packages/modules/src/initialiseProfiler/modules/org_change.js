export default () => {
  $(document).ready(() => {
    // when the org has been change, show the loading modal
    $('#inputOrg').on('change', () => {
      $('.js-orgChange').show();
    });
  });
};
