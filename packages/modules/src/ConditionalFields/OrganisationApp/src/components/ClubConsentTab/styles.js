// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  consentActions: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${colors.neutral_100};
    padding: 12px;
  `,
  countText: css`
    font-weight: 600;
  `,
};

export default styles;
