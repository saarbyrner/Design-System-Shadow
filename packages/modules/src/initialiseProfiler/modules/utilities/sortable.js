/*
    Page reload on select menu change
*/
export default () => {
  $(() => {
    // eslint-disable-next-line func-names
    $('select.sortable').on('change', function () {
      // eslint-disable-next-line no-restricted-globals
      location.href = `${location.pathname}?${$(this).attr('name')}=${$(
        this
      ).val()}`;
    });
  });
};
