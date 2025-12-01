// @flow
import { type Ref, Component, createRef } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';
import moment from 'moment';
import _isUndefined from 'lodash/isUndefined';
import classNames from 'classnames';

import { ValidationText, InputTextField } from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';

export type Props = {
  label?: string,
  name: string,
  value: ?(string | Object | Array<string>),
  onDateChange?: (?Date | ?Array<Date>) => void,
  disabled?: boolean,
  disableFutureDates?: boolean,
  minDate?: typeof moment | Date | string,
  maxDate?: typeof moment | Date | string,
  customClassName?: string,
  clearBtn?: boolean,
  orientation?: string,
  container?: string,
  todayHighlight?: boolean,
  kitmanDesignSystem?: boolean,
  invalid?: boolean,
  optional?: boolean,
  multiDate?: boolean,
  autoClose?: boolean,
  displayValidationText?: boolean,
  customValidationText?: string,
};

type State = {
  inputText: string | Array<string>,
};

class DatePicker extends Component<I18nProps<Props>, State> {
  textInputRef: Ref<'input'>;

  datePicker: Function;

  constructor(props: I18nProps<Props>) {
    super(props);
    this.textInputRef = createRef();
    this.state = {
      inputText: props.value
        ? this.getInputDisplayValue(props.value, false)
        : '',
    };
  }

  componentDidMount() {
    // Prevent specs to crash:
    // bootstrap-datepicker is a JQuery plugin included in our library bundle.
    // We can't import() it here. As a result, when running the specs, $.datepicker
    // is not accessible.
    // $FlowFixMe current is not read only
    if (!this.textInputRef?.current || !$().datepicker) {
      return;
    }

    // $FlowIgnore[incompatible-call] moment.locale() should be valid call
    const shouldFormatUS = moment.locale()?.toLowerCase() === 'en';
    const weekStart = shouldFormatUS ? 0 : 1; // 1 = Monday, 0 Sunday is start of week
    let datePickerFormatValue = 'dd M yyyy'; // The value for DatePicker format prop
    if (
      window.featureFlags['date-picker-text-entry'] ||
      window.featureFlags['date-picker-short-format-display']
    ) {
      datePickerFormatValue = shouldFormatUS ? 'mm/dd/yyyy' : 'dd/mm/yyyy';
    }

    // $FlowIgnore: Early out above ensures this.textInputRef.current is non null
    this.datePicker = $(this.textInputRef.current).datepicker({
      autoclose: this.props.autoClose != null ? this.props.autoClose : true,
      clearBtn: this.props.clearBtn || false,
      endDate: this.props.disableFutureDates ? '0d' : null,
      format: datePickerFormatValue,
      keyboardNavigation: !window.featureFlags['date-picker-text-entry'],
      language: window.userLocale,
      orientation: this.props.orientation || 'auto',
      startDate: this.getStartDate(),
      weekStart,
      container: this.props.container,
      todayHighlight: _isUndefined(this.props.todayHighlight)
        ? true
        : this.props.todayHighlight,
      multidate: this.props.multiDate,
      multidateSeparator: '|',
    });

    function onHide() {
      if (
        !window.featureFlags['date-picker-text-entry'] ||
        this.props.multiDate
      ) {
        return;
      }

      const internalDate = this.datePicker.datepicker('getDate');

      // When clear button is pressed or the text input is emptied then internalDate will be null.
      if (!internalDate) {
        if (this.props.value) {
          if (this.props.clearBtn) {
            this.props.onDateChange?.(null); // Can assume parent is prepared for a null if clearBtn enabled
          } else if (!Array.isArray(this.props.value)) {
            // Reset the internal date to the currently set value
            const formattedDate = this.formatDate(this.props.value) || '';
            this.setState({
              inputText: formattedDate,
            });
            this.datePicker.datepicker('update', formattedDate);
          }
        }
        return;
      }

      const withoutTime = this.getDateWithoutTime(internalDate);
      this.setState({ inputText: withoutTime.format(this.getDateFormat()) });
      this.props.onDateChange?.(withoutTime.toDate());
    }

    function onChange(e) {
      if (this.props.multiDate) {
        const correctDates = e.dates?.map((date) => {
          let newValue = null;
          if (date !== undefined) {
            newValue = this.getDateWithoutTime(new Date(date)).toDate();
          }
          return newValue;
        });

        this.props.onDateChange?.(correctDates);
        return;
      }
      // The value in e.date is the date in the browsers timezone the codebase
      // will generally assume that all dates will be stored in the
      // organisations timezone. Which is set through moments Default Timezone
      // (https://momentjs.com/timezone/docs/#/using-timezones/default-timezone/)
      // This can cause inconsistent behaviour when the user's timezone is
      // different to the browsers timezone. This piece of logic strips the
      // timezone from the e.date and parses it according to the internal
      // moment setup.

      // when we use the datepicker clear function e.date is undefined, so to
      // avoid falling back to the current date, which the new Date() returns
      // in such case, newValue should only be updated if e.date exists
      if (e.date !== undefined) {
        const dateWithoutTime = this.getDateWithoutTime(new Date(e.date));
        this.setState({
          inputText: dateWithoutTime.format(this.getDateFormat()),
        });

        this.props.onDateChange?.(dateWithoutTime.toDate());
      } else {
        this.setState({ inputText: '' });
        this.props.onDateChange?.(null);
      }
    }

    this.datePicker.on('changeDate', onChange.bind(this));
    this.datePicker.on('hide', onHide.bind(this));

    let formattedDate = '';
    if (this.props.value) {
      formattedDate = Array.isArray(this.props.value)
        ? this.props.value.map((dateStr) => this.formatDate(dateStr))
        : this.formatDate(this.props.value);
    }
    // cannot use value attribute on <input>, need to
    // update value using update method

    if (Array.isArray(this.props.value)) {
      this.datePicker.datepicker('setDates', formattedDate);
    } else {
      this.datePicker.datepicker('update', formattedDate);
    }

    if (this.props.minDate) {
      this.datePicker.datepicker('setStartDate', this.getStartDate());
    }
    if (this.props.maxDate) {
      this.datePicker.datepicker('setEndDate', this.getEndDate());
    }

    // When scrolling in a modal, reposition the datepicker
    $('.ReactModal__Overlay').scroll(() => {
      // $FlowFixMe current exists
      $(this.textInputRef.current).datepicker('place');
    });
  }

