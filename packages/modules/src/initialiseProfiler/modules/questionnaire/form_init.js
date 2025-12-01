/* eslint-disable func-names */
import {
  hideEmptyFieldProceedModal,
  addClsToClosestEl,
  clearErrorClsFromAllFields,
  setSaveButtonEnabledByFormState,
  removeClsFromClosestEl,
} from './form_helpers';
import initScale from './scale_element';

//
// Add error css class to fields that are filled incorrectly
//
export const addErrorClsToIncorrectFields = (
  errorResponse,
  fieldBlockSelectorCls,
  fieldSelectorCls,
  fieldBlockErrorCls,
  fieldErrorCls
) => {
  Object.keys(errorResponse).forEach((field) => {
    addClsToClosestEl(
      $(`#${field}`),
      fieldBlockSelectorCls,
      fieldBlockErrorCls
    );
    addClsToClosestEl($(`#${field}`), fieldSelectorCls, fieldErrorCls);
  });
};

//
// Adds or removes a class on the inputs in the group
// This is a temporary solution and should be refactored
// in the future to make it more dynamic
//
export const setInputIgnoreClass = (inputEl, targetEl, ignoreCls) => {
  inputEl.on('click', function () {
    const $targetInput = targetEl.find($('input'));
    if ($(this).val() === 'yes') {
      $targetInput.removeClass(ignoreCls);
    } else if ($(this).val() === '') {
      $targetInput.addClass(ignoreCls);
    } else {
      $targetInput.addClass(ignoreCls);
    }
  });
};

//
// Scrolls the view to the target element
//
export const scrollElIntoView = (elementId) => {
  document.getElementById(elementId).scrollIntoView();
};

//
// Sets the visibility of old injuries input
//
export const setElVisiblity = (inputEl, targetEl) => {
  inputEl.on('click', function () {
    if ($(this).val() === 'yes') {
      targetEl.show();
    } else {
      targetEl.hide();
    }
  });
};

export const handleClientSideErrorOnForm = (
  formEl,
  errorResponse,
  fieldBlockSelectorCls,
  fieldSelectorCls,
  fieldBlockErrorCls,
  fieldErrorCls
) => {
  const warnElId = 'error_warning';
  const $errorWarning = $(`#${warnElId}`);

  hideEmptyFieldProceedModal();
  clearErrorClsFromAllFields(
    formEl,
    fieldBlockSelectorCls,
    fieldSelectorCls,
    fieldBlockErrorCls,
    fieldErrorCls
  );
  addErrorClsToIncorrectFields(
    errorResponse,
    fieldSelectorCls,
    fieldBlockErrorCls,
    fieldErrorCls
  );
  $errorWarning.show();
  scrollElIntoView(warnElId);
};

export const setOldInjuryInputGroupVisibility = () => {
  const $oldInjuryInput = $('input[name="old_injury_affecting"]');
  const $priorInjuries = $('#priorInjuries');
  setElVisiblity($oldInjuryInput, $priorInjuries);
  setInputIgnoreClass(
    $oldInjuryInput,
    $priorInjuries,
    'ignore_when_checking_empty_fields'
  );
};

//
// Radio change event handler
//
export const setActiveClsOnRadioWhenClicked = (fieldBlockSelectorCls) => {
  $('input:radio').on('click', function () {
    $(this)
      .closest(fieldBlockSelectorCls)
      .find('label.active')
      .removeClass('active');
    $(this).closest('label').addClass('active');
  });
};

export const initBodyScale = () => {
  $('body')
    .find('.scaleField')
    .each(function () {
      initScale($(this));
    });
};

export const initModal = (
  formEl,
  fieldBlockSelectorCls,
  fieldBlockErrorCls
) => {
  $('#myModal').on('hidden.bs.modal', () => {
    setSaveButtonEnabledByFormState(
      formEl,
      fieldBlockSelectorCls,
      fieldBlockErrorCls
    );
  });
};

//
// Remove both the block and field error css class from an input block
//
export const removeAllErrorClsFromInputBlock = (
  el,
  fieldBlockSelectorCls,
  fieldSelectorCls,
  fieldBlockErrorCls,
  fieldErrorCls
) => {
  if (el.closest(fieldBlockSelectorCls).hasClass(fieldBlockErrorCls)) {
    removeClsFromClosestEl(el, fieldBlockSelectorCls, fieldBlockErrorCls);
    removeClsFromClosestEl(el, fieldSelectorCls, fieldErrorCls);
  }
};

//
// Enable the form save button when input values change
// Note: keyup() is used because it runs it's callback without the field losing focus
// so that I can click the save immediately after entering any characters.
// Slider needs to be handled separately because change() doesn't affect hidden inputs.
// Textarea needs to be handled separately because neither keyup() nor change() affects it.
//
export const enableSaveBtnOnAnyFieldChange = (
  formEl,
  fieldBlockSelectorCls,
  fieldBlockErrorCls
) => {
  const textFields = formEl.find('input[type="text"], textarea');
  const otherField = formEl.find('input[type="radio"], select');
  const sliderOption = formEl.find('.scaleField');
  textFields.on('keyup', () => {
    setSaveButtonEnabledByFormState(
      formEl,
      fieldBlockSelectorCls,
      fieldBlockErrorCls
    );
  });
  otherField.on('change', () => {
    setSaveButtonEnabledByFormState(
      formEl,
      fieldBlockSelectorCls,
      fieldBlockErrorCls
    );
  });
  sliderOption.find('li').on('click', () => {
    setSaveButtonEnabledByFormState(
      formEl,
      fieldBlockSelectorCls,
      fieldBlockErrorCls
    );
  });
};

//
// Remove error css class when incorrect field is edited
// Note: keyup() is used for text input because it runs it's callback without
// the field losing focus
// so that I can click the save immediately after entering any characters.
// Slider needs to be handled separately because change() doesn't affect hidden inputs.
//
export const removeErrorClsOnFieldChange = (
  formEl,
  fieldSelectorCls,
  fieldBlockErrorCls
) => {
  const textField = formEl.find('input[type="text"], textarea');
  const otherField = formEl.find('input[type="radio"]:checked, select');
  const sliderOption = formEl.find('.scale li');
  textField.on('keyup', function () {
    removeAllErrorClsFromInputBlock(
      $(this),
      fieldSelectorCls,
      fieldBlockErrorCls
    );
  });
  otherField.on('change', function () {
    removeAllErrorClsFromInputBlock(
      $(this),
      fieldSelectorCls,
      fieldBlockErrorCls
    );
  });
  sliderOption.on('click', function () {
    removeAllErrorClsFromInputBlock(
      $(this),
      fieldSelectorCls,
      fieldBlockErrorCls
    );
  });
};

export const initForm = (
  formEl,
  fieldBlockSelectorCls,
  fieldSelectorCls,
  fieldBlockErrorCls
) => {
  initBodyScale();
  initModal(formEl, fieldBlockSelectorCls, fieldBlockErrorCls);
  setOldInjuryInputGroupVisibility();
  setActiveClsOnRadioWhenClicked(fieldBlockSelectorCls);
  enableSaveBtnOnAnyFieldChange(
    formEl,
    fieldBlockSelectorCls,
    fieldBlockErrorCls
  );
  removeErrorClsOnFieldChange(formEl, fieldSelectorCls, fieldBlockErrorCls);
};
