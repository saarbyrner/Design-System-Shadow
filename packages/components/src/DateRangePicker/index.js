// @flow
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import moment from 'moment-timezone';
import { css } from '@emotion/react';
import _isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import BootstrapDateRangePicker, {
  getDateRangeText,
} from '@kitman/common/src/utils/dateRangePicker';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import { TextButton } from '@kitman/components';
import type { DateRange } from '@kitman/common/src/types';
import { colors } from '@kitman/common/src/variables';

type Props = {
  value: DateRange | null,
  turnaroundList: Array<Turnaround>,
  onChange: Function,
  disabled?: boolean,
  placeholder?: string,
  ignoreValidation?: boolean,
  invalid?: boolean,
  position?: 'left' | 'center' | 'right',
  maxDate?: Object,
  allowFutureDate?: boolean,
  // Will cause datepicker to Ignore any data-limit-ts-start value
  allowAllPastDates?: boolean,
  isClearable?: boolean,
  kitmanDesignSystem?: boolean,
};

class DateRangePicker extends Component<Props> {
  dateRangePicker: Object;

  dateRangeEl: ?HTMLDivElement;

  orgTimeZone: ?string;

  constructor(props: Props) {
    super(props);
    // temporary set of org timezone, will be removed under #8434
    this.orgTimeZone =
      document.getElementsByTagName('body')[0].dataset.timezone || 'UTC';
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.value && !_isEqual(this.props.value, prevProps.value)) {
      this.updateDateRangePicker(
        this.props.value.start_date,
        this.props.value.end_date
      );
    } else if (!this.props.value) {
      this.updateDateRangePicker(moment(), moment());
    }
  }

  componentDidMount() {
    let datePickerOptions = {};

    if (this.props.allowAllPastDates) {
      // moment timestamp of Jan 1st 1970 which would be the limit of how far to go back
      datePickerOptions = { ...datePickerOptions, minDate: moment(1432252800) };
    }

    if (!this.props.allowFutureDate) {
      datePickerOptions = {
        ...datePickerOptions,
        maxDate:
          this.props.maxDate ||
          moment()
            // $FlowFixMe: third party library
            .tz(this.orgTimeZone)
            .endOf('day'),
      };
    }

    this.dateRangePicker = new BootstrapDateRangePicker(
      this.dateRangeEl,
      this.props.turnaroundList,
      this.onChange,
      this.props.position || 'left',
      datePickerOptions
    );

    if (this.dateRangePicker.daterangeElement && this.props.value) {
      this.updateDateRangePicker(
        this.props.value.start_date,
        this.props.value.end_date
      );
    } else if (this.dateRangePicker.daterangeElement) {
      this.updateDateRangePicker(moment(), moment());
    }

    if (this.dateRangePicker.daterangeElement && this.props.disabled) {
      this.dateRangePicker.disable();
    }
  }

  updateDateRangePicker(startDate: string, endDate: string) {
    this.dateRangePicker.setStartDate(
      // $FlowFixMe: third party library
      moment(startDate).format('DD MMM YYYY')
    );
    this.dateRangePicker.setEndDate(moment(endDate).format('DD MMM YYYY'));
  }

  onChange = (newValue: { start: string, end: string, text: string }) => {
    this.props.onChange({
      start_date: newValue.start,
      end_date: newValue.end,
    });
  };

  getDateRangeText() {
    if (
      this.props.value &&
      this.props.value.start_date &&
      this.props.value.end_date
    ) {
      const dateRangeText = getDateRangeText(
        // $FlowFixMe: third party library
        moment.utc(this.props.value.start_date),
        // $FlowFixMe: third party library
        moment.utc(this.props.value.end_date),
        this.orgTimeZone
      );

      return dateRangeText;
    }

    return this.props.placeholder || '';
  }

  renderPickerButton() {
    // Safe implementation of the styling required to add
    // the X icon
    // I'm hiding the isClearable styles behind the prop
    // so it doesn't affect other usages.
    return this.props.isClearable ? (
      <div
        css={css`
          background-color: ${colors.neutral_200};
          border-color: ${colors.neutral_200};
          color: ${colors.grey_100};
          border-radius: 3px;
          min-height: 32px;
          padding: 2px 8px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        `}
      >
        <span>{this.getDateRangeText()}</span>
        <div
          css={css`
            // Large margin left to allow space for the X icon
            margin-left: 28px;
          `}
        >
          <i className="icon-calendar" />
        </div>
      </div>
    ) : (
      <TextButton
        text={this.getDateRangeText()}
        iconAfter="icon-calendar"
        type="secondary"
        shouldFitContainer
        kitmanDesignSystem
      />
    );
  }

  render() {
    if (this.dateRangePicker && this.dateRangePicker.daterangeElement) {
      if (this.props.disabled) {
        this.dateRangePicker.disable();
      } else {
        this.dateRangePicker.enable();
      }
    }
    const onChange = this.props.onChange;
    const value = this.props.value;

    return (
      <div
        css={css`
          position: relative;
        `}
      >
        <div
          className={classNames(`input-group input-group-lg date`, {
            'input-group--disabled': this.props.disabled,
            'input-group--invalid': this.props.invalid,
          })}
          ref={(dateRangeEl) => {
            this.dateRangeEl = dateRangeEl;
          }}
        >
          {this.props.kitmanDesignSystem ? (
            this.renderPickerButton()
          ) : (
            <>
              <input
                value={this.getDateRangeText()}
                className="km-input-control"
                type="text"
                name="marker[marker_date]"
                id="marker_marker_date"
                readOnly
                disabled={this.props.disabled}
                data-ignore-validation={this.props.ignoreValidation}
              />
              <span className="input-group-append input-group-addon">
                <span className="icon-calendar input-group-text" />
              </span>
            </>
          )}
        </div>
        {this.props.isClearable && value !== null && (
          // This markup needs to be outside of the
          // daterange picker div so that it doesn't
          // open the picker when clicked. stopPropegation
          // doesn't work. So its absolute far enough
          // right that it dosn't appear.
          <i
            css={css`
              position: absolute;
              right: 28px;
              top: 9px;
              cursor: pointer;
            `}
            className="js-stopDatePickerOpen icon-close"
            onClick={() => {
              onChange(null);
            }}
          />
        )}
      </div>
    );
  }
}

export default DateRangePicker;
