export default () => {
  $(() => {
    // eslint-disable-next-line func-names
    $('a[data-toggle="true"]').on('click', function () {
      $(`#${$(this).data('toggle-div')}`).slideToggle();
    });
  });
};
