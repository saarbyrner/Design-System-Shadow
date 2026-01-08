// @flow
import type { Node } from 'react';

import { Component } from 'react';
import $ from 'jquery';

type Props = {
  validate?: (?boolean) => void,
  successAction?: (?Object) => void,
  customValidation?: (Object) => boolean,
  children?: Node,
  inputNamesToIgnore?: Array<string>,
};

export default class FormValidator extends Component<Props> {
  validateFormEl: ?Object;

  handleCustomValidation: (Object) => boolean;

  constructor(props: Props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.handleCustomValidation = this.handleCustomValidation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.validateFormEl = null;
  }

  componentDidMount() {
    // add event listener for submitting the "form"
    $(this.validateFormEl)
      .find('button[type="submit"]')
      .bind('click', this.submit);
    $(this.validateFormEl)
      .find('.dashboardEditor__buttonContainer button.textButton--primary')
      .bind('click', this.submit);
    $(this.validateFormEl)
      .find('.athleteIssueEditor__footer button.textButton--primary')
      .bind('click', this.submit);
    $(this.validateFormEl)
      .find(
        '.athleteAvailabilityAddAbsenceModal__footer button.textButton--primary'
      )
      .bind('click', this.submit);
    $(this.validateFormEl)
      .find('.athleteProfileAddNoteModal__footer button.textButton--primary')
      .bind('click', this.submit);
    $(this.validateFormEl)
      .find(
        '.athleteAvailabilityModInfoModal__footer button.textButton--primary'
      )
      .bind('click', this.submit);
    $(this.validateFormEl).on('input', 'input', this.handleChange);
    $(this.validateFormEl).bind('input propertychange', (e) =>
      this.handleChange(e)
    );
    $(this.validateFormEl).on('click', '._customDropdown', this.handleChange);
    $(this.validateFormEl).on('click', '._groupedDropdown', this.handleChange);
  }

  /**
   * handleChange() handles input changes
   * takes an input and input type
   */
  handleChange = (event: Object) => {
    const input = $(event.target);
    const inputNamesToIgnore = this.props.inputNamesToIgnore || [];
    if (inputNamesToIgnore.indexOf(input.attr('name')) === -1) {
      // Remove error on all inputs in the form.
      event.target.classList.remove('km-error');
    }

    // Remove error class when someone clicks on the dropdown.
    input.parent('._customDropdown').removeClass('hasError');
    input.parent('._groupedDropdown').removeClass('hasError');
  };

  /**
   * submit() validates the current form/inputs
   */
  submit = (event: ?Object) => {
    const submitButton = event ? event.currentTarget : null;
    const success = this.validateFields();
    if (this.props.validate) {
      this.props.validate(success);
    }
    if (success && this.props.successAction) {
      this.props.successAction(submitButton);
    } else {
      // Scroll to the first error
      const sectionsWithError = document.getElementsByClassName(
        'formValidator__section--hasError'
      );
      if (sectionsWithError.length > 0) {
        sectionsWithError[0].scrollIntoView();
      }
    }
  };

  handleCustomValidation = (input: Object) => {
    let isInputValid = true;
    const inputType = input.data('validatetype') || null;

    if (
      this.props.customValidation &&
      this.props.customValidation(input) === false
    ) {
      isInputValid = false;
      this.addError(input, inputType);
      this.displayErrorMsg(input);
    } else {
      this.removeError(input, inputType);
      this.removeErrorMsg(input);
    }

    return isInputValid;
  };

