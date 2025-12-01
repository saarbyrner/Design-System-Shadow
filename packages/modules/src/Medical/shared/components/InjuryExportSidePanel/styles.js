// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  sidePanel: css`
    .slidingPanel {
      display: flex;
      flex-direction: column;
    }

    .slidingPanel__heading {
      min-height: 80px;
      max-height: 80px;
    }

    .slidingPanel__heading {
      margin-bottom: 0;
    }
  `,
  content: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 24px;
    overflow: auto;

    h6 {
      color: ${colors.grey_200};
    }

    .toggleSwitch {
      margin-bottom: 8px;

      &__label {
        margin-left: 0;
        margin-right: 8px;
      }

      &__input {
        &:checked + .toggleSwitch__slider {
          background-color: ${colors.grey_200};
          border: solid 1px ${colors.grey_200};
        }
      }
    }
  `,
  filtersHeader: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
  `,
  injuryIllnessSelector: css`
    margin-bottom: 16px;
  `,
  alertBox: css`
    display: flex;
    justify-content: space-evenly;
    background: ${colors.neutral_300};
    padding: 10px 0;
    margin-bottom: 10px;

    .icon-info {
      font-size: 16px;
    }
    span {
      max-width: 366px;
    }
  `,
  dateRangeSelector: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 8px;
    margin-bottom: 16px;
    grid-row: 6;
  `,
  nestedSection: css`
    border: 1px solid ${colors.neutral_400};
    border-left-width: 4px;
    border-right: 0;
    padding: 8px 0 12px 16px;
    margin-bottom: 10px;
  `,
  actions: css`
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.neutral_300};
    display: flex;
    height: 80px;
    justify-content: end;
    padding: 24px;
    text-align: center;
    width: 100%;
    z-index: 1000;
  `,
};
