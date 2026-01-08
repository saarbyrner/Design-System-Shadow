// @flow
/* eslint-disable no-useless-constructor */
import { Component } from 'react';
import classNames from 'classnames';
import NewCheckbox from './New';

export type CheckboxItem = {
  id: string,
  checked: boolean,
  additionalData?: any,
  firstname?: string,
  lastname?: string,
  squad?: string,
};

type Props = {
  id: string,
  isChecked: boolean,
  toggle?: (CheckboxItem) => void,
  label?: string,
  secondaryLabel?: string,
  isDisabled?: boolean,
  name?: string,
  isLabelPositionedOnTheLeft?: boolean,
  radioStyle?: boolean,
  kitmanDesignSystem?: boolean,
  tabIndex?: string,
  additionalData?: any,
};

// TODO: replace Checkbox with NewCheckbox when there are no usages of the
// former.
//
// @deprecated Use NewCheckbox instead.
export default class Checkbox extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Object) {
    return (
      nextProps.isChecked !== this.props.isChecked ||
      nextProps.isDisabled !== this.props.isDisabled ||
      nextProps.isLabelPositionedOnTheLeft !==
        this.props.isLabelPositionedOnTheLeft ||
      nextProps.radioStyle !== this.props.radioStyle ||
      nextProps.label !== this.props.label
    );
  }

  toggle() {
    if (this.props.isDisabled) {
      return;
    }

    const checkboxNewStatus = {
      id: this.props.id,
      checked: !this.props.isChecked,
      ...(this.props.additionalData && {
        additionalData: this.props.additionalData,
      }),
    };

    if (this.props.toggle) {
      this.props.toggle(checkboxNewStatus);
    }
  }

  // To avoid name clashing, NewCheckbox is a sub-component of Checkbox and can
  // be used as <Checkbox.New />. NewCheckbox must eventually replace all
  // usages of Checkbox.
  static New = NewCheckbox;

  render() {
    return (
      <div
        className={classNames('reactCheckbox', {
          'reactCheckbox--checked': this.props.isChecked,
          'reactCheckbox--disabled': this.props.isDisabled,
          'reactCheckbox--leftPositionLabel':
            this.props.isLabelPositionedOnTheLeft,
          'reactCheckbox--radioStyle': this.props.radioStyle,
          'reactCheckbox--kitmanDesignSystem': this.props.kitmanDesignSystem,
        })}
        onClick={() => this.toggle()}
        name={this.props.name || 'reactCheckbox'}
      >
        <div
          aria-labelledby={`${this.props.id}_label`}
          aria-checked={this.props.isChecked}
          aria-disabled={this.props.isDisabled}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.toggle();
            }
          }}
          tabIndex={this.props.tabIndex || 0}
          role="checkbox"
          className="reactCheckbox__checkbox"
        />
        {this.props.label && (
          <span id={`${this.props.id}_label`} className="reactCheckbox__label">
            {this.props.label}
            {this.props.secondaryLabel && (
              <span className="reactCheckbox__secondaryLabel">
                &nbsp;
                {this.props.secondaryLabel}
              </span>
            )}
          </span>
        )}
      </div>
    );
  }
}
