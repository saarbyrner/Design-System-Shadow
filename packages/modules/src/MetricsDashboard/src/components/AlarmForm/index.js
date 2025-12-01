// @flow
import { Component } from 'react';
import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';

import type { Alarm, AlarmCalculation } from '@kitman/common/src/types/Alarm';
import type { Status } from '@kitman/common/src/types/Status';
import { Checkbox, Dropdown, RadioList, Time } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  alarmTypeOptions,
  numericAlarmConditions,
} from '@kitman/modules/src/MetricsDashboard/resources/alarmOptions';
import AppliesToSearch from '@kitman/modules/src/MetricsDashboard/src/containers/AppliesToSearch';

import { PercentageAlarmFormTranslated as PercentageAlarmForm } from './PercentageAlarmForm';

type alarmPosition = number;

type Props = {
  alarm_id: string,
  alarm_type: $PropertyType<Alarm, 'alarm_type'>,
  setAlarmType: ($PropertyType<Alarm, 'alarm_type'>, alarmPosition) => void,
  position: alarmPosition,
  unit: string,
  condition: $PropertyType<Alarm, 'condition'>,
  alarmValue: number,
  alarmColour: $PropertyType<Alarm, 'colour'>,
  value: number,
  type: $PropertyType<Status, 'type'>,
  setValue: (string, alarmPosition) => void,
  setCondition: ($PropertyType<Alarm, 'condition'>, alarmPosition) => void,
  setTimeValue: (string, alarmPosition) => void,
  deleteAlarm: (number) => void,
  setAlarmColour: (any, alarmPosition) => void,
  show_on_mobile: boolean,
  calculation: ?AlarmCalculation,
  setAlarmCalculation: (AlarmCalculation, alarmPosition) => void,
  setAlarmPercentage: (string, alarmPosition) => void,
  setAlarmPeriodScope: (string, alarmPosition) => void,
  setAlarmPeriodLength: (number, alarmPosition) => void,
  updateShowAlarmOnMobile: Function,
  percentage_alarm_definition: $PropertyType<
    Alarm,
    'percentage_alarm_definition'
  >,
  summary: string,
};

class AlarmForm extends Component<I18nProps<Props>> {
  constructor(props: I18nProps<Props>) {
    super(props);

    // set default value for radio and condition
    if (this.props.type === 'boolean' && this.props.value === null) {
      this.props.setValue('1', this.props.position);
      this.props.setCondition('equals', this.props.position);
    }
  }

  getNumericFormFields() {
    const containerClasses = classNames(
      'alarmForm__condition',
      'alarmForm__condition--numeric'
    );
    const isNoUnitSummary =
      this.props.summary !== 'last' &&
      this.props.summary !== 'mean' &&
      this.props.summary !== 'sum' &&
      this.props.summary !== 'min' &&
      this.props.summary !== 'max';
    const inputClasses = classNames('inputNumeric', 'alarmForm__numericInput', {
      'inputNumeric--noUnit': isNoUnitSummary || this.props.unit === '',
    });

    return (
      <div className={containerClasses}>
        {this.renderConditionDropdown()}
        <div className="alarmForm__input">
          <div className={inputClasses}>
            {this.renderUnitSpan(isNoUnitSummary)}
            <input
              name="inputNumber"
              onChange={(event) =>
                this.props.setValue(event.target.value, this.props.position)
              }
              type="text"
              value={
                this.props.alarmValue === 0 || this.props.alarmValue
                  ? this.props.alarmValue
                  : ''
              }
            />
          </div>
        </div>
      </div>
    );
  }

  getBooleanFormFields() {
    return (
      <div className="alarmForm__condition alarmForm__condition--boolean">
        <div className="alarmForm__selector">
          <p className="alarmForm__label">
            {this.props.t('Alarm when Status is')}
          </p>
          <RadioList
            radioName="boolean_alarm"
            options={[
              {
                name: this.props.t('Yes'),
                value: '1',
              },
              {
                name: this.props.t('No'),
                value: '0',
              },
            ]}
            change={(inputValue) => {
              this.props.setValue(inputValue, this.props.position);
              this.props.setCondition('equals', this.props.position);
            }}
            uniqueKey={this.props.alarm_id}
            value={String(this.props.value)}
          />
        </div>
      </div>
    );
  }

  getSleepDurationFormFields() {
    return (
      <div className="alarmForm__condition alarmForm__condition--sleep">
        {this.renderConditionDropdown()}
        <div className="alarmForm__sleepContainer">
          <Time
            mins={this.props.value}
            limit={14}
            onSelect={(mins) => {
              this.props.setTimeValue(String(mins), this.props.position);
            }}
          />
        </div>
      </div>
    );
  }

