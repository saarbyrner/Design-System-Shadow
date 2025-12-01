// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  variationContainer: css`
    display: grid;
    grid-template-columns: 1fr 16px;
  `,
  variationDisplay: css`
    display: grid;
    grid-auto-flow: column;
    grid-gap: 4px;
    padding-bottom: 2px;

    .InputNumeric__descriptor {
      background: ${colors.neutral_300};
      padding: 0px 5px 0px 5px;
      border-radius: 0px;
    }
    .InputNumeric__descriptor--right {
      border-left: 0px;
      font-size: 12px;
      line-height: 22px;
      margin: 0px;
    }
  `,
  setVariationDisplay: css`
    .InputNumeric__descriptor {
      border-radius: 0px 3px 3px 0px;
    }
  `,
  variationItemDisplay: css`
    display: flex;

    .textButton--kitmanDesignSystem--extraSmall {
      display: none;
      margin-left: 1px;
      padding: 2px 6px;
    }
    .InputNumeric {
      width: 100%;
    }
    .InputNumeric__inputContainer {
      display: grid;
      grid-template-columns: 1fr minmax(22px, 50px);
      border-radius: 0px;
    }
    .InputNumeric__input {
      height: 24px;
      padding: 1px 1px 0px 1px;
      min-width: 24px;
      line-height: 10px;
    }
    .kitmanReactSelect__control {
      min-height: 24px;
      width: 16px;
      border-radius: 0px 3px 3px 0px;
      background: ${colors.neutral_300};
      border-style: none;
    }
  `,
};
