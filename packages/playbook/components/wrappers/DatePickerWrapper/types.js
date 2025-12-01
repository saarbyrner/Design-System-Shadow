// @flow

import type { slotProps } from '@mui/base';

export type DatePickerProps = {
  // Wrapper props
  isInvalid?: boolean,
  inputLabel?: string,
  placeholder?: string,
  disabled?: boolean,
  open?: boolean,
  onOpen?: Function,
  onClose?: Function,

  // Commonly used MUI DatePicker props -
  shouldDisableDate?: (date: Date) => boolean, // Function that when it returns true the date its iterating over will be disabled - example structre in tests for single date and range of dates
  slotProps?: slotProps,
};

// More available props can be found on the docs: https://mui.com/x/react-date-pickers