  getScaleFormFields() {
    const containerClasses = classNames(
      'alarmForm__condition',
      'alarmForm__condition--numeric'
    );

    return (
      <div className={containerClasses}>
        {this.renderConditionDropdown()}
        <div className="alarmForm__input">
          <div className="inputNumeric inputNumeric--noUnit alarmForm__numericInput">
            <input
              name="inputNumber"
              onChange={(event) =>
                this.props.setValue(event.target.value, this.props.position)
              }
              type="text"
              value={
                this.props.alarmValue === 0 || this.props.alarmValue
                  ? this.props.alarmValue
                  : ''
              }
            />
          </div>
        </div>
      </div>
    );
  }

  getAlarmFormByType(alarmType: $PropertyType<Alarm, 'alarm_type'>) {
    return alarmType === 'percentage' ? (
      <PercentageAlarmForm
        position={this.props.position}
        condition={this.props.condition}
        setCondition={this.props.setCondition}
        setAlarmCalculation={this.props.setAlarmCalculation}
        percentageAlarmDefinition={this.props.percentage_alarm_definition || {}}
        setAlarmPercentage={this.props.setAlarmPercentage}
        setAlarmPeriodScope={this.props.setAlarmPeriodScope}
        setAlarmPeriodLength={this.props.setAlarmPeriodLength}
      />
    ) : (
      <div className="alarmForm__content--numeric">
        <div className="alarmForm__row">{this.renderConditionFields()}</div>
      </div>
    );
  }

  colourPicker() {
    return (
      <Tippy
        placement="bottom-start"
        content={
          <ul className="colourPicker">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <li
                key={`colour_${num}`}
                className={`colour colour--alarm_colour${num}`}
                onClick={() => {
                  this.props.setAlarmColour(
                    `colour${num}`,
                    this.props.position
                  );
                }}
              >
                &nbsp;
              </li>
            ))}
          </ul>
        }
        interactive
        theme="neutral-tooltip"
      >
        <div className={`alarmForm__colourSelect ${this.props.alarmColour}`} />
      </Tippy>
    );
  }

  squadSearch() {
    return (
      <AppliesToSearch
        position={this.props.position}
        alarmId={this.props.alarm_id}
      />
    );
  }

  // Some status definitions don't have units, so we don't want to render it in
  // those cases.
  renderUnitSpan(isNoUnitSummary: boolean) {
    return this.props.unit && !isNoUnitSummary ? (
      <span className="inputNumeric__descriptor">{this.props.unit}</span>
    ) : null;
  }

  renderConditionDropdown() {
    return (
      <div className="alarmForm__selector alarmForm__selector--condition">
        <Dropdown
          label={this.props.t('Condition')}
          items={numericAlarmConditions()}
          onChange={(optionId) =>
            this.props.setCondition(optionId, this.props.position)
          }
          value={this.props.condition || null}
        />
      </div>
    );
  }

  renderConditionFields() {
    if (this.props.summary === 'count') {
      return this.getNumericFormFields();
    }

    switch (this.props.type) {
      case 'boolean':
        return this.getBooleanFormFields();
      case 'sleep_duration':
        if (
          this.props.summary === 'z_score' ||
          this.props.summary === 'z_score_rolling'
        ) {
          return this.getNumericFormFields();
        }
        return this.getSleepDurationFormFields();
      case 'scale':
        return this.getScaleFormFields();
      default:
        return this.getNumericFormFields();
    }
  }

  renderAlarmTypeSelect() {
    return this.props.type !== 'boolean' ? (
      <div className="alarmForm__row col-md-7">
        <Dropdown
          label={this.props.t('Alarm Type')}
          items={alarmTypeOptions()}
          onChange={(alarmType) =>
            this.props.setAlarmType(alarmType, this.props.position)
          }
          value={this.props.alarm_type || 'numeric'}
          searchable={false}
        />
      </div>
    ) : null;
  }

  render() {
    return (
      <div className="alarmForm">
        <div className="alarmForm__header">
          <h4>
            {this.props.t('Alarm {{position}}', {
              position: this.props.position + 1,
            })}
          </h4>
          <div className="alarmForm__headerControls">
            <div className="alarmForm__colour">{this.colourPicker()}</div>
            <button
              type="button"
              className="alarmForm__deleteBtn icon-bin"
              onClick={() => {
                this.props.deleteAlarm(this.props.position);
              }}
            />
          </div>
        </div>
        <div className="alarmForm__content">
          {this.renderAlarmTypeSelect()}
          {this.getAlarmFormByType(this.props.alarm_type)}
          <div className="alarmForm__row">
            <p className="alarmForm__label">{this.props.t('Alarm for')}</p>
            {this.squadSearch()}
          </div>
        </div>
        <div className="alarmForm__showOnMobile">
          <Checkbox
            label={this.props.t('Show on Coach App')}
            id={this.props.alarm_id}
            isChecked={this.props.show_on_mobile}
            toggle={(checkbox) =>
              this.props.updateShowAlarmOnMobile(
                this.props.position,
                checkbox.checked
              )
            }
            name="alarmForm__showOnMobile"
          />
        </div>
      </div>
    );
  }
}

export const AlarmFormTranslated = withNamespaces()(AlarmForm);
export default AlarmForm;
