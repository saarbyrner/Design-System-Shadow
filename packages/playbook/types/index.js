// @flow
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';

/**
 * MUI TYPES IMPORTED HERE
 */

export const ChipColors = {
  Default: 'default',
  Primary: 'primary',
  Secondary: 'secondary',
  Error: 'error',
  Info: 'info',
  Success: 'success',
  Warning: 'warning',
};
export type ChipColor = $Values<typeof ChipColors | string>;

export type Option = {
  id: number | string,
  label: string,
  type?: string,
  group?: string,
  file?: Attachment,
};
