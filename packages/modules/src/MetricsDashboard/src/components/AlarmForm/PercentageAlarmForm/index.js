// @flow
import { withNamespaces } from 'react-i18next';
import { Dropdown, PeriodScopeSelector } from '@kitman/components';
import { availableTimePeriods } from '@kitman/common/src/utils/status_utils';
import type { Alarm, AlarmCalculation } from '@kitman/common/src/types/Alarm';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  percentageAlarmConditions,
  alarmCalculationOptions,
} from '../../../../resources/alarmOptions';

type alarmPosition = number;

type Props = {
  position: alarmPosition,
  condition: $PropertyType<Alarm, 'condition'>,
  setCondition: ($PropertyType<Alarm, 'condition'>, alarmPosition) => void,
  setAlarmCalculation: (AlarmCalculation, alarmPosition) => void,
  setAlarmPercentage: (string, alarmPosition) => void,
  percentageAlarmDefinition: $PropertyType<
    Alarm,
    'percentage_alarm_definition'
  >,
  setAlarmPeriodScope: (string, alarmPosition) => void,
  setAlarmPeriodLength: (number, alarmPosition) => void,
};

const PercentageAlarmForm = (props: I18nProps<Props>) => {
  const getAvailableTimePeriods = () => {
    const calculation = props.percentageAlarmDefinition
      ? props.percentageAlarmDefinition.calculation
      : '';
    return availableTimePeriods(calculation);
  };

  return (
    <div className="alarmForm__content--percentage">
      <div className="alarmForm__row">
        <div className="alarmForm__condition alarmForm__condition--numeric alarmForm__condition--percentageAlarms">
          <div className="alarmForm__selector alarmForm__selector--condition">
            <Dropdown
              label={props.t('Condition')}
              items={percentageAlarmConditions()}
              onChange={(optionId) =>
                props.setCondition(optionId, props.position)
              }
              value={props.condition || ''}
            />
          </div>
          <div className="alarmForm__input js-validationSection">
            <div className="inputNumeric">
              <span className="inputNumeric__descriptor">%</span>
              <input
                name="percentageValue"
                onChange={(event) =>
                  props.setAlarmPercentage(event.target.value, props.position)
                }
                type="text"
                value={
                  props.percentageAlarmDefinition &&
                  (props.percentageAlarmDefinition.percentage === 0 ||
                    props.percentageAlarmDefinition.percentage)
                    ? props.percentageAlarmDefinition.percentage
                    : ''
                }
              />
              <span className="formValidator__errorMsg">
                {props.t('Max 4 numbers / No negatives')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="alarmForm__row col-md-7">
        <Dropdown
          label={props.t('Calculation')}
          value={
            props.percentageAlarmDefinition
              ? props.percentageAlarmDefinition.calculation
              : ''
          }
          items={alarmCalculationOptions()}
          onChange={(calculation) =>
            props.setAlarmCalculation(calculation, props.position)
          }
          disabled={false}
        />
      </div>
      <div className="alarmForm__row col-md-12">
        <PeriodScopeSelector
          summary={
            props.percentageAlarmDefinition
              ? props.percentageAlarmDefinition.calculation
              : ''
          }
          periodScope={
            props.percentageAlarmDefinition
              ? props.percentageAlarmDefinition.period_scope
              : null
          }
          periodLength={
            props.percentageAlarmDefinition
              ? props.percentageAlarmDefinition.period_length
              : null
          }
          secondPeriodLength={null}
          availableTimePeriods={getAvailableTimePeriods()}
          secondPeriodAllTime={false}
          setPeriodScope={(periodScope) =>
            props.setAlarmPeriodScope(periodScope, props.position)
          }
          setPeriodLength={(periodLength) =>
            props.setAlarmPeriodLength(periodLength, props.position)
          }
          setBothPeriodLengths={() => {}}
          setZScoreRolling={() => {}}
        />
      </div>
    </div>
  );
};

export const PercentageAlarmFormTranslated =
  withNamespaces()(PercentageAlarmForm);
export default PercentageAlarmForm;
