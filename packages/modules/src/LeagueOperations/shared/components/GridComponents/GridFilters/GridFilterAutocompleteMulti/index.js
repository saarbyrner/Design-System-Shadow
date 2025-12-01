// @flow
import {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Autocomplete, TextField, Tooltip } from '@kitman/playbook/components';
import type {
  GridFilterRef,
  GridFilterComponent,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/consts';
import isEqual from 'lodash/isEqual';

type OptionType = {
  id: number | string,
  name: string,
};

type Value = Array<string> | Array<number>;

type Props = {
  param: string,
  value: Value,
  defaultValue: Value | null,
  onChange: (params: Array<OptionType>) => void,
  useOptionsQuery?: (queryArgs: any) => { data?: Array<any> },
  queryArgs?: any,
  label: string,
  placeholder: string,
  // Need if Query does not return the options in a reusable format.
  transformOptions?: (options: any) => Array<OptionType>,
  //   If options are stored locally.
  optionsOverride?: Array<OptionType>,
  maxWidth?: number,
  disableCloseOnSelect?: boolean,
};

const GridFilterAutocompleteMulti: GridFilterComponent<Props, GridFilterRef> =
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
        disableCloseOnSelect = false,
      }: Props,
      ref
    ) => {
      const { data = [] } = useOptionsQuery(queryArgs);

      const options = useMemo(() => {
        if (optionsOverride) {
          return optionsOverride;
        }
        if (transformOptions) {
          return transformOptions(data);
        }
        return data;
      }, [data, optionsOverride, transformOptions]);

      const getOptionsById = (selectedOptions) => {
        if (Array.isArray(selectedOptions) && selectedOptions.length) {
          return options.filter((opt) => selectedOptions.includes(opt.id));
        }
        return [];
      };

      const [localValue, setLocalValue] = useState(getOptionsById(value));

      useEffect(() => {
        const selected = getOptionsById(value);
        // Only update local state if the selected values are actually different
        if (!isEqual(selected, localValue)) {
          setLocalValue(selected);
        }
      }, [value, options]);

      useImperativeHandle(ref, () => ({
        reset() {
          setLocalValue(getOptionsById(defaultValue));
        },
        setLocalValue(_value) {
          setLocalValue(getOptionsById(_value));
        },
        getResetValue() {
          return defaultValue;
        },
        getParam() {
          return param;
        },
        getMaxWidth() {
          return maxWidth;
        },
        getIsFilterApplied() {
          return Boolean(localValue?.length > 0);
        },
        // Used to determine how the local value is set in GridFiltersContainer
        getIsMulti() {
          return true;
        },
      }));

      return (
        <Autocomplete
          multiple
          fullWidth
          options={options}
          getOptionLabel={(option) => option.name}
          value={localValue}
          isOptionEqualToValue={(option, val) => {
            return option.id === val.id;
          }}
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          renderTags={() => null}
          renderInput={(params) => {
            const valueTooltip = localValue.map((opt) => opt.name).join(', ');
            return (
              <Tooltip title={valueTooltip}>
                <TextField
                  {...params}
                  label={label}
                  placeholder={placeholder}
                  inputProps={{
                    ...params.inputProps,
                    value: valueTooltip,
                    readOnly: true,
                  }}
                />
              </Tooltip>
            );
          }}
          disableCloseOnSelect={disableCloseOnSelect}
        />
      );
    }
  );

export default GridFilterAutocompleteMulti;
