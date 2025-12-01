// @flow
import { useState } from 'react';
import { TextField, Autocomplete, Box } from '@kitman/playbook/components';

type RequestStatus = {
  isFetching: boolean,
  isLoading: boolean,
  isError: boolean,
};
type QueryHookResult<T> = {
  data: $ReadOnlyArray<T>,
  isLoading: boolean,
};

type Props<T, V> = {
  // Core Configuration
  label: string,
  useQueryHook: (args?: any) => QueryHookResult<T>,
  queryHookArgs?: any,
  getOptionLabel: (option: T) => string,
  getOptionValue: (option: T) => V,

  isMultiselect?: boolean,

  // External State & Callbacks
  searchQuery: (value: V | Array<V> | null) => void,
  requestStatus: RequestStatus,

  // Behavior Customization
  wrapQueryValueInArray?: boolean,

  sx?: Object,

  autocompleteProps?: Object,
};

// A generic, reusable Autocomplete component.
const SearchableSelect = <T, V>({
  label,
  useQueryHook,
  queryHookArgs,
  getOptionLabel,
  getOptionValue,
  searchQuery,
  requestStatus,
  wrapQueryValueInArray = false,
  autocompleteProps,
  isMultiselect,
  sx,
}: Props<T, V>) => {
  // Generic Data Fetching: Uses the hook passed via props.
  const { data: options = [], isLoading } = useQueryHook(queryHookArgs);

  // Generic State Management: Stores the primitive value (e.g., ID or string name).
  const [selectedValue, setSelectedValue] = useState<V | Array<V> | null>(null);

  // 'isDisabled' Logic.
  const isDisabled =
    isLoading ||
    requestStatus.isFetching ||
    requestStatus.isLoading ||
    requestStatus.isError;

  // 'handleChange' Logic
  const handleChange = (newValue) => {
    // 'newValue' is the full option object from Autocomplete
    if (!newValue) {
      setSelectedValue(null);
      searchQuery(wrapQueryValueInArray ? [] : null);
      return;
    }

    const valueToStore = getOptionValue(newValue);
    setSelectedValue(valueToStore);
    // Corrected logic to handle both cases
    searchQuery(wrapQueryValueInArray ? [valueToStore] : valueToStore);
  };

  const handleMultiselectChange = (newValue) => {
    if (newValue?.length) {
      const valueToStore = newValue.map(getOptionValue);
      setSelectedValue(valueToStore);
      searchQuery(valueToStore);
      return;
    }

    setSelectedValue([]);
    searchQuery([]);
  };

  const getValue = () => {
    if (!isMultiselect) {
      return (
        options.find(
          (opt) =>
            selectedValue !== null && getOptionValue(opt) === selectedValue
        ) || null
      );
    }

    if (Array.isArray(selectedValue)) {
      return (
        options.filter((option) =>
          selectedValue?.includes(getOptionValue(option))
        ) ?? []
      );
    }

    return [];
  };

  return (
    <Autocomplete
      disablePortal
      size="small"
      multiple={isMultiselect}
      options={options}
      value={getValue()}
      disabled={isDisabled}
      getOptionLabel={getOptionLabel}
      renderTags={(selectedOptions) => {
        return (
          <Box
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {selectedOptions.map(getOptionLabel).join(', ')}
          </Box>
        );
      }}
      onChange={(event, newValue) => {
        if (isMultiselect) {
          return handleMultiselectChange(newValue);
        }
        return handleChange(newValue);
      }}
      isOptionEqualToValue={(option, value) =>
        getOptionValue(option) === getOptionValue(value)
      }
      renderInput={(params) => <TextField {...params} label={label} />}
      sx={{
        m: 1,
        minWidth: 180,
        // Adjustments needed to properly apply ellipsis to multiple values
        '& .MuiAutocomplete-inputRoot': {
          display: 'flex',
          flexWrap: 'nowrap',
          '& .MuiAutocomplete-input': {
            minWidth: 0,
          },
        },
        ...(sx ?? {}),
      }}
      {...autocompleteProps}
    />
  );
};

export default SearchableSelect;
