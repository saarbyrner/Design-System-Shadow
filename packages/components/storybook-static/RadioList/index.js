// @flow
import InputRadio from '../InputRadio';
import type { RadioOption } from '../InputRadio/types';

type Props = {
  label?: string, // If specified, the radio list will have a form label
  options: Array<RadioOption>,
  change: Function, // Callback when a radio item is clicked
  value?: ?(string | number),
  radioName: string,
  direction?: 'horizontal' | 'vertical',
  /*
    Unique to identity a radio input. If their are
    multiple radio lists being created in a loop for example,
    you will need to uniquely identify each radio list
  */
  uniqueKey?: ?string,
  disabled?: boolean,
  kitmanDesignSystem?: boolean,
};

/**
 * RadioList
 * Renders a list of custom radio inputs. The radio list is read-only. Its
 * value is set from the value prop passed into the component.
 */
const RadioList = ({
  radioName,
  label,
  options,
  change,
  value,
  uniqueKey,
  disabled,
  kitmanDesignSystem,
  direction = 'horizontal',
}: Props) => {
  const radioListClasses = `radioList ${disabled ? 'radioList--disabled' : ''}`;
  const radioListLabel = label ? (
    <legend className="radioList__mainLabel">{label}</legend>
  ) : null;
  const useDesignSystem = !!kitmanDesignSystem;

  // remove spaces and uppercase to create input name
  let inputName = radioName.split(' ').join('').toLowerCase();
  inputName = `${inputName}`;
  inputName = uniqueKey ? `${inputName}_${uniqueKey}` : inputName;

  const radioOptions =
    options.length > 0
      ? options.map((option, index) => (
          <li
            key={option.value.toString()}
            className={`radioList__item radioList__item--${direction}`}
          >
            <InputRadio
              inputName={inputName}
              option={option}
              value={value}
              disabled={disabled}
              change={(optionValue, optionIndex) => {
                change(optionValue, optionIndex);
              }}
              index={index}
              kitmanDesignSystem={useDesignSystem}
            />
          </li>
        ))
      : null;

  return (
    <fieldset className={radioListClasses} data-testid="radio-list">
      {radioListLabel}
      <ul>{radioOptions}</ul>
    </fieldset>
  );
};

export default RadioList;