  /**
   * validateFields() loops throught the inputs and checks if
   * there is an value
   */
  validateFields = () => {
    // get all inputs
    const inputs = this.validateFormEl
      ? this.validateFormEl.getElementsByTagName('input')
      : null;
    let allInputsValid = true;

    // loop through inputs
    if (inputs) {
      for (let index = 0; index < inputs.length; index++) {
        const input = $(inputs[index]);
        const inputNamesToIgnore = this.props.inputNamesToIgnore || [];

        // If there are inputs to exclude from validation, skip
        // FilePond and ReactSelect are a 3rd party libraries, can't
        // add name attribute to their inputs to ignore validation
        if (
          inputNamesToIgnore.indexOf(input.attr('name')) === -1 &&
          input.attr('class') !== 'filepond--browser' &&
          input.parents('.kitmanReactSelect__value-container').length === 0
        ) {
          // eslint-disable-next-line max-depth
          if (!this.isInputValid(input)) {
            allInputsValid = false;
          }
        }
      }
    }

    const checkboxes = this.validateFormEl
      ? this.validateFormEl.getElementsByClassName('reactCheckbox')
      : null;
    if (checkboxes) {
      for (let index = 0; index < checkboxes.length; index++) {
        const checkbox = $(checkboxes[index]);
        const inputNamesToIgnore = this.props.inputNamesToIgnore || [];

        if (inputNamesToIgnore.indexOf(checkbox.attr('name')) === -1) {
          // eslint-disable-next-line max-depth
          if (!this.isCheckboxValid(checkbox)) {
            allInputsValid = false;
          }
        }
      }
    }

    // textarea
    const textareas = this.validateFormEl
      ? this.validateFormEl.getElementsByTagName('textarea')
      : null;

    if (textareas) {
      for (let index = 0; index < textareas.length; index++) {
        const textarea = $(textareas[index]);

        if (!this.isTextareaValid(textarea)) {
          allInputsValid = false;
        }
      }
    }

    // multiSelect
    const multiselects = this.validateFormEl
      ? this.validateFormEl.getElementsByClassName('multiSelect')
      : null;

    if (multiselects) {
      for (let index = 0; index < multiselects.length; index++) {
        const multiselect = $(multiselects[index]);

        if (!this.isMultiselectValid(multiselect)) {
          allInputsValid = false;
        }
      }
    }

    // dropdownWrapper
    const dropdownWrappers = this.validateFormEl
      ? this.validateFormEl.getElementsByClassName('dropdownWrapper')
      : null;

    if (dropdownWrappers) {
      for (let index = 0; index < dropdownWrappers.length; index++) {
        const dropdownWrapper = $(dropdownWrappers[index]);

        if (!this.isDropdownWrapperValid(dropdownWrapper)) {
          allInputsValid = false;
        }
      }
    }

    return allInputsValid;
  };

  displayErrorMsg(input: Object) {
    const $inputWithValidation = input.closest('.js-validationSection');
    if ($inputWithValidation.length > 0) {
      $inputWithValidation.addClass('formValidator__section--hasError');
    }
  }

  removeErrorMsg(input: Object) {
    const $inputWithValidation = input.closest('.js-validationSection');
    if ($inputWithValidation.length > 0) {
      $inputWithValidation.removeClass('formValidator__section--hasError');
    }
  }

  /**
   * addError() adds the error class to an input
   * takes an input and input type
   */
  addError(input: Object, inputType: ?string) {
    switch (inputType) {
      case 'dropdown':
        input.parent('._customDropdown').addClass('hasError');
        input.parent('._groupedDropdown').addClass('hasError');
        break;
      case 'squadSearch':
        input.parents('._squadSearch').addClass('squadSearch--error');
        break;
      case 'multiselect':
        input.addClass('multiSelect--error');
        break;
      case 'textarea':
        input.addClass('km-error');
        break;
      case 'dropdownWrapper':
        input.addClass('dropdownWrapper--invalid');
        break;
      case 'inputNumeric':
        input.parent('.InputNumeric__inputContainer').addClass('km-error');
        break;
      default:
        input.addClass('km-error');
    }
  }

  /**
   * removeError() removes the error class to an input
   * takes an input and input type
   */
  removeError(input: Object, inputType: ?string) {
    switch (inputType) {
      case 'dropdown':
        input.parent('._customDropdown').removeClass('hasError');
        input.parent('._groupedDropdown').removeClass('hasError');
        break;
      case 'multiselect':
        input.removeClass('multiSelect--error');
        break;
      case 'dropdownWrapper':
        input.removeClass('dropdownWrapper--invalid');
        break;
      case 'inputNumeric':
        input.parent('.InputNumeric__inputContainer').removeClass('km-error');
        break;
      default:
        input.removeClass('km-error');
    }
  }

  isCheckboxValid(input: Object) {
    let isInputValid = true;

    // if checkbox is part of a checkbox group it needs to be validated on the component
    // as it should be a unique case of behaviour
    if (input.parents('.checkboxGroup').length > 0) {
      return this.handleCustomValidation(input);
    }

    if (!input.hasClass('reactCheckbox--checked')) {
      isInputValid = false;
      this.addError(input);
    } else {
      this.removeError(input);
    }

    return isInputValid && this.handleCustomValidation(input);
  }

