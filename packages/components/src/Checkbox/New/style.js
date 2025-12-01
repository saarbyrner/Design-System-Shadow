// @flow
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const border = {
  borderStyle: `solid`,
  borderWidth: '2px',
};

const checkmarkPositionWhenCheckboxHasBorder = {
  display: 'block',
  marginTop: '-2px',
  marginLeft: '-2px',
};

export const size = '1rem';
const checkmark = {
  position: 'absolute',
  top: '-1px',
  left: '-1px',
  width: `${size}`,
  height: `${size}`,
  borderRadius: '2px',
  cursor: 'pointer',
  fontSize: '1rem',
};
export const uncheckedCheckmark = {
  ...checkmark,
  backgroundColor: `${colors.white}`,
  ...border,
  borderColor: `${colors.neutral_300}`,
};
export const indeterminateCheckmark = {
  ...checkmark,
  color: `${colors.grey_200}`,
  backgroundColor: `${colors.neutral_300}`,
};
export const checkedCheckmark = {
  ...checkmark,
  color: `${colors.white}`,
  backgroundColor: `${colors.grey_200}`,
};
export const disabledCheckmark = {
  ...checkmark,
  color: `${colors.grey_300}80`,
  backgroundColor: `${colors.neutral_200}`,
  cursor: 'not-allowed',
};
// `focused` are the real styles, `focusedCheckmark` exports the testable
// subset only.
export const focusedCheckmark = {
  ...checkmark,
  ...border,
  borderColor: `${colors.blue_100}`,
};
const focused = {
  ...focusedCheckmark,
  ':before': checkmarkPositionWhenCheckboxHasBorder,
};
// `invalid` are the real styles, `invalidCheckmark` exports the testable
// subset only.
export const invalidCheckmark = {
  ...checkmark,
  ...border,
  borderColor: `${colors.red_100}`,
};
const invalid = {
  ...invalidCheckmark,
  ':before': checkmarkPositionWhenCheckboxHasBorder,
};

export const styles: { [string]: SerializedStyles } = {
  wrapper: css`
    position: relative;
    line-height: 0;
  `,
  unchecked: css(uncheckedCheckmark),
  indeterminate: css(indeterminateCheckmark),
  checked: css(checkedCheckmark),
  disabled: css(disabledCheckmark),
  focused: css(focused),
  invalid: css(invalid),
};
