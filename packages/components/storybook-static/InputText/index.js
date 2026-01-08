// @flow
/* eslint-disable react/sort-comp */
import type { Node, Ref } from 'react';

import { css } from '@emotion/react';
import { Component } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import snakeCase from 'lodash/snakeCase';
import classNames from 'classnames';

import i18n from '@kitman/common/src/utils/i18n';
import type { Validation } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SerializedStyles } from '@emotion/react';
import { ValidationText } from '@kitman/components';

// set the i18n instance
setI18n(i18n);

export type Props = {
  autoFocus?: boolean,
  label?: string,
  name?: string,
  placeholder?: string,
  maxLength?: number,
  customEmptyMessage?: string,
  invalid?: boolean,
  required?: boolean,
  value?: string,
  inputType?: 'text' | 'password' | 'email' | 'tel',
  onValidation?: (Validation) => void,
  customValidations?: Array<Function>,
  onEnterPressed?: () => void,
  revealError?: boolean,
  onFocusTracking?: Function,
  showRemainingChars?: boolean,
  showCharsLimitReached?: boolean,
  disabled?: boolean,
  kitmanDesignSystem?: boolean,
  searchIcon?: boolean,
  calendarIcon?: boolean,
  updatedValidationDesign?: boolean,
  customInputStyles?: SerializedStyles,
  handleKeyDown?: Function,
  displayValidationText?: boolean,
  customValidationText?: string,
};

export type FieldProps = {
  kitmanDesignSystem?: boolean,
  searchIcon?: boolean,
  calendarIcon?: boolean,
  updatedValidationDesign?: boolean,
  invalid?: boolean,
  name?: string,
  label?: string,
  disabled?: boolean,
  focused?: boolean,
  maxLengthCounterContent?: Node,
  maxLengthCounterPosition?: 'top' | 'bottom',
  textAlign?: 'left' | 'right',
  warningMessageContent?: Node,
  validationClass?: string,
  inputType?: 'text' | 'password' | 'number' | 'email' | 'tel',
  value: string,
  placeholder?: string,
  errors?: Array<Validation>,
  readonly?: boolean,
  autoFocus?: boolean,
  optional?: boolean,
  isClearable?: boolean,
  onChange?: Function,
  onKeyDown?: Function,
  onFocus?: Function,
  onBlur?: Function,
  inputRef?: Ref<'input'>,
  customInputStyles?: SerializedStyles,
  displayValidationText?: boolean,
  customValidationText?: string,
};

export const OptionalText = withNamespaces()(({ t }) => (
  <span className="inputText__optional">{t('Optional')}</span>
));

export const InputTextField = (props: FieldProps) => {
  const displayErrors = () => {
    if (!props.errors || props.errors.length < 1) {
      return null;
    }

    return (
      <span
        className={classNames('inputText__error', {
          'inputText__error--updatedDesign': props.updatedValidationDesign,
        })}
      >
        {props.updatedValidationDesign && (
          <i className="icon-validation-error" />
        )}
        {props.errors && props.errors.map((error) => error.message).join(' ')}
      </span>
    );
  };

  return (
    <div
      className={classNames('inputText', {
        'inputText--kitmanDesignSystem': props.kitmanDesignSystem,
        'inputText--invalid': props.invalid,
        'inputText--disabled': props.disabled,
        'inputText--withSearchIcon': props.searchIcon,
        'inputText--withCalendarIcon': props.calendarIcon,
        'inputText--clearable': props.isClearable,
      })}
    >
      {props.label && (
        <div className="inputText__labelContainer">
          <label
            className={classNames({
              'km-form-label': !props.kitmanDesignSystem,
              'inputText__label--disabled': props.disabled,
            })}
            htmlFor={props.label}
          >
            {props.label}
          </label>

          {props.kitmanDesignSystem && props.optional && <OptionalText />}
        </div>
      )}
      {props.focused &&
        props.maxLengthCounterPosition === 'top' &&
        props.maxLengthCounterContent}

      <div className="inputText__inputWrapper">
        <input
          className={classNames(props.validationClass, {
            'km-input-control': !props.kitmanDesignSystem,
          })}
          css={[
            css`
              text-align: ${props.textAlign || 'left'};
            `,
            props.customInputStyles,
          ]}
          type={props.inputType || 'text'}
          name={props.name || snakeCase(props.label)}
          value={props.value}
          placeholder={props.placeholder || ''}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          disabled={props.disabled}
          readOnly={props.readonly && 'readonly'}
          ref={props.inputRef}
          aria-label={props.label ?? props.name}
          autoFocus={props.autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
        />
        {props.kitmanDesignSystem && props.calendarIcon && (
          <i className="icon-calendar" />
        )}
        {props.kitmanDesignSystem && props.searchIcon && (
          <i className="icon-search" />
        )}
        {props.kitmanDesignSystem && props.isClearable && (
          <button
            className="inputText__clearBtn"
            // Prevents the input to blur when clicking this button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              props.onChange && props.onChange({ target: { value: '' } })
            }
            type="button"
          >
            <i className="icon-close" />
          </button>
        )}
      </div>

      {props.focused &&
        props.maxLengthCounterPosition === 'bottom' &&
        props.maxLengthCounterContent}
      {displayErrors()}
      {props.warningMessageContent}
      {props.displayValidationText && props.invalid && (
        <ValidationText customValidationText={props.customValidationText} />
      )}
    </div>
  );
};

InputTextField.defaultProps = {
  maxLengthCounterPosition: 'top',
};

class InputText extends Component<
  I18nProps<Props>,
  {
    isValid: boolean,
    value: string,
    errorMessage: ?string,
    revealError: boolean,
    isInputFocused: boolean,
    showCharLimitMsg: boolean,
  }
