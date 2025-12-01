// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  container: css`
    width: 70%;
    background: ${colors.white};
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.15);
  `,
  header: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 16px 24px;
    border-bottom: 2px solid ${colors.neutral_300};

    h2 {
      margin: 0px;
    }
  `,
  actionsContainer: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    .textButton__text {
      font-size: 12px;
    }
  `,
  line: css`
    width: 1px;
    height: 12px;
    background: ${colors.neutral_300};
  `,
  copyButtonContainer: css`
    display: flex;
    justify-content: flex-end;

    button {
      margin: 16px 0px;
    }
  `,
  checkBoxParent: css`
    padding: 8px 0px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    row-gap: 16px;
  `,
  checkboxContainer: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: calc(100% / 3);
  `,
  validateButtonContainer: css`
    display: flex;
    justify-content: flex-end;

    button {
      margin: 16px;
    }
  `,
  label: css`
    cursor: pointer;
  `,
};
