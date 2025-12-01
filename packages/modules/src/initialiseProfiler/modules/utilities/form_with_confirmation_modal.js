// Generic method to display a confirmation modal on form submit
// To use:
// * make sure the form has a unique id
// * add a data-confirmation-modal-selector attribute to the form tag with the selector of the modal
//   e.g. data-confirmation-modal-selector="#confirmation-modal"
// * add a data-action="confirm" attribute to the confirm button in the modal
export default () => {
  $(() => {
    $('form[data-confirmation-modal-selector]').on('submit', (e) => {
      const form = $(e.target);
      if (form.data('confirmed') === true) {
        return true;
      }

      const modal = $(form.data('confirmation-modal-selector'));
      modal.data('form-selector', `#${form.attr('id')}`);
      modal.modal('show');
      e.preventDefault();
      return false;
    });

    $('button[data-action="confirm"]').on('click', (e) => {
      const button = $(e.target);
      const modal = $(button.closest('.modal'));
      const form = $(modal.data('form-selector'));
      modal.modal('hide');
      form.find('.km-form-actions button').prop('disabled', true);
      form.data('confirmed', true);
      form.submit();
    });
  });
};