> {
  constructor(props: I18nProps<Props>) {
    super(props);
    this.state = {
      isValid: false,
      value: props.value || '',
      errorMessage: null,
      revealError: props.revealError || false,
      isInputFocused: false,
      showCharLimitMsg: false,
    };

    this.onValueChanged = this.onValueChanged.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.UNSAFE_componentWillReceiveProps =
      this.UNSAFE_componentWillReceiveProps.bind(this);
    this.setValidationState = this.setValidationState.bind(this);
    this.setOnValidationProps = this.setOnValidationProps.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount = () => {
    this.validation(this.state.value);
  };

  UNSAFE_componentWillReceiveProps = (newProps: Props) => {
    if (
      newProps.revealError !== this.props.revealError &&
      newProps.revealError !== null
    ) {
      this.setState({ revealError: newProps.revealError });
    }

    /* passed down props should take precedent over internal state.
    e.g the value can be set by a parent component */
    if (newProps.value !== this.state.value) {
      this.setState({
        value: newProps.value,
      });
    }
  };

  handleKeyDown = (e: Object) => {
    if (!(e.currentTarget instanceof HTMLInputElement)) {
      return;
    }

    // Enter key
    if (e.key === 'Enter') {
      // Additional functionality from prop function
      this.props.handleKeyDown?.('Enter');
      e.preventDefault();
      this.onValueChanged(e.currentTarget.value);
      if (
        this.state.isValid &&
        typeof this.props.onEnterPressed === 'function'
      ) {
        this.props.onEnterPressed();
      }
    }
    // ESC key
    if (e.key === 'Escape') {
      this.props.handleKeyDown?.('Escape');
    }
  };

  onValueChanged = (newValue: string) => {
    if (this.props.maxLength) {
      const cutValue = newValue.slice(0, this.props.maxLength);
      this.setState({
        value: cutValue,
        showCharLimitMsg: this.showCharLimitMsg(newValue),
      });
      this.validation(cutValue);
    } else {
      this.setState({ value: newValue });
      this.validation(newValue);
    }
  };

  showCharLimitMsg(newValue: string) {
    if (!this.props.maxLength || this.props.showCharsLimitReached === false)
      return false;

    return newValue.length > this.props.maxLength;
  }

  getRemainingCharacters(value: string) {
    return parseInt(this.props.maxLength, 10) - value.length;
  }

  validation = (value: string) => {
    const errors: Array<Validation> = [];

    if (this.props.required && value.trim().length <= 0) {
      errors.push({
        isValid: false,
        type: 'required',
        message:
          this.props.customEmptyMessage ||
          `${this.props.t('A value is required')}`,
      });
    }

    // loop through the custom validations
    if (this.props.customValidations) {
      this.props.customValidations.map((customValidation) => {
        const validation = customValidation(value.trim());
        if (!validation.isValid) {
          errors.push(validation);
        }
        return null;
      });
    }

    this.setValidationState(errors);
    this.setOnValidationProps(errors, value);
  };

  setValidationState = (errors: Array<Validation>) => {
    const isValid = errors.length <= 0 || false;
    this.setState({
      isValid,
      errorMessage: isValid ? null : errors[0].message,
    });
  };

  setOnValidationProps = (errors: Array<Validation>, value: string) => {
    const isValid = errors.length <= 0 || false;
    if (this.props.onValidation) {
      this.props.onValidation({
        isValid,
        value,
      });
    }
  };

  getMaxLengthCounter(value: string) {
    return this.props.maxLength && this.props.showRemainingChars !== false ? (
      <span className="inputText__lengthCounter">
        {this.props.t('{{remainingCharacters}} characters remaining', {
          remainingCharacters: this.getRemainingCharacters(value),
        })}
      </span>
    ) : null;
  }

  getWarningMessage() {
    return this.state.showCharLimitMsg ? (
      <span className="inputText__warning">
        {this.props.t('{{maxLength}} character limit reached', {
          maxLength: this.props.maxLength,
        })}
      </span>
    ) : null;
  }

  handleFocus = () => {
    if (typeof this.props.onFocusTracking === 'function') {
      this.props.onFocusTracking();
    }
    this.setState({ revealError: false, isInputFocused: true });
  };

  render() {
    const validationClass =
      this.state.revealError && !this.state.isValid ? 'km-error' : '';
    return (
      <InputTextField
        autoFocus={this.props.autoFocus}
        kitmanDesignSystem={this.props.kitmanDesignSystem}
        updatedValidationDesign={this.props.updatedValidationDesign}
        searchIcon={this.props.searchIcon}
        calendarIcon={this.props.calendarIcon}
        invalid={this.props.invalid}
        name={this.props.name}
        label={this.props.label}
        disabled={this.props.disabled}
        focused={this.state.isInputFocused}
        maxLengthCounterContent={this.getMaxLengthCounter(this.state.value)}
        warningMessageContent={this.getWarningMessage()}
        validationClass={validationClass}
        inputType={this.props.inputType}
        value={this.state.value}
        placeholder={this.props.placeholder}
        errors={
          this.state.revealError && this.state.errorMessage
            ? [{ isValid: false, message: this.state.errorMessage }]
            : []
        }
        onChange={(event) => this.onValueChanged(event.target.value)}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={() => {
          this.setState({ revealError: true, isInputFocused: false });
        }}
        customInputStyles={this.props.customInputStyles}
        customValidationText={this.props.customValidationText}
        displayValidationText={this.props.displayValidationText}
      />
    );
  }
}

export default InputText;
export const InputTextTranslated = withNamespaces()(InputText);
