// @flow
import classNames from 'classnames';
import type { RadioOption } from './types';
import styling from './style';

// TODO: htmlFor on the label should be the id of the input
// not the name. (issue: #6421)

export type Props = {
  inputName: string,
  option: RadioOption,
  change: Function,
  value?: ?(string | number | boolean),
  disabled?: boolean,
  index: number,
  buttonSide?: 'left' | 'right',
  kitmanDesignSystem?: boolean,
};

const InputRadio = ({
  inputName,
  option,
  change,
  value,
  disabled,
  index,
  buttonSide,
  kitmanDesignSystem,
}: Props) => {
  const style = styling({
    inputName,
    option,
    change,
    value,
    disabled,
    index,
    buttonSide,
    kitmanDesignSystem,
  });

  return (
    <span
      css={style.inputRadio}
      className={classNames('inputRadio', {
        'inputRadio--disabled': disabled,
        'inputRadio--alignButtonRight': buttonSide === 'right',
      })}
    >
      <input
        className="inputRadio__input"
        css={style.input}
        type="radio"
        name={inputName}
        aria-labelledby="inputRadio__label"
        checked={value === option.value || false}
        onFocus={() => {
          if (!disabled && kitmanDesignSystem) {
            change(String(option.value), index);
          }
        }}
        data-validatetype="radio"
        value={option.value}
        readOnly
      />
      <label
        css={style.label}
        onClick={() => {
          if (!disabled) {
            change(String(option.value), index);
          }
        }}
        id="inputRadio__label"
        className="inputRadio__label"
        htmlFor={inputName}
      >
        <span className="inputRadio__button" css={style.button}>
          <span className="inputRadio__active" css={style.active} />
        </span>
        {option.name}
      </label>
    </span>
  );
};

export default InputRadio;
