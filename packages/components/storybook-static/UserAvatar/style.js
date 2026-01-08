// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  userInitials: css`
    color: ${colors.blue_300};
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  `,
};

export default style;
