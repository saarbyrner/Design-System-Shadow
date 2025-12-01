// @flow
import type { SelectChangeEvent } from '@mui/material';

type OptionValue = number | string;
type Option = {
  label: string,
  value: OptionValue,
};

export type SelectWrapperProps = {
  // required props
  label: string,
  // an array is needed when the prop isMulti is passed in
  value: OptionValue | Array<OptionValue>,
  options: Array<Option>,
  onChange: (event: SelectChangeEvent<any>, child: ?React$Node) => void,

  // props with defaults
  minWidth?: number,
  fullWidth?: boolean,
  isMulti?: boolean,
  invalid?: boolean,
  isClearable?: boolean,
  onClear?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
};
