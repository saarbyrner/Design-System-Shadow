// @flow
import {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Autocomplete, TextField } from '@kitman/playbook/components';
import type {
  GridFilterRef,
  GridFilterComponent,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/consts';

type OptionType = {
  id: string | number,
  name: string,
  [key: string]: any,
};

type Props = {
  param: string,
  defaultValue: OptionType | null,
  value: ?string | number,
  onChange: (params: OptionType | null) => void,
  useOptionsQuery?: (queryArgs: any) => {
    data?: Array<any>,
    isLoading?: boolean,
    isError?: boolean,
    isFetching?: boolean,
    isSuccess?: boolean,
  },
  queryArgs?: any,
  label: string,
  placeholder: string,
  // Need if Query does not return the options in a reusable format.
  transformOptions?: (
    options: any
  ) => Array<{ id: string | number, name: string }>,
  //   If options are stored locally.
  optionsOverride?: Array<OptionType>,
  maxWidth?: number,
  disabled?: boolean,
};

const GridFilterAutocomplete: GridFilterComponent<Props, GridFilterRef> =
  forwardRef(
    (
      {
        param,
        value,
        onChange,
        defaultValue = null,
        useOptionsQuery = () => ({ data: [] }),
        queryArgs = {},
        label,
        placeholder,
        transformOptions = undefined,
        optionsOverride = undefined,
        maxWidth,
        disabled = false,
      }: Props,
      ref
    ) => {
      const {
        data = [],
        isLoading = false,
        isError = false,
      } = useOptionsQuery(queryArgs);

      const options = useMemo(() => {
        if (optionsOverride) {
          return optionsOverride;
        }
        if (transformOptions) {
          return transformOptions(data);
        }
        return data;
      }, [data, optionsOverride, transformOptions]);

      const getOptionById = (optionId) =>
        options.find((opt) => opt.id === optionId) || null;

      const [localValue, setLocalValue] = useState<OptionType | null>(
        getOptionById(value)
      );

      // Update localValue when options arrive and value is passed from parent
      useEffect(() => {
        if (value !== '' && options.length > 0) {
          const matched = getOptionById(value);
          if (matched && matched.id !== localValue?.id) {
            setLocalValue(matched);
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [value, options]);

      useImperativeHandle(ref, () => ({
        // Expose a `reset` method to parent components via ref.
        // When `reset()` is called, it resets the local value of the component.
        reset() {
          setLocalValue(null);
        },
        getResetValue() {
          return defaultValue;
        },
        getParam() {
          return param;
        },
        // Used to set the maxWidth of the parent container
        getMaxWidth() {
          return maxWidth;
        },
        // If true adds to the activeFilterCount
        getIsFilterApplied() {
          return Boolean(localValue);
        },
      }));

      return (
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={(option) => option.name}
          value={localValue}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          onChange={(event, newValue) => {
            setLocalValue(newValue);
            if (newValue) {
              onChange(newValue);
            } else {
              onChange(defaultValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
            />
          )}
          disabled={disabled || isLoading || isError}
        />
      );
    }
  );

export default GridFilterAutocomplete;
