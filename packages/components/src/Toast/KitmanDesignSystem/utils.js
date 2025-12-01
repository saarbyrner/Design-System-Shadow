// @flow
import { colors } from '@kitman/common/src/variables';

export const iconByStatus = {
  SUCCESS: 'icon-tick-active',
  WARNING: 'icon-warning-active',
  ERROR: 'icon-error-active',
  INFO: 'icon-info-active',
  LOADING: 'icon-time-selection',
};

export const colorByStatus = {
  SUCCESS: colors.green_100,
  WARNING: colors.yellow_100,
  ERROR: colors.red_200,
  INFO: colors.grey_200,
  LOADING: colors.grey_200,
};

export const REMOVE_TOAST_DELAY = 5000;
