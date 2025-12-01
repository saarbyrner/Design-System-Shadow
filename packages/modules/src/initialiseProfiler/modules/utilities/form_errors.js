/* eslint-disable func-names */
export default () => {
  $(() => {
    $('.km-form-error').each(function () {
      if ($.trim($(this).text()).length) {
        $(this).prev().addClass('km-error');
      }
    });

    $('input.km-error').on('keyup', function () {
      $(this).removeClass('km-error');
      const nextElement = $(this).next();
      if (!nextElement.hasClass('inputNumeric__descriptor')) {
        nextElement.hide();
      }
    });

    $('.km-error > button').on('click', function () {
      $(this).parent().removeClass('km-error');
      $(this).parent().find('.km-form-error').hide();
    });
  });
};