  isInputValid(input: Object) {
    let isInputValid = true;
    const inputType = input.data('validatetype') || null;

    // check if a value has been set
    if (
      !input.data('ignore-validation') &&
      (!input.val() || input.val() === '-')
    ) {
      isInputValid = false;
      this.addError(input, inputType);
      this.displayErrorMsg(input);
    } else if (
      // regular number type inputs where we don't allow letters or the number 0
      input[0].type === 'number' &&
      !input.data('ignore-validation') &&
      input.data('disable-zero') &&
      (!input.val() || input.val() === '-' || input.val() === '0')
    ) {
      isInputValid = false;
      this.addError(input, inputType);
      this.displayErrorMsg(input);
    } else {
      this.removeError(input, inputType);
      this.removeErrorMsg(input);
    }

    return (
      isInputValid &&
      this.validateMaxMin(input) &&
      this.validateMaxMinCharacters(input) &&
      this.validateNumber(input) &&
      this.handleCustomValidation(input)
    );
  }

  isTextareaValid(textarea: Object) {
    let isTextareaValid = true;
    const characterMaxLimit = textarea.data('maxlimit');
    const characterMinLimit = textarea.data('minlimit');

    // check if a value has been set
    if (
      (characterMinLimit && textarea.val().length < characterMinLimit) ||
      (characterMaxLimit && textarea.val().length > characterMaxLimit)
    ) {
      isTextareaValid = false;
      this.addError(textarea, 'textarea');
      this.displayErrorMsg(textarea);
    } else {
      this.removeError(textarea, 'textarea');
      this.removeErrorMsg(textarea);
    }

    return isTextareaValid;
  }

  isMultiselectValid(multiselect: Object) {
    let isMultiSelectValid = true;

    // check if a value has been set
    if (multiselect.hasClass('multiSelect--isEmpty')) {
      isMultiSelectValid = false;
      this.addError(multiselect, 'multiselect');
    } else {
      this.removeError(multiselect, 'multiselect');
    }

    return isMultiSelectValid;
  }

  isDropdownWrapperValid(dropdownWrapper: Object) {
    let isDropdownWrapperValid = true;

    if (dropdownWrapper.hasClass('dropdownWrapper--validationFailure')) {
      isDropdownWrapperValid = false;
      this.addError(dropdownWrapper, 'dropdownWrapper');
    } else {
      this.removeError(dropdownWrapper, 'dropdownWrapper');
    }

    return isDropdownWrapperValid;
  }

  validateMaxMin(input: Object) {
    let isInputValid = true;
    const inputMaxLimit = input.attr('data-maxlimit') || null;
    const inputMinLimit = input.attr('data-minlimit') || null;

    if (inputMaxLimit && inputMinLimit) {
      isInputValid =
        parseInt(input.val(), 10) < parseInt(inputMaxLimit, 10) &&
        parseInt(input.val(), 10) > parseInt(inputMinLimit, 10);

      if (!isInputValid) {
        this.addError(input);
      }
      if (isInputValid) {
        this.removeError(input);
      }
    }

    return isInputValid;
  }

  validateMaxMinCharacters(input: Object) {
    let isInputValid = true;
    const inputMaxLimit = input.attr('data-maxcharlimit') || null;
    const inputMinLimit = input.attr('data-mincharlimit') || null;

    if (inputMinLimit && !inputMaxLimit) {
      isInputValid = input.val().length >= parseInt(inputMinLimit, 10);
    }
    if (!inputMinLimit && inputMaxLimit) {
      isInputValid = input.val().length <= parseInt(inputMaxLimit, 10);
    }
    if (inputMinLimit && inputMaxLimit) {
      isInputValid =
        input.val().length >= parseInt(inputMinLimit, 10) &&
        input.val().length <= parseInt(inputMaxLimit, 10);
    }

    if (!isInputValid) {
      this.addError(input);
    }
    if (isInputValid) {
      this.removeError(input);
    }

    return isInputValid;
  }

  validateNumber(input: Object) {
    let isInputValid = true;

    // number type inputs don't let you enter letters and we want to let the users enter letters
    // so that we can show an error only at submit, letting them know what the problem is
    // instead not updating the input while they are typing
    if (input.attr('name') === 'inputNumber') {
      isInputValid =
        // eslint-disable-next-line no-restricted-globals
        !isNaN(parseFloat(input.val())) && isFinite(input.val());

      if (!isInputValid) {
        this.addError(input);
      }

      if (isInputValid) {
        this.removeError(input);
      }
    }

    return isInputValid;
  }

  render() {
    return (
      <div
        ref={(el) => {
          this.validateFormEl = el;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
