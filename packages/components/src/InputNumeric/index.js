// @flow
import type { Ref } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import classNames from 'classnames';

import i18n from '@kitman/common/src/utils/i18n';
import { InfoTooltip, ValidationText } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

type Props = {
  inputRef?: Ref<'Input'>,
  value: ?string | ?number,
  min: ?number,
  onKeyDown: ?(event: KeyboardEvent) => void,
  onBlur?: Function,
  onChange: (newNumberString: string) => void,
  label?: string,
  inputMode?: 'decimal' | 'numeric',
  placeholder?: string,
  descriptor?: ?string,
  descriptorSide?: 'left' | 'right',
  optional?: ?boolean,
  name?: string,
  disabled?: ?boolean,
  isInvalid?: boolean,
  size?: 'small' | 'large',
  tooltipDescriptor?: boolean,
  kitmanDesignSystem?: boolean,
  displayValidationText?: boolean,
  customValidationText?: string,
  onWheel?: (event: SyntheticWheelEvent<HTMLInputElement>) => void,
};

// prettier-ignore
// eslint-disable-next-line no-useless-escape
const decimalPattern = "\d+(\.\d*)?";

const InputNumeric = (props: I18nProps<Props>) => {
  const descriptorContent = (side: string) => {
    const propsSide = props.descriptorSide || 'right';
    const descriptor = props.descriptor;
    if (!descriptor || propsSide !== side) {
      return null;
    }

    if (props.tooltipDescriptor) {
      return (
        <InfoTooltip placement="top" content={descriptor}>
          <span
            className={`InputNumeric__descriptor InputNumeric__descriptor--${side}`}
          >
            {descriptor}
          </span>
        </InfoTooltip>
      );
    }

    return (
      <span
        data-testid="InputNumeric|descriptor"
        className={`InputNumeric__descriptor InputNumeric__descriptor--${side}`}
      >
        {props.descriptor}
      </span>
    );
  };

  return (
    <div
      data-testid="InputNumeric"
      className={classNames('InputNumeric', {
        'InputNumeric--kitmanDesignSystem': props.kitmanDesignSystem,
        'InputNumeric--disabled': props.disabled,
        'InputNumeric--small': props.size === 'small',
      })}
    >
      {props.label && (
        <div className="InputNumeric__labelContainer">
          <div data-testid="InputNumeric|label" className="InputNumeric__label">
            {props.label}
          </div>

          {props.kitmanDesignSystem && props.optional && (
            <span
              data-testid="InputNumeric|optional"
              className="InputNumeric__optional"
            >
              {props.t('Optional')}
            </span>
          )}
        </div>
      )}
      <div
        className={classNames('InputNumeric__inputContainer', {
          'InputNumeric__inputContainer--invalid': props.isInvalid,
        })}
      >
        {descriptorContent('left')}
        <input
          ref={props.inputRef}
          onBlur={props.onBlur}
          onChange={(event) => props.onChange(event.target.value)}
          onKeyDown={props.onKeyDown}
          className="InputNumeric__input"
          type="number"
          pattern={props.inputMode === 'decimal' ? decimalPattern : undefined}
          inputMode={props.inputMode ? props.inputMode : undefined}
          placeholder={props.placeholder || ''}
          value={props.value}
          min={props.min}
          name={props.name}
          disabled={props.disabled}
          data-validatetype="inputNumeric"
          onWheel={props.onWheel || undefined}
        />
        {descriptorContent('right')}
      </div>
      {!props.kitmanDesignSystem && props.optional && (
        <span
          data-testid="InputNumeric|optional"
          className="InputNumeric__optional"
        >
          {props.t('Optional')}
        </span>
      )}
      {props.displayValidationText && props.isInvalid && (
        <ValidationText customValidationText={props.customValidationText} />
      )}
    </div>
  );
};

export default InputNumeric;
export const InputNumericTranslated = withNamespaces()(InputNumeric);
