// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { Props } from './index';

const style = ({
  // eslint-disable-next-line no-unused-vars
  inputName,
  option,
  // eslint-disable-next-line no-unused-vars
  change,
  value,
  disabled,
  // eslint-disable-next-line no-unused-vars
  index,
  buttonSide,
  kitmanDesignSystem,
}: Props) => {
  const isChecked = value === option.value || false;

  // Kitman design system colors
  const dotColor = disabled && isChecked ? colors.grey_100_50 : colors.white;

  let buttonBgColor = isChecked ? colors.blue_100 : colors.white;
  if (disabled) {
    buttonBgColor = colors.neutral_200;
  }

  let buttonBgHoverColor = isChecked ? colors.blue_200 : colors.neutral_200;
  if (disabled) {
    buttonBgHoverColor = isChecked ? colors.neutral_200 : colors.neutral_200;
  }

  let buttonBgBorderColor = colors.neutral_300;
  if (disabled) {
    buttonBgBorderColor = isChecked ? colors.neutral_200 : colors.neutral_200;
  }

  let buttonBgBorderHoverColor = colors.neutral_400;
  if (disabled) {
    buttonBgBorderHoverColor = isChecked
      ? colors.neutral_200
      : colors.neutral_200;
  }

  const focusedContent = !disabled
    ? `:focus-within .inputRadio__button::after {
      height: 18px;
      max-height: 18px;
      border: 6px solid ${colors.blue_50};
      border-radius: 50%;
      clear: none;
      content: '';
      display: inline-block;
      filter: drop-shadow(0px 0px 3px ${colors.blue_100_60});
      left: -1px;
      position: relative;
      top: -7px;
      width: 18px;
      z-index: -1;
    }`
    : ``;

  return {
    inputRadio: kitmanDesignSystem
      ? css`
          line-height: 20px;
          :hover .inputRadio__button {
            background-color: ${buttonBgHoverColor};
            border: ${isChecked && !disabled
              ? 'none'
              : `2px solid ${buttonBgBorderHoverColor}`};
          }
          ${focusedContent}
        `
      : css``,

    button: kitmanDesignSystem
      ? css`
          background-color: ${buttonBgColor};
          border: ${isChecked && !disabled
            ? 'none'
            : `2px solid ${buttonBgBorderColor}`};
          border-radius: 50%;
          cursor: ${disabled ? 'default' : 'pointer'};
          display: inline-block;
          height: 16px;
          line-height: 0;
          padding: 0;
          vertical-align: middle;
          width: 16px;
          float: ${buttonSide === 'right' ? 'right' : 'initial'};
          margin-top: ${buttonSide === 'right' ? '3px' : '-1px'};
          margin-right: ${buttonSide === 'right' ? '0' : '8px'};
          margin-bottom: 0;
          margin-left: ${buttonSide === 'right' ? '8px' : '0'};
          transition: background-color 0.3s ease;

          @media print {
            -webkit-print-color-adjust: exact;
          }
        `
      : css`
          background-color: ${colors.p06};
          border: 1px solid ${colors.p04};
          border-radius: 50%;
          cursor: ${disabled ? 'default' : 'pointer'};
          display: inline-block;
          height: 20px;
          line-height: 0;
          padding: 2px;
          vertical-align: middle;
          width: 20px;
          float: ${buttonSide === 'right' ? 'right' : 'initial'};
          margin-top: ${buttonSide === 'right' ? '0' : '-1px'};
          margin-right: ${buttonSide === 'right' ? '0' : '4px'};
          margin-bottom: 0;
          margin-left: ${buttonSide === 'right' ? '4px' : '0'};
        `,
    label: kitmanDesignSystem
      ? css`
          color: ${disabled ? colors.grey_300_50 : colors.grey_100};
          cursor: ${disabled ? 'default' : 'pointer'};
          margin: 8px 0px;
          width: 100%;
          display: inline-block;
        `
      : css`
          color: ${colors.s18};
          cursor: ${disabled ? 'default' : 'pointer'};
          opacity: ${disabled ? '0.5' : '1.0'};
          margin: 10px 0;
          width: 100%;
        `,
    active: kitmanDesignSystem
      ? css`
          background-color: ${dotColor};
          border-radius: 50%;
          bottom: 0;
          clear: none;
          display: ${isChecked ? 'inline-block' : 'none'};
          height: ${isChecked ? '6px' : '11.43px'};
          position: relative;
          top: 0;
          width: ${isChecked ? '6px' : '11.43px'};
          transform: ${disabled
            ? 'translate(3px, 3px)'
            : 'translate(5px, 5px)'};
          @media print {
            -webkit-print-color-adjust: exact;
          }
        `
      : css`
          background-color: ${disabled ? colors.p04 : colors.p01};
          border-radius: 50%;
          display: ${isChecked || false ? 'inline-block' : 'none'};
          height: 12px;
          margin-left: 1px;
          margin-top: 1px;
          width: 12px;
        `,
    input: kitmanDesignSystem
      ? css`
          opacity: 0;
          width: 0;
          height: 0;
        `
      : css`
          display: none;
        `,
  };
};

export default style;
