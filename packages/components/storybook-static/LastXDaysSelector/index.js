// @flow
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { InputTextField, RadioList } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  invalid?: ?boolean,
  radioName?: ?string,
  onChange: (?string | ?number) => void,
  customClass?: string,
  periodLength?: ?number,
  kitmanDesignSystem: boolean,
};

class LastXDaysSelector extends Component<
  I18nProps<Props>,
  {
    timePeriod: string | number,
    inputValue: ?number | ?string,
  }
> {
  getDaysValue: (?number | string, string | number) => void;

  days: ?number | string;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.onNumberInputChange = this.onNumberInputChange.bind(this);
    this.getDaysValue = this.getDaysValue.bind(this);
    this.days = this.props.periodLength;

    // The default radio selection is always 'days', so we just display periodLength
    this.state = {
      timePeriod: 'days',
      inputValue:
        this.props.periodLength !== null ? this.props.periodLength : '',
    };
  }

  onNumberInputChange = (event: Object) => {
    this.days = event.target.value;
    this.setState({
      inputValue: this.days,
    });

    this.props.onChange(this.getDaysValue(this.days, this.state.timePeriod));
  };

  handleRadioChange = (value: string | number) => {
    this.setState({
      timePeriod: value,
    });
    this.props.onChange(this.getDaysValue(this.days, value));
  };

  getDaysValue(days: number, timePeriod: string | number) {
    if (!days) {
      return '';
    }
    return timePeriod === 'weeks' ? parseInt(days * 7, 10) : parseInt(days, 10);
  }

  getCustomClass() {
    return this.props.customClass ? this.props.customClass : '';
  }

  render() {
    return (
      <div
        className={classNames(`lastXDaysSelector ${this.getCustomClass()}`, {
          'lastXDaysSelector--invalid': this.props.invalid,
        })}
      >
        <div className="lastXDaysSelector__input-cont">
          {this.props.kitmanDesignSystem ? (
            <InputTextField
              inputType="number"
              kitmanDesignSystem
              label={this.props.t('Last')}
              onChange={this.onNumberInputChange}
              t={this.props.t}
              value={
                this.state.inputValue ? this.state.inputValue.toString() : ''
              }
            />
          ) : (
            <>
              <span className="lastXDaysSelector__descriptor">
                {this.props.t('Last')}
              </span>
              <input
                onChange={this.onNumberInputChange}
                className="lastXDaysSelector__input"
                type="number"
                value={this.state.inputValue || ''}
              />
            </>
          )}
        </div>
        <div
          className={classNames('lastXDaysSelector__options', {
            'lastXDaysSelector__options--kitmanDesignSystem':
              this.props.kitmanDesignSystem,
          })}
        >
          <RadioList
            options={[
              {
                name: this.props.t('Days'),
                value: this.props.t('days'),
              },
              {
                name: this.props.t('Weeks'),
                value: this.props.t('weeks'),
              },
            ]}
            change={(value) => {
              this.handleRadioChange(value);
            }}
            radioName={this.props.radioName || 'custom_time_period'}
            value={this.state.timePeriod}
            kitmanDesignSystem={this.props.kitmanDesignSystem}
          />
        </div>
      </div>
    );
  }
}

export const LastXDaysSelectorTranslated = withNamespaces()(LastXDaysSelector);
export default LastXDaysSelector;
