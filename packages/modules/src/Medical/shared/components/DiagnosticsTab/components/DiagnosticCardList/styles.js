// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const getStyles = () => ({
  content: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
  `,
  diagnosticStatus: css`
    height: 16px;
    width: 84px;
    display: flex;
    background-color: ${colors.red_100};
    border-radius: 10px;
    align-items: center;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${colors.neutral_200};
    padding: 10px 5px;
    span {
      width: 100%;
    }
  `,
  diagnosticCheckboxContainer: css`
    position: relative;
    label {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 50%;
      cursor: pointer;
      height: 28px;
      left: 25%;
      position: absolute;
      top: 0;
      width: 28px;
    }
    label:after {
      border: 2px solid #fff;
      border-top: none;
      border-right: none;
      content: '';
      height: 6px;
      left: 7px;
      opacity: 0;
      position: absolute;
      top: 8px;
      transform: rotate(-45deg);
      width: 12px;
    }
    input[type='checkbox'] {
      visibility: hidden;
    }
    input[type='checkbox']:checked + label {
      background-color: #66bb6a;
      border-color: #66bb6a;
    }
    input[type='checkbox']:checked + label:after {
      opacity: 1;
    }
    button {
      border: none;
      background: transparent;
      display: block;
      margin: 0 auto;
    }
  `,
  athleteDetails: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,
  attachmentsContainer: css`
    display: flex;
    div {
      display: inline-block;
    }
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 45px;
    width: 45px;
  `,
  athleteInfo: css`
    flex-direction: column;
    text-align: start;
  `,
  athleteName: css`
    font-size: 13px;
    font-weight: bold;
    margin: 0px 0px 4px;
  `,
  athletePosition: css`
    color: ${colors.grey_100};
    font-size: 12px;
    margin: 0;
  `,
  actions: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,
  diagnosticTable: css`
    padding: 24px;
    .dataTable {
      overflow: auto;
    }
    .dataTable__thead {
      background: white;
      border-top: 1px solid ${colors.neutral_300};
    }
    .dataTable__th,
    .dataTable__td {
      background: ${colors.white};
      box-shadow: 4px 0px 3px ${colors.neutral_300};
      padding-left: 0;
      padding-right: 20px;
    }
    .actionTooltip,
    .actionTooltip__trigger {
      width: 100%;
    }
  `,
  checkbox: css`
    min-width: 28px;
    margin-left: 5px;
  `,
});

export default getStyles;
