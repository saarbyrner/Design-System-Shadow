// @flow
import { createRef, Component } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import RcTimePicker from 'rc-time-picker';
import moment from 'moment-timezone';

import { ValidationText } from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';

export type Props = {
  value: ?typeof moment,
  label?: string,
  onChange: Function,
  disabled?: boolean,
  minuteStep?: number,
  name?: string,
  defaultOpenValue?: ?typeof moment,
  kitmanDesignSystem?: boolean,
  invalid?: boolean,
  displayValidationText?: boolean,
  customValidationText?: string,
};

class TimePicker extends Component<I18nProps<Props>> {
  timePicker: Object;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.timePicker = createRef();
  }

  render() {
    let pickerWidth = null;
    if (this.timePicker.current && this.timePicker.current.picker) {
      pickerWidth = `${
        this.timePicker.current.picker.getBoundingClientRect().width
      }px`;
    }

    return (
      <div
        className={classnames('timePicker', {
          timePicker__kitmanDesignSystem: this.props.kitmanDesignSystem,
          'timePicker__kitmanDesignSystem--disabled':
            this.props.kitmanDesignSystem && this.props.disabled,
          'timePicker--disabled': this.props.disabled,
          'timePicker--invalid': this.props.invalid,
        })}
      >
        <label className="timePicker__label">
          {this.props.label || this.props.t('Time')}
        </label>
        <RcTimePicker
          showSecond={false}
          use12Hours
          focusOnOpen
          popupStyle={{ width: pickerWidth }}
          defaultOpenValue={
            this.props.defaultOpenValue
              ? this.props.defaultOpenValue
              : undefined
          }
          value={this.props.value}
          onChange={this.props.onChange}
          ref={this.timePicker}
          // If getPopupContainer is not set,
          // the timepicker stay at a fix position when scrolling
          getPopupContainer={(node) => node}
          disabled={this.props.disabled}
          minuteStep={
            window.featureFlags['update-time-picker']
              ? this.props.minuteStep || 5
              : this.props.minuteStep
          }
          name={this.props.name}
          invalid={this.props.invalid}
        />
        {this.props.displayValidationText && this.props.invalid && (
          <ValidationText
            customValidationText={this.props.customValidationText}
          />
        )}
      </div>
    );
  }
}

export const TimePickerTranslated = withNamespaces()(TimePicker);
export default TimePicker;
