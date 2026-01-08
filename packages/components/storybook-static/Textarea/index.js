// @flow
import classNames from 'classnames';
import type { Ref } from 'react';
import { ValidationText } from '@kitman/components';

type CSSProperties = {
  [key: string]: string | number,
};
type Props = {
  value: ?string,
  onChange: Function,
  label: ?string,
  maxLimit?: number,
  minLimit?: number,
  placeholder?: string,
  name?: string,
  disabled?: boolean,
  optionalText?: ?string,
  onBlur?: Function,
  kitmanDesignSystem?: boolean,
  invalid?: boolean,
  tabIndex?: number,
  textAreaRef?: Ref<'textarea'>,
  displayValidationText?: boolean,
  customValidationText?: ?string,
  style?: CSSProperties,
};

const Textarea = (props: Props) => (
  <div className="textarea">
    <div
      className={classNames('textarea__label', {
        'textarea__label--disabled': props.disabled,
        'textarea__label--kitmanDesignSystem': props.kitmanDesignSystem,
      })}
    >
      {props.label}
      {props.kitmanDesignSystem && props.optionalText && (
        <span className="textarea__optional--kitmanDesignSystem">
          {props.optionalText}
        </span>
      )}
    </div>
    <textarea
      ref={props.textAreaRef}
      className={classNames('textarea__input', {
        'textarea__input--invalid': props.invalid,
        'textarea__input--kitmanDesignSystem': props.kitmanDesignSystem,
      })}
      value={props.value}
      placeholder={props.placeholder}
      onChange={(event) => props.onChange(event.target.value)}
      data-validatetype="textarea"
      data-minlimit={props.minLimit}
      data-maxlimit={props.maxLimit}
      name={props.name || ''}
      disabled={props.disabled}
      onBlur={props.onBlur}
      tabIndex={props.tabIndex || 0}
      style={props.style}
    />
    {!props.kitmanDesignSystem && props.optionalText && (
      <span className="textarea__optional">{props.optionalText}</span>
    )}
    {props.displayValidationText && props.invalid && (
      <ValidationText customValidationText={props.customValidationText} />
    )}
  </div>
);

export default Textarea;
