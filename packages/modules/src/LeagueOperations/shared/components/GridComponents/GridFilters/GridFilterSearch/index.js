// @flow
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { SxProps, Theme } from '@mui/material/styles';
import type {
  GridFilterRef,
  GridFilterComponent,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/consts';

type Props = {
  label: string,
  value: string,
  sx?: SxProps<Theme>,
  onChange: (value: string) => void,
  param: string,
  showSearchIcon?: boolean,
  inputType?: 'number' | 'text',
  disabled?: boolean,
  maxWidth?: number,
};

const GridFilterSearch: GridFilterComponent<Props, GridFilterRef> = forwardRef(
  (
    {
      label,
      sx,
      value,
      onChange,
      showSearchIcon = false,
      inputType = 'text',
      disabled = false,
      param,
      maxWidth = 300,
    }: Props,
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value);
    const onSearchDebounced = useDebouncedCallback(onChange, 400);

    useEffect(() => {
      // keep the local value in sync with the value prop
      setLocalValue(value);
    }, [value]);

    useEffect(() => {
      onSearchDebounced(localValue);
    }, [localValue, onSearchDebounced]);

    useImperativeHandle(ref, () => ({
      // Expose a `reset` method to parent components via ref.
      // When `reset()` is called, it resets the local value of the component.
      reset() {
        setLocalValue('');
      },
      getResetValue() {
        return '';
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
      <TextField
        value={localValue}
        label={label}
        variant="filled"
        size="small"
        sx={{
          flex: 1,
          maxWidth,
          ...sx,
        }}
        type={inputType}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        InputProps={{
          endAdornment: showSearchIcon && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  if (localValue) {
                    setLocalValue('');
                  }
                }}
                sx={{
                  cursor: localValue ? 'pointer' : 'default !important',
                }}
              >
                <KitmanIcon
                  name={
                    localValue
                      ? KITMAN_ICON_NAMES.Close
                      : KITMAN_ICON_NAMES.Search
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled={disabled}
      />
    );
  }
);

export default GridFilterSearch;
