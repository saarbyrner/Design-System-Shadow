import 'bootstrap-select';

export default () => {
  $(() => {
    // eslint-disable-next-line func-names
    $(document).on('click', "a[data-toggle='ajax-modal']", function (e) {
      e.preventDefault();
      const link = $(this);
      const target = link.data('target') || '#km-modal';
      const large = link.data('modal-large');
      const modalDialog = $('.modal-dialog', target);

      $(`${target} .modal-content`).load(link.attr('href'), () => {
        if ($('#searching_overlay')) {
          $('#searching_overlay').hide();
        }

        if (large) {
          modalDialog.addClass('modal-lg');
        } else {
          modalDialog.removeClass('modal-lg');
        }
        $(target).modal();
      });
    });

    // modal content that loads after DOM load and needs
    // to use selectpicker, will have to be initialized
    $('#km-modal').on('show.bs.modal', () => {
      $('.selectpicker').selectpicker();
    });

    $('#km-modal').on('shown.bs.modal', () => {
      $('#km-modal').addClass('test-bootstrap-modal-loaded');
    });
  });
};
