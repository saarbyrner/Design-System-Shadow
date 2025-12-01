/* eslint-disable func-names */
//
// Boolean, returns true if there is at least one input filled in the form
//
export const isFormPartlyFilled = (formEl) => {
  let hasValues = false;

  formEl
    .find(
      'input[type="text"], input.slider_value, input[type="radio"]:checked, select'
    )
    .each(function () {
      if ($(this).val() !== '') {
        hasValues = true;
      }
    });
  return hasValues;
};

//
// Get unfilled/unset inputs from the form
//
export const getEmptyTextFields = (formEl) => {
  const $textInputs = formEl.find('input[type="text"]');
  return $textInputs.filter(function () {
    return $(this).val() === '';
  });
};
export const getEmptyRadioInputs = () =>
  $('.js-radioset').filter(function () {
    return $(this).find('.active').length === 0;
  });
export const getEmptyScaleElement = (ignoreCls) =>
  $('.scaleField .slider_value').filter(function () {
    return $(this).val() === '' && !$(this).hasClass(ignoreCls);
  });
export const getEmptyColourPickerElement = () => {
  window.$colourPickerEl = $('select.colour_select');
  return window.$colourPickerEl && window.$colourPickerEl.val() === ''
    ? window.$colourPickerEl
    : null;
};

//
// Boolean, returns true if all the inputs are filled/set in the form
//
export const isFormFullyFilled = (formEl) => {
  const $emptyTextFields = getEmptyTextFields(formEl)
    ? getEmptyTextFields(formEl)
    : [];
  const $emptyRadioInputs = getEmptyRadioInputs() ? getEmptyRadioInputs() : [];
  const $emptyScaleElement = getEmptyScaleElement(
    'ignore_when_checking_empty_fields'
  )
    ? getEmptyScaleElement('ignore_when_checking_empty_fields')
    : [];
  const $emptyColourPicker = getEmptyColourPickerElement()
    ? getEmptyColourPickerElement()
    : [];

  return (
    $emptyTextFields &&
    $emptyTextFields.length === 0 &&
    $emptyRadioInputs &&
    $emptyRadioInputs.length === 0 &&
    $emptyScaleElement &&
    $emptyScaleElement.length === 0 &&
    $emptyColourPicker &&
    $emptyColourPicker.length === 0
  );
};

//
// Boolean, returns true if there is at least one field has an error
//
export const formHasErrors = (
  formEl,
  fieldBlockSelectorCls,
  fieldBlockErrorCls
) => {
  const fields = formEl.find(
    'input[type="text"], input.slider_value, input[type="radio"]:checked, select'
  );
  return fields.closest(fieldBlockSelectorCls).hasClass(fieldBlockErrorCls);
};

//
// Enable or disable the form submit button
//
export const setSubmitBtnDisabled = (formEl) => {
  formEl.find('button[type="submit"]').attr('disabled', 'disabled');
};
export const setSubmitBtnEnabled = (formEl) => {
  formEl.find('button[type="submit"]').attr('disabled', false);
};

//
// Set the form submit button enabled or disabled based on the state of the form
//
export const setSaveButtonEnabledByFormState = (
  formEl,
  fieldBlockSelectorCls,
  fieldBlockErrorCls
) => {
  if (
    isFormPartlyFilled(formEl) &&
    !formHasErrors(formEl, fieldBlockSelectorCls, fieldBlockErrorCls)
  ) {
    setSubmitBtnEnabled(formEl);
  } else {
    setSubmitBtnDisabled(formEl);
  }
};

//
// Add or remove field and block field error css class
//
export const removeClsFromClosestEl = (el, closestSelectorCls, clsToRemove) => {
  el.closest(closestSelectorCls).removeClass(clsToRemove);
};
export const addClsToClosestEl = (el, closestSelectorCls, clsToAdd) => {
  el.closest(closestSelectorCls).addClass(clsToAdd);
};

//
// Remove the error highlight css class from all fields
//
export const clearErrorClsFromAllFields = (
  formEl,
  fieldBlockSelectorCls,
  fieldSelectorCls,
  fieldBlockErrorCls,
  fieldErrorCls
) => {
  formEl.find(fieldBlockSelectorCls).each(function () {
    $(this).removeClass(fieldBlockErrorCls);
    $(this).find(fieldSelectorCls).removeClass(fieldErrorCls);
  });
};

//
// Show or hide the verification modal about whether
// you want to proceed without all fields filled
//
export const showEmptyFieldProceedModal = () => {
  $('#myModal').modal('show');
};
export const hideEmptyFieldProceedModal = () => {
  $('#myModal').modal('hide');
};
