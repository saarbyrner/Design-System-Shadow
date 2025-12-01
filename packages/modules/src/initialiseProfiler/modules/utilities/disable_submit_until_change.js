export default () => {
  $(() => {
    $('form[data-disable-submit-until-change="true"]').on('change', () => {
      $('.km-form-footer button:disabled').each((index, element) => {
        $(element).prop('disabled', false);
      });
    });
  });
};