  componentDidUpdate(prevProps: Props) {
    // Prevent specs to crash as described in componentDidMount
    // $FlowFixMe
    if (!this.textInputRef?.current || !$().datepicker) {
      return;
    }
    // update value of input if component is re-rendered with new props
    if (prevProps.value !== this.props.value) {
      if (Array.isArray(this.props.value)) {
        if (
          !prevProps.value ||
          !Array.isArray(prevProps.value) ||
          prevProps.value?.length !== this.props.value?.length ||
          this.props.value.some(
            (element, index) => element !== prevProps.value?.[index]
          )
        ) {
          const formattedDate = this.props.value
            ? this.props.value.map((dateStr) => this.formatDate(dateStr))
            : this.formatDate(this.props.value);
          this.datePicker.datepicker('setDates', formattedDate);
        }
      } else {
        const formattedDate = this.props.value
          ? this.formatDate(this.props.value)
          : '';

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ inputText: this.formatDate(this.props.value) || '' });

        this.datePicker.datepicker('update', formattedDate);
      }
    }
    if (prevProps.minDate !== this.props.minDate) {
      this.datePicker.datepicker('setStartDate', this.getStartDate());
    }
    if (prevProps.maxDate !== this.props.maxDate) {
      this.datePicker.datepicker('setEndDate', this.getEndDate());
    }
  }

  getEndDate() {
    if (this.props.maxDate)
      return moment(this.props.maxDate, DatePicker.dateConversionFormat).format(
        this.getDateFormat()
      );

    if (this.props.disableFutureDates) return '0d';

    return null;
  }

  getStartDate() {
    return this.props.minDate
      ? moment(this.props.minDate, DatePicker.dateConversionFormat).format(
          this.getDateFormat()
        )
      : '01/01/1900'; // This date works for DD/MM/YYYY or MM/DD/YYYY
  }

  getDateFormat(): string {
    // Our usual DateFormatter.formatShort should not be used here as it would
    // use ('L') and the date picker can't deal with odd locale formats like
    // '21.06.2023'

    if (
      window.featureFlags['date-picker-text-entry'] ||
      window.featureFlags['date-picker-short-format-display']
    ) {
      // $FlowIgnore[incompatible-call] moment.locale() should be valid call
      const shouldFormatUS = moment.locale()?.toLowerCase() === 'en';
      return shouldFormatUS ? 'MM/DD/YYYY' : 'DD/MM/YYYY';
    }

    return 'DD/MM/YYYY';
  }

  getDateWithoutTime(date: Date): moment {
    return moment({
      y: date.getFullYear(),
      M: date.getMonth(),
      d: date.getDate(),
    });
  }

  getInputDisplayValue(
    value: ?(string | Object | Array<string>),
    forceValidateExactFormat: boolean
  ): string {
    if (!value) {
      return '';
    }
    const textEntryAllowed = window.featureFlags['date-picker-text-entry'];
    const displayShortFormat =
      window.featureFlags['date-picker-short-format-display'];

    const displayFormat =
      textEntryAllowed || displayShortFormat
        ? this.getDateFormat()
        : 'DD MMM YYYY';

    if (Array.isArray(value)) {
      const formattedArray = value.map((dateStr: string) =>
        moment(dateStr).isValid() ? moment(dateStr).format(displayFormat) : ''
      );
      return formattedArray.join('|');
    }
    // The initial state may have a value in a date format that is not
    if (textEntryAllowed && forceValidateExactFormat) {
      const enforcedFormatDate = moment(value, this.getDateFormat(), true);
      return enforcedFormatDate.isValid()
        ? enforcedFormatDate.format(displayFormat)
        : value || '';
    }

    return moment(value).isValid() ? moment(value).format(displayFormat) : '';
  }

  showDatepicker() {
    if (!this.props.disabled) {
      this.datePicker.datepicker('show');
    }
  }

  formatDate(value: ?string): ?string {
    return value
      ? moment(value, DatePicker.dateConversionFormat).format(
          this.getDateFormat()
        )
      : null;
  }

  static dateConversionFormat = 'YYYY-MM-DD HH:mm:ss';

  render() {
    return (
      <div className={classNames('datePicker', this.props.customClassName)}>
        {this.props.kitmanDesignSystem ? (
          <InputTextField
            value={this.getInputDisplayValue(
              window.featureFlags['date-picker-text-entry'] &&
                !Array.isArray(this.props.value)
                ? this.state.inputText
                : this.props.value,
              true
            )}
            label={this.props.label}
            invalid={this.props.invalid}
            onFocus={() => this.showDatepicker()}
            disabled={this.props.disabled}
            onChange={(inputEvent) => {
              if (
                window.featureFlags['date-picker-text-entry'] &&
                !this.props.multiDate
              ) {
                this.setState({ inputText: inputEvent.target.value });
              }
            }}
            name={this.props.name}
            readonly={
              // Don't allow text entry for multiple dates ( just singular )
              !window.featureFlags['date-picker-text-entry'] ||
              this.props.multiDate
            }
            optional={this.props.optional}
            kitmanDesignSystem
            inputRef={this.textInputRef}
            calendarIcon
          />
        ) : (
          <>
            {this.props.label && (
              <label
                className={classNames('datePicker__label', {
                  'datePicker__label--disabled': this.props.disabled,
                })}
                htmlFor="dropdown"
              >
                {this.props.label}
              </label>
            )}
            <div
              className={classNames(
                'input-group input-group-lg date datePicker__group',
                { 'input-group--disabled': this.props.disabled }
              )}
            >
              <input
                ref={this.textInputRef}
                className="km-input-control"
                type="text"
                name={this.props.name}
                disabled={this.props.disabled}
                autoComplete="off"
                readOnly={
                  // Don't allow text entry for multiple dates ( just singular )
                  !window.featureFlags['date-picker-text-entry'] ||
                  this.props.multiDate
                }
              />
              <span
                className="input-group-addon input-group-append"
                onClick={() => this.showDatepicker()}
              >
                <span className="icon-calendar input-group-text" />
              </span>
            </div>
            {this.props.optional && (
              <div className="datePicker__optionalFieldText">
                {this.props.t('Optional')}
              </div>
            )}
          </>
        )}
        {this.props.displayValidationText && this.props.invalid && (
          <ValidationText
            customValidationText={this.props.customValidationText}
          />
        )}
      </div>
    );
  }
}

export const DatePickerTranslated = withNamespaces()(DatePicker);
export default DatePicker;
