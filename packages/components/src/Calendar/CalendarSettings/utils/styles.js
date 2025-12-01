// @flow
import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

const inputNumericClass = 'InputNumeric';

// 4rem (header height) + 1.5rem (header margin-bottom) + 4rem (footer height),
// all of which are hardcoded
const remToDeductForSettingsContainerHeight = 11.5;

export const dayHoursError = css({
  '.rc-time-picker-input': {
    border: `1px solid ${colors.red_100}`,
  },
  '.rc-time-picker::after': {
    border: `1px solid ${colors.red_100}`,
    borderLeft: 'none',
  },
});

export default {
  settingsContainer: css({
    height: `calc(100% - ${remToDeductForSettingsContainerHeight}rem)`,
    padding: '1.5rem',
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1rem',
    width: '20.25rem',
    [`.${inputNumericClass}__inputContainer`]: {
      width: '6.625rem',
      [`.${inputNumericClass}__descriptor`]: {
        padding: '0.25rem 0.5rem',
        lineHeight: '1.5rem',
      },
    },
  }),
  actionButtonsContainer: css({
    backgroundColor: colors.white,
    borderTop: `2px solid ${colors.neutral_300}`,
    padding: '24px',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    height: '5rem',
    justifyContent: 'space-between',
    textAlign: 'center',
    '.icon-arrow-right': {
      paddingTop: '3px',
    },
  }),
  dayHoursContainer: css({
    display: 'flex',
    flexDirection: 'row',
    columnGap: '1rem',
  }),
};
