// @flow
import { useState, forwardRef, cloneElement, type Node } from 'react';
import type { Option } from '@kitman/playbook/types';
import { Virtuoso } from 'react-virtuoso';
import {
  CircularProgress,
  TextField,
  Checkbox,
} from '@kitman/playbook/components';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';

export const renderInput = ({
  params,
  label,
  placeholder = undefined,
  loading = false,
  error = false,
  helperText = undefined,
  FormHelperTextProps = {},
}: {
  params: Object,
  label: string,
  placeholder?: string,
  loading?: boolean,
  error?: boolean,
  helperText?: string | Node | Function,
  FormHelperTextProps?: Object,
}) => (
  <TextField
    {...params}
    label={label}
    placeholder={placeholder}
    margin="none"
    size="small"
    InputProps={{
      ...params.InputProps,
      endAdornment: (
        <>
          {loading && (
            <CircularProgress
              color="inherit"
              size={18}
              sx={{ alignSelf: 'start' }}
            />
          )}
          {params.InputProps.endAdornment}
        </>
      ),
    }}
    error={error}
    helperText={helperText}
    FormHelperTextProps={FormHelperTextProps}
  />
);

export const renderCheckboxes = (
  props: Object,
  option: Option,
  state: Object
) => (
  <li
    {...props}
    key={option.id}
    css={{
      fontSize: convertPixelsToREM(14),
      padding: `${convertPixelsToREM(2)} 0`,
      paddingLeft: '4px !important',
    }}
  >
    <Checkbox checked={state.selected} size="small" sx={{ p: 1 }} />
    {option.label}
  </li>
);

// MUI Autocomplete virtualization with react-virtuoso: https://stackoverflow.com/a/71492696
// $FlowIgnore[missing-annot]
export const VirtualizedListboxComponent = forwardRef((props, ref) => {
  const { children, ...otherProps } = props;

  const [containerHeight, setContainerHeight] = useState<string>(
    convertPixelsToREM(400)
  );

  return (
    <ul
      ref={ref}
      style={{ height: containerHeight, maxHeight: convertPixelsToREM(300) }}
      {...otherProps}
    >
      <Virtuoso
        data={children}
        itemContent={(index, child) => {
          return cloneElement(child, { index });
        }}
        totalListHeightChanged={(height: number) =>
          // account for padding of the options
          setContainerHeight(convertPixelsToREM(height + 16))
        }
      />
    </ul>
  );
});
