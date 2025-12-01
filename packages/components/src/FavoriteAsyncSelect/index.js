// @flow

import { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import _uniqueId from 'lodash/uniqueId';
import { css } from '@emotion/react';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import AsyncReactSelect from 'react-select/async';
// $FlowFixMe
import { components } from 'react-select';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import SelectComponents from '../Select/Components';
import ReactFavoriteSelectOverrides from './ReactSelectOverrides';
import ReactSelectOverrides from '../Select/ReactSelectOverrides';
import { dropdownTheme, dropdownStyles } from './styles';

const DropdownIndicator = (props: Object) => {
  return (
    <components.DropdownIndicator {...props}>
      <i
        className="icon-search"
        css={css`
          font-size: 20px !important;
          visibility: ${props.isDisabled ? 'hidden' : 'visible'};
        `}
      />
    </components.DropdownIndicator>
  );
};

export type SelectOption = ?{ value: any, label: string };
export type AdditionalGroupPayload = {
  groupLabel: string,
  options: Array<SelectOption>,
};

type Props = {
  label: string,
  value: SelectOption | Array<Object>,
  placeholder: string,
  arrayOfFavorites: Array<any>,
  cacheOptions?: boolean,
  isDisabled?: boolean,
  invalid?: boolean,
  appendToBody?: boolean,
  additionalGroupPayload?: AdditionalGroupPayload,
  onChange: Function,
  loadOptions: Function,
  handleToggle: Function,
  isMulti?: boolean,
};

const FavoriteAsyncSelect = (props: Props) => {
  const [inputValue, setInputValue] = useState('');

  const onSearchChange = useDebouncedCallback(
    (value: string, callback: Function) => {
      if (inputValue.length >= 0) {
        props.loadOptions(value, (response) => callback(response));
      }
    },
    400
  );

  const memoedMenuList = useCallback(
    (menuListProps: Object) =>
      inputValue.length >= 0 && (
        <ReactFavoriteSelectOverrides.MenuList {...menuListProps} />
      ),
    []
  );
  // Generating a unique label id to pass through to label component
  const labelId = useMemo(() => _uniqueId('select_label_'), []);
  const multiKeyId = useMemo(() => _uniqueId('key_'), []);
  const keyId = useMemo(
    () => _uniqueId(`key_${props.value ? JSON.stringify(props.value) : ''}`),
    [props.value]
  );

  return (
    <SelectComponents.Root>
      <SelectComponents.Label
        labelId={labelId}
        label={props.label}
        isDisabled={props.isDisabled}
      />
      <AsyncReactSelect
        key={props.isMulti ? multiKeyId : keyId}
        isMulti={props.isMulti || false}
        aria-labelledby={labelId}
        value={props.value}
        arrayOfFavorites={props.arrayOfFavorites}
        cacheOptions={props.cacheOptions}
        loadOptions={onSearchChange}
        defaultOptions={[
          { label: 'Favorites', options: props.arrayOfFavorites },
          {
            label: props.additionalGroupPayload?.groupLabel || 'Optional group',
            options: props.additionalGroupPayload?.options || [],
            type: 'extra',
          },
        ]}
        onChange={(val) => {
          setInputValue('');
          if (!props.isMulti) {
            return props.onChange(val);
          }

          // if the val is an Array that means it's returned by react-select
          // internals via the 'x' button on an item within the value container
          // and the filtering is already done for us so we can return the array
          if (Array.isArray(val)) {
            return props.onChange(val);
          }

          // if the value is an object at this point it's been returned by
          // an onToggle of the checkbox within the option
          const valueObj = val;
          const modifyArray = (arr, obj) => {
            const objExists = !!arr.find(({ id }) => id === obj.id);

            if (objExists) {
              // Object found in array, remove it
              return arr.filter(({ id }) => id !== obj.id);
            }
            // Object not found in array, add it
            arr.push(obj);
            return arr || [];
          };
          const filteredValues =
            Array.isArray(props.value) && valueObj
              ? modifyArray(props.value, valueObj)
              : [];

          return props.onChange(filteredValues);
        }}
        hideSelectedOptions={false}
        inputValue={inputValue}
        onInputChange={(value) => setInputValue(value)}
        handleToggle={(val) => props.handleToggle(val)}
        placeholder={
          props.isMulti && Array.isArray(props.value) && props.value.length
            ? null
            : props.placeholder
        }
        theme={dropdownTheme}
        styles={dropdownStyles}
        classNamePrefix="kitmanReactSelect"
        className={classNames('kitmanReactSelect', {
          'kitmanReactSelect--invalid': props.invalid,
        })}
        noOptionsMessage={() =>
          inputValue.length ? 'No options' : 'No favorites'
        }
        components={{
          DropdownIndicator,
          MenuList: memoedMenuList,
          LoadingIndicator: (indicatorProps: Object) =>
            inputValue.length >= 0 && (
              <components.LoadingIndicator {...indicatorProps} />
            ),
          Option: ReactSelectOverrides.DropdownOption,
          IndicatorSeparator: ReactFavoriteSelectOverrides.IndicatorSeparator,
          Group: ReactSelectOverrides.Group,
          GroupHeading: ReactSelectOverrides.GroupHeading,
        }}
        onBlur={() => {
          setInputValue('');
        }}
        minimumLetters={0}
        menuPortalTarget={props.appendToBody ? document.body : null}
        isDisabled={props.isDisabled}
        menuPlacement="auto"
        captureMenuScroll={false}
        useReactSelectInput
      />
    </SelectComponents.Root>
  );
};

export default FavoriteAsyncSelect;
