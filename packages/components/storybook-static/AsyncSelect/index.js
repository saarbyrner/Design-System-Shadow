// @flow
import { useState } from 'react';
import classNames from 'classnames';
import { css } from '@emotion/react';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import AsyncReactSelect from 'react-select/async';
// $FlowFixMe
import { components } from 'react-select';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { ValidationText } from '@kitman/components';
import SelectComponents from '../Select/Components';
import ReactSelectOverrides from '../Select/ReactSelectOverrides';
import { dropdownTheme, dropdownStyles } from './styles';

const DropdownIndicator = (props: Object) => {
  return (
    <components.DropdownIndicator {...props}>
      <i
        className="icon-search"
        css={css`
          font-size: 20px !important;
        `}
      />
    </components.DropdownIndicator>
  );
};

export type SelectOption = ?{ value: any, label: string };

type Props = {
  label: string,
  value: SelectOption,
  placeholder: string,
  onChange: Function,
  onClickRemove?: Function,
  loadOptions: Function,
  minimumLetters: number,
  isDisabled?: boolean,
  invalid?: boolean,
  appendToBody?: boolean,
  isMulti?: boolean,
  isClearable?: boolean,
  displayValidationText?: boolean,
  customValidationText?: string,
};

const AsyncSelect = (props: Props) => {
  const [inputValue, setInputValue] = useState('');
  const onSearchChange = useDebouncedCallback(
    (value: string, callback: Function) => {
      if (inputValue.length >= props.minimumLetters) {
        props.loadOptions(inputValue, (response) => callback(response));
      }
    },
    400
  );

  return (
    <SelectComponents.Root>
      <SelectComponents.Label
        label={props.label}
        isDisabled={props.isDisabled}
        onClickIcon={props.onClickRemove}
        icon="icon-close"
      />
      <AsyncReactSelect
        cacheOptions
        loadOptions={onSearchChange}
        defaultOptions
        value={props.value}
        onChange={props.onChange}
        inputValue={inputValue}
        onInputChange={(value) => setInputValue(value)}
        placeholder={props.placeholder}
        theme={dropdownTheme}
        styles={dropdownStyles}
        classNamePrefix="kitmanReactSelect"
        className={classNames('kitmanReactSelect', {
          'kitmanReactSelect--invalid': props.invalid,
        })}
        components={{
          DropdownIndicator,
          MenuList: (menuListProps: Object) =>
            inputValue.length >= props.minimumLetters && (
              <ReactSelectOverrides.MenuList {...menuListProps} />
            ),
          LoadingIndicator: (indicatorProps: Object) =>
            inputValue.length >= props.minimumLetters && (
              <components.LoadingIndicator {...indicatorProps} />
            ),
          Option: ReactSelectOverrides.DropdownOption,
          Menu: ReactSelectOverrides.Menu,
          ValueContainer: ReactSelectOverrides.ValueContainer,
          Group: ReactSelectOverrides.Group,
          GroupHeading: ReactSelectOverrides.GroupHeading,
        }}
        menuPortalTarget={props.appendToBody ? document.body : null}
        isDisabled={props.isDisabled}
        menuPlacement="auto"
        isClearable={props.isClearable}
        onClear={props.onClickRemove}
        captureMenuScroll={false}
        useReactSelectInput
        isMulti={props.isMulti}
      />
      {props.displayValidationText && props.invalid && (
        <ValidationText customValidationText={props.customValidationText} />
      )}
    </SelectComponents.Root>
  );
};

AsyncSelect.defaultProps = {
  minimumLetters: 1,
};

export default AsyncSelect;
