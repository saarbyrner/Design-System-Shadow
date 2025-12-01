// @flow

/**
 * ? DEFAULT ARE YET TO BE DEFINED
 * ? They have been taken from a current implementation until they are provided.
 */

export type VariantTypes = 'filled' | 'outlined' | 'standard';
export type FormControlSizes = 'small' | 'medium';
export type ColorOptions =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

export type MarginOptions = 'dense' | 'none' | 'normal';
export type DateFormatDensity = 'dense' | 'spacious';
export type DateOpenTo = 'day' | 'month' | 'year';
export type Orientation = 'landscape' | 'portrait';

type DefaultPropsType = {
  variant: VariantTypes,
  size: FormControlSizes,
  color: ColorOptions,
  margin: MarginOptions,
  margin: MarginOptions,
  dateFormatDensity: DateFormatDensity,
  dateOpenTo: DateOpenTo,
  orientation: Orientation,
};

export const defaultProps: DefaultPropsType = {
  variant: 'standard',
  size: 'small',
  color: 'primary',
  margin: 'none',
  dateFormatDensity: 'dense',
  dateOpenTo: 'day',
  orientation: 'landscape',
};
