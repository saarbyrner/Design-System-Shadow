// @flow

import {
  TextField,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';

import SelectOptions from './components/SelectOptions';

type Props = {
  element: HumanInputFormElement,
  value: string | Array<string>,
  validationStatus: {
    status: ValidationStatus,
    message: ?string,
  },
  multi: boolean,
  onChange: Function,
};

const SelectInput = (props: Props) => {
  const { element, value, validationStatus, multi, onChange } = props;
  const {
    element_id: elementId,
    text,
    custom_params: customParams,
  } = element.config;
  const isInvalid = validationStatus.status === 'INVALID';

  const isMultipleChoice =
    element.element_type === INPUT_ELEMENTS.MultipleChoice;

  const handleToggleChange = (
    event: SyntheticMouseEvent<HTMLElement>,
    newValue: string | Array<string> | null
  ) => {
    if (newValue === value) {
      onChange(null);
    } else {
      onChange(newValue);
    }
  };

  return (
    <SelectOptions element={element}>
      {({ selectOptions }) => {
        const selectedValue =
          element.element_type === INPUT_ELEMENTS.SingleChoice
            ? selectOptions.find(
                (selectOption) => selectOption.value === value?.toString()
              )
            : selectOptions.filter((selectOption) =>
                value?.includes(selectOption?.value)
              );

        switch (true) {
          case element.element_type === INPUT_ELEMENTS.SingleChoice &&
            customParams?.style === 'radio':
            return (
              <>
                <FormLabel
                  id={`${elementId}-radio-buttons-group-label`}
                  sx={{ marginBottom: 0 }}
                  error={isInvalid}
                >
                  {text}
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby={`${elementId}-radio-buttons-group-label`}
                  name={`${elementId}-radio-buttons-group`}
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                >
                  {selectOptions?.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={<Radio size="small" />}
                      label={item.label}
                      disabled={customParams?.readonly}
                    />
                  ))}
                </RadioGroup>
              </>
            );
          case customParams?.style === 'toggle':
            return (
              <>
                <FormLabel
                  id={`${elementId}-radio-buttons-group-label`}
                  sx={{ marginBottom: 0 }}
                  error={isInvalid}
                >
                  {text}
                </FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={
                    // For multi-choice, value must be an array. Default to [] if not.
                    isMultipleChoice && !Array.isArray(value) ? [] : value
                  }
                  exclusive={!isMultipleChoice}
                  onChange={handleToggleChange}
                  aria-label="Platform"
                >
                  {selectOptions?.map((item) => (
                    <ToggleButton
                      key={`${item.label}-${elementId}`}
                      value={item.value}
                      disabled={customParams?.readonly}
                    >
                      {item.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </>
            );
          default:
            return (
              <>
                {selectOptions.length > 0 && (
                  <Autocomplete
                    id={`${elementId}-select`}
                    options={selectOptions}
                    multiple={multi}
                    value={selectedValue}
                    onChange={(event, newValue) => {
                      if (!multi) {
                        onChange(newValue?.value || '');
                      } else {
                        onChange(newValue.map((item) => item.value));
                      }
                    }}
                    renderOption={(optionProps, option, { selected }) => (
                      <li {...optionProps}>
                        {element.element_type ===
                          INPUT_ELEMENTS.MultipleChoice && (
                          <Checkbox
                            icon={
                              <KitmanIcon
                                name={KITMAN_ICON_NAMES.CheckBoxOutlineBlank}
                              />
                            }
                            checkedIcon={
                              <KitmanIcon name={KITMAN_ICON_NAMES.CheckBox} />
                            }
                            checked={selected}
                          />
                        )}
                        {option.label}
                      </li>
                    )}
                    readOnly={customParams?.readonly}
                    renderInput={(params) => (
                      <TextField {...params} label={text} error={isInvalid} />
                    )}
                    disableCloseOnSelect={multi}
                  />
                )}
              </>
            );
        }
      }}
    </SelectOptions>
  );
};

export default SelectInput;
