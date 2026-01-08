// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { RadioList } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  metricIndex?: number,
  onPeriodLengthChange: Function,
  onTimePeriodChange: Function,
  timePeriod: 'weeks' | 'days',
  customClass?: string,
  periodLength: ?number,
  radioName?: string,
  disabled?: boolean,
  inputLabel?: string,
  kitmanDesignSystem: boolean,
};

const LastXPeriodPicker = (props: I18nProps<Props>) => {
  const [inputValue, setInputValue] = useState(
    props.periodLength !== null ? props.periodLength : ''
  );
  const [daysCount, setDaysCount] = useState(props.periodLength || '');

  // this is handling the case when a new metric is added to the graph form,
  // which should inherit the inputValue from the first metric. Possibly
  // can be removed once each metric has its own setting.
  useEffect(() => {
    if (props.metricIndex && props.metricIndex > 0) {
      if (props.periodLength && props.timePeriod === 'weeks') {
        setInputValue(parseInt(props.periodLength / 7, 10));
      } else {
        setInputValue(props.periodLength);
      }
    }
  }, [props.periodLength]);

  const getDaysValue = (
    days: number | string,
    timePeriod: 'weeks' | 'days'
  ) => {
    if (!days) {
      return '';
    }
    // days are wrapped in a parseInt so doesn't matter if it's a string
    // $FlowFixMe
    return timePeriod === 'weeks' ? parseInt(days * 7, 10) : parseInt(days, 10);
  };

  const handlePeriodChange = (value: string) => {
    setDaysCount(value);
    setInputValue(value);
    props.onPeriodLengthChange(getDaysValue(value, props.timePeriod));
  };

  const handleRadioChange = (timePeriod: 'weeks' | 'days') => {
    props.onTimePeriodChange(timePeriod);
    props.onPeriodLengthChange(getDaysValue(daysCount, timePeriod));
  };

  return (
    <div
      className={classNames('lastXPeriodPicker', {
        // props.customClass is a string, object keys are handled as strings
        // $FlowFixMe
        [props.customClass]: props.customClass,
        'lastXPeriodPicker--kitmanDesignSystem': props.kitmanDesignSystem,
      })}
    >
      <div className="lastXPeriodPicker__input-cont">
        <span className="lastXPeriodPicker__descriptor">
          {props.inputLabel || props.t('Last')}
        </span>
        <input
          onChange={(e) => handlePeriodChange(e.target.value)}
          className={classNames('lastXPeriodPicker__input', {
            'lastXPeriodPicker__input--disabled': props.disabled,
          })}
          type="number"
          value={inputValue || ''}
          disabled={props.disabled}
          data-disable-zero="true"
        />
      </div>
      <div className="lastXPeriodPicker__options">
        <RadioList
          options={[
            {
              name: props.t('Days'),
              value: props.t('days'),
            },
            {
              name: props.t('Weeks'),
              value: props.t('weeks'),
            },
          ]}
          change={(value) => {
            handleRadioChange(value);
          }}
          radioName={props.radioName || 'custom_time_period'}
          value={props.timePeriod}
          disabled={props.disabled}
          kitmanDesignSystem={props.kitmanDesignSystem}
        />
      </div>
    </div>
  );
};

export const LastXPeriodPickerTranslated = withNamespaces()(LastXPeriodPicker);
export default LastXPeriodPicker;
