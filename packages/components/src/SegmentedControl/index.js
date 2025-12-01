// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { ValidationText } from '@kitman/components';

// Types
import type { SerializedStyles } from '@emotion/react';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

export type ButtonItem = {
  name: string,
  isDisabled?: boolean,
  value: string | number,
  isSeparated?: boolean,
  color?: string,
};

export type Props = {
  buttons: Array<ButtonItem>,
  isDisabled?: boolean,
  isSeparated?: boolean,
  invalid?: boolean,
  label?: string,
  width?: 'full' | 'inline',
  styles: {
    label?: SerializedStyles | ObjectStyle,
    group?: SerializedStyles | ObjectStyle,
    button?: SerializedStyles | ObjectStyle,
  },
  minWidth?: number,
  maxWidth?: number,
  onClickButton: Function,
  selectedButton?: ?(string | number),
  color?: string,
  displayValidationText?: boolean,
  customValidationText?: string,
};

const style = {
  label: {
    color: `${colors.grey_100}`,
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
    marginBottom: '4px',
  },
};

const groupStyle = (isSeparated, minWidth, maxWidth, isInvalid, width) => css`
  align-items: center;
  background: ${colors.neutral_200};
  height: 32px;
  border-radius: 8px;
  ${isSeparated &&
  `
    background: transparent;

    `};
  ${width === 'inline' && `display: inline-flex;`}
  ${width === 'full' &&
  `
      display: flex;
      width: 100%;
    `}
   ${minWidth ? `min-width: ${minWidth}px;` : null};
  ${maxWidth ? `max-width: ${maxWidth}px;` : null};

  ${isInvalid &&
  !isSeparated &&
  `
      border-color: ${colors.red_100};
      border-radius: 3px;
      border-style: solid;
      border-width: 1px;
      box-shadow: 0 0 0 1px ${colors.red_100};
    `}
`;

const buttonStyle = (
  isSeparated,
  isDisabled,
  isSelected,
  width,
  invalid,
  color,
  backgroundColor
) => css`
  background-color: ${colors.neutral_200};
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
  line-height: 24px;
  color: ${colors.grey_200};
  display: flex;
  align-items: center;
  justify-content: center;

  ${isSeparated &&
  `
      height: 32px;
      margin: 4px;
      position: relative;
      right: 4px;
    `};

  ${width === 'inline' &&
  `
      padding: 0 15px;
    `}

  ${width === 'full' &&
  `
      flex: 1;
    `}

  ${isSelected &&
  backgroundColor &&
  `
      background-color: ${backgroundColor};
      color: ${color || colors.white};

    `};

  ${isSelected &&
  !backgroundColor &&
  `
      background-color: ${colors.blue_200};
      color: ${color || colors.white};

    `};

  ${isDisabled &&
  `
      background-color: ${colors.neutral_200};
      color: ${colors.grey_100_50}
    `};

  ${isDisabled &&
  isSelected &&
  `
      background-color: ${colors.grey_300_50};
      color: ${color || colors.white}
    `};

  ${isSeparated &&
  invalid &&
  `
      border: 2px solid ${colors.red_100}
    `};

  ${!isSelected &&
  !isDisabled &&
  `
      &:hover {
        background-color: ${colors.neutral_300};
        color: ${colors.grey_300};
      }

      &:active {
        background-color: ${colors.blue_100_10};
        color: ${color || colors.blue_100};
      }
    `}
`;

const SegmentedControl = (props: Props) => {
  return (
    <div className="segmentedControl">
      {props.label && (
        <span
          data-testid="SegmentedControl|Label"
          css={[style.label, props.styles.label]}
        >
          {props.label}
        </span>
      )}
      <div
        data-testid="SegmentedControl|Group"
        css={[
          groupStyle(
            props.isSeparated,
            props.minWidth,
            props.maxWidth,
            props.invalid,
            props.width
          ),
          props.styles.group,
        ]}
      >
        {props.buttons.map((button) => {
          const isSelected = props.selectedButton === button.value;
          return (
            <button
              data-testid="SegmentedControl|Button"
              css={[
                buttonStyle(
                  button.isSeparated || props.isSeparated,
                  button.isDisabled || props.isDisabled,
                  isSelected,
                  props.width,
                  props.invalid,
                  button.color,
                  props.color
                ),
                props.styles.button,
              ]}
              disabled={button.isDisabled || props.isDisabled}
              key={button.value}
              type="button"
              onClick={() => props.onClickButton(button.value)}
            >
              {button.name}
            </button>
          );
        })}
      </div>
      {props.displayValidationText && props.invalid && (
        <ValidationText customValidationText={props.customValidationText} />
      )}
    </div>
  );
};

SegmentedControl.defaultProps = {
  width: 'full',
  styles: {
    label: css``,
    group: css``,
    button: css``,
  },
};

export default SegmentedControl;
