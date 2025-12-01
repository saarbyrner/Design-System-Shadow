// @flow
import { Fragment, useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import _get from 'lodash/get';

import {
  InputNumeric,
  InputRadio,
  Select,
  TextButton,
  SegmentedControl,
} from '@kitman/components';
import {
  type Option,
  fitContentMenuCustomStyles,
} from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { dateRangeTimePeriods } from '@kitman/common/src/utils/status_utils';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import {
  type TableWidgetCalculationParams,
  type TablePanel,
  type TableWidgetDataSourceType,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { getCalculationDropdownOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import {
  type OnSetCalculationParam,
  type OnSetCalculation,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

type Props = {
  dataSourceOptions: Array<Option>,
  calculation: string,
  onSetCalculation: OnSetCalculation,
  calculationParams: TableWidgetCalculationParams,
  onSetCalculationParam: OnSetCalculationParam,
  panelType?: TablePanel,
  dataSourceType?: TableWidgetDataSourceType,
  hideComplexCalcs?: boolean,
};

export const calculationParamsMap = {
  z_score: ['evaluated_period', 'comparative_period'],
  complex_z_score: ['evaluated_period', 'comparative_period_type', 'operator'],
  acute_chronic: ['acute', 'chronic', 'type'],
  acute_chronic_ewma: ['acute', 'chronic', 'type'],
  training_stress_balance: ['acute', 'chronic'],
  strain: ['time_period_length', 'time_period_length_unit'],
  monotony: ['time_period_length', 'time_period_length_unit'],
  training_efficiency_index: [
    'time_period',
    'time_period_length',
    'second_data_source',
    'second_data_source_type',
  ],
  average_percentage_change: ['evaluated_period', 'comparative_period'],
  standard_deviation: ['time_period'],
};

const NumericCalculationParam = (props: {
  label: string,
  unitLabel: string,
  onChange: Function,
  value?: number,
}) => (
  <Panel.InlineField>
    <InputNumeric
      label={props.label}
      onChange={(value) => props.onChange(parseInt(value, 10))}
      value={props.value}
      kitmanDesignSystem
    />
    <Panel.InlineFieldLabel>{props.unitLabel}</Panel.InlineFieldLabel>
  </Panel.InlineField>
);

const ComparativePeriodType = withNamespaces()(
  (
    props: I18nProps<{
      onSetCalculationParam: OnSetCalculationParam,
      periodType: 'all' | 'custom',
      comparativePeriod: number | null,
    }>
  ) => {
    useEffect(() => {
      if (props.periodType === 'all') {
        props.onSetCalculationParam('comparative_period', null);
      }
    }, [props.periodType]);

    return (
      <Panel.Field>
        <Panel.FieldTitle>{props.t('Comparative Days')}</Panel.FieldTitle>
        <InputRadio
          index={0}
          inputName="custom_name"
          option={{
            value: 'custom',
            name: (
              <Panel.InlineField
                styles={{
                  display: 'inline-flex',
                  margin: 0,
                }}
              >
                <InputNumeric
                  label={null}
                  onChange={(value) =>
                    props.onSetCalculationParam(
                      'comparative_period',
                      parseInt(value, 10)
                    )
                  }
                  value={props.comparativePeriod}
                  kitmanDesignSystem
                />
                <Panel.InlineFieldLabel>
                  {props.t('Days')}
                </Panel.InlineFieldLabel>
              </Panel.InlineField>
            ),
          }}
          value={props.periodType}
          change={(value) =>
            props.onSetCalculationParam('comparative_period_type', value)
          }
          kitmanDesignSystem
        />
        <InputRadio
          index={1}
          inputName="custom_name"
          option={{ value: 'all', name: 'All time' }}
          value={props.periodType}
          change={(value) =>
            props.onSetCalculationParam('comparative_period_type', value)
          }
          kitmanDesignSystem
        />
      </Panel.Field>
    );
  }
);

const ComplexTimePeriodField = withNamespaces()(
  (
    props: I18nProps<{
      onSetCalculationParam: OnSetCalculationParam,
      timePeriod: 'all_time' | 'custom',
      timePeriodLength: number | null,
    }>
  ) => (
    <Panel.Field>
      <Panel.FieldTitle>{props.t('Time Period')}</Panel.FieldTitle>
      <InputRadio
        index={0}
        inputName="custom_name"
        option={{
          value: 'custom',
          name: (
            <Panel.InlineField
              styles={{
                display: 'inline-flex',
                margin: 0,
              }}
            >
              <InputNumeric
                label={null}
                onChange={(value) =>
                  props.onSetCalculationParam(
                    'time_period_length',
                    parseInt(value, 10)
                  )
                }
                value={props.timePeriodLength}
                kitmanDesignSystem
              />
              <Panel.InlineFieldLabel>{props.t('Days')}</Panel.InlineFieldLabel>
            </Panel.InlineField>
          ),
        }}
        value={props.timePeriod}
        change={(value) => {
          props.onSetCalculationParam('time_period', value);
          props.onSetCalculationParam('time_period_length_unit', 'days');
        }}
        kitmanDesignSystem
      />
      <InputRadio
        index={1}
        inputName="custom_name"
        option={{ value: 'all_time', name: props.t('All time') }}
        value={props.timePeriod}
        change={(value) => {
          props.onSetCalculationParam('time_period', value);
          props.onSetCalculationParam('time_period_length', null);
          props.onSetCalculationParam('time_period_length_unit', null);
        }}
        kitmanDesignSystem
      />
    </Panel.Field>
  )
);

const TimePeriodField = withNamespaces()(
  (
    props: I18nProps<{
      calculationParams: TableWidgetCalculationParams,
      onSetCalculationParam: OnSetCalculationParam,
    }>
  ) => {
    const timePeriod = _get(props.calculationParams, 'time_period', null);
    const timePeriodLength = _get(
      props.calculationParams,
      'time_period_length',
      null
    );
    const timePeriodLengthUnit = _get(
      props.calculationParams,
      'time_period_length_unit',
      null
    );

    useEffect(() => {
      if (timePeriod !== TIME_PERIODS.lastXDays && timePeriodLength !== null) {
        props.onSetCalculationParam('time_period_length', null);
      }

      if (
        timePeriod !== TIME_PERIODS.lastXDays &&
        timePeriodLengthUnit !== null
      ) {
        props.onSetCalculationParam('time_period_length_unit', null);
      }
    }, [timePeriod, timePeriodLength, timePeriodLengthUnit]);

    return (
      <>
        <Panel.Field>
          <Select
            label={props.t('Time Period')}
            value={timePeriod}
            options={dateRangeTimePeriods()
              .map(({ id, title }) => ({
                value: id,
                label: title,
              }))
              .filter(({ value }) => value !== TIME_PERIODS.customDateRange)}
            onChange={(value) =>
              props.onSetCalculationParam('time_period', value)
            }
            appendToBody
          />
        </Panel.Field>
        {timePeriod === TIME_PERIODS.lastXDays && (
          <>
            <Panel.FieldTitle
              styles={{
                marginLeft: '20px',
              }}
            >
              {props.t('Last')}
            </Panel.FieldTitle>
            <div
              css={{
                display: 'flex',
                margin: '0 20px 10px',
              }}
            >
              <InputNumeric
                label={null}
                onChange={(value) =>
                  props.onSetCalculationParam(
                    'time_period_length',
                    parseInt(value, 10)
                  )
                }
                value={timePeriodLength}
                kitmanDesignSystem
              />
              <div
                css={{
                  marginLeft: '10px',
                }}
              >
                <SegmentedControl
                  width="inline"
                  buttons={[
                    {
                      name: props.t('Days'),
                      value: 'days',
                    },
                    {
                      name: props.t('Weeks'),
                      value: 'weeks',
                    },
                  ]}
                  selectedButton={timePeriodLengthUnit}
                  onClickButton={(value) =>
                    props.onSetCalculationParam(
                      'time_period_length_unit',
                      value
                    )
                  }
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
);

function CalculationModule(props: I18nProps<Props>) {
  const calculationParams: Array<$Keys<TableWidgetCalculationParams>> =
    useMemo(() => {
      return calculationParamsMap[props.calculation] || [];
    }, [props.calculation]);

  return (
    <>
      <Panel.Field>
        <Select
          data-testid="CalculationModule|Calculation"
          label={props.t('Calculation')}
          value={props.calculation}
          options={[
            ...getCalculationDropdownOptions({
              withComplexCalcs: props?.hideComplexCalcs
                ? !props.hideComplexCalcs
                : true,
              dataSourceType: props.dataSourceType,
            }).map(({ id, title }) => ({
              value: id,
              label: title,
            })),
            ...(window.getFlag('rep-defense-bmt-mvp') &&
            props.panelType === 'formula'
              ? [
                  {
                    value: 'sum_last_value',
                    label: props.t('Sum (Last)'),
                  },
                  {
                    value: 'count_last_value',
                    label: props.t('Count (Last)'),
                  },
                ]
              : []),
          ]}
          onChange={(calc) => props.onSetCalculation(calc)}
          appendToBody
          customSelectStyles={fitContentMenuCustomStyles}
        />
      </Panel.Field>
      {calculationParams.length > 0 && (
        <Panel.SubField>
          {calculationParams.includes('time_period') &&
            calculationParams.includes('time_period_length') && (
              <ComplexTimePeriodField
                data-testid="CalculationModule|ComplexTimePeriodField"
                timePeriod={_get(props.calculationParams, 'time_period', null)}
                timePeriodLength={_get(
                  props.calculationParams,
                  'time_period_length',
                  null
                )}
                onSetCalculationParam={props.onSetCalculationParam}
              />
            )}

          {calculationParams.map((param) => (
            <Fragment key={param}>
              {param === 'evaluated_period' && (
                <NumericCalculationParam
                  data-testid="CalculationModule|EvaluatedPeriod"
                  label={props.t('Evaluate Period')}
                  unitLabel={props.t('Days')}
                  value={_get(props.calculationParams, param, null)}
                  onChange={(value) =>
                    props.onSetCalculationParam(param, value)
                  }
                />
              )}

              {param === 'comparative_period' && (
                <NumericCalculationParam
                  data-testid="CalculationModule|ComparativePeriod"
                  label={props.t('Comparative Period')}
                  unitLabel={props.t('Days')}
                  value={_get(props.calculationParams, param, null)}
                  onChange={(value) =>
                    props.onSetCalculationParam(param, value)
                  }
                />
              )}

              {param === 'comparative_period_type' && (
                <ComparativePeriodType
                  data-testid="CalculationModule|ComparativePeriodType"
                  periodType={_get(
                    props.calculationParams,
                    'comparative_period_type',
                    null
                  )}
                  comparativePeriod={_get(
                    props.calculationParams,
                    'comparative_period',
                    null
                  )}
                  onSetCalculationParam={props.onSetCalculationParam}
                />
              )}

              {param === 'operator' && (
                <Panel.Field
                  data-testid="CalculationModule|Operator"
                  styles={{
                    '.textButton--kitmanDesignSystem': {
                      marginRight: '5px',
                    },
                  }}
                >
                  <Panel.FieldTitle>{props.t('Operator')}</Panel.FieldTitle>
                  {['min', 'mean', 'max', 'sum'].map((operator) => {
                    const value = _get(
                      props.calculationParams,
                      'operator',
                      null
                    );
                    const labelMap = {
                      min: props.t('Min'),
                      mean: props.t('Mean'),
                      max: props.t('Max'),
                      sum: props.t('Sum'),
                    };

                    return (
                      <TextButton
                        key={operator}
                        text={labelMap[operator]}
                        type={value === operator ? 'primary' : 'default'}
                        onClick={() =>
                          props.onSetCalculationParam('operator', operator)
                        }
                        kitmanDesignSystem
                      />
                    );
                  })}
                </Panel.Field>
              )}

              {param === 'acute' && (
                <NumericCalculationParam
                  data-testid="CalculationModule|Acute"
                  label={props.t('Acute')}
                  unitLabel={props.t('Days')}
                  value={_get(props.calculationParams, param, null)}
                  onChange={(value) =>
                    props.onSetCalculationParam(param, value)
                  }
                />
              )}

              {param === 'chronic' && (
                <NumericCalculationParam
                  data-testid="CalculationModule|Chronic"
                  label={props.t('Chronic')}
                  unitLabel={props.t('Days')}
                  value={_get(props.calculationParams, param, null)}
                  onChange={(value) =>
                    props.onSetCalculationParam(param, value)
                  }
                />
              )}

              {param === 'type' && (
                <Panel.Field
                  data-testid="CalculationModule|Type"
                  styles={{
                    marginTop: '20px',
                  }}
                >
                  <SegmentedControl
                    width="inline"
                    buttons={[
                      {
                        name: props.t('Ratio'),
                        value: 'ratio',
                      },
                      {
                        name: props.t('Acute'),
                        value: 'acute',
                      },
                      {
                        name: props.t('Chronic'),
                        value: 'chronic',
                      },
                    ]}
                    selectedButton={_get(props.calculationParams, param, null)}
                    onClickButton={(value) =>
                      props.onSetCalculationParam(param, value)
                    }
                  />
                </Panel.Field>
              )}

              {param === 'second_data_source' && (
                <Panel.Field>
                  <Select
                    data-testid="CalculationModule|SecondDataSource"
                    label={props.t('Second data source')}
                    value={_get(props.calculationParams, param, null)}
                    options={props.dataSourceOptions}
                    onChange={(value) =>
                      props.onSetCalculationParam(param, value)
                    }
                    appendToBody
                  />
                </Panel.Field>
              )}

              {param === 'second_data_source_type' && (
                <Panel.Field>
                  <SegmentedControl
                    data-testid="CalculationModule|SecondDataSourceType"
                    label={props.t('Load')}
                    width="inline"
                    buttons={[
                      {
                        name: props.t('External'),
                        value: 'external',
                      },
                      {
                        name: props.t('Internal'),
                        value: 'internal',
                      },
                    ]}
                    selectedButton={_get(props.calculationParams, param, null)}
                    onClickButton={(value) =>
                      props.onSetCalculationParam(param, value)
                    }
                  />
                </Panel.Field>
              )}

              {param === 'time_period' && (
                <TimePeriodField
                  data-testid="CalculationModule|TimePeriodField"
                  calculationParams={props.calculationParams}
                  onSetCalculationParam={props.onSetCalculationParam}
                />
              )}
            </Fragment>
          ))}

          {calculationParams.includes('time_period_length') &&
            calculationParams.includes('time_period_length_unit') && (
              <Panel.InlineField data-testid="CalculationModule|TimePeriodLength">
                <InputNumeric
                  label={props.t('Time Period')}
                  onChange={(value) =>
                    props.onSetCalculationParam(
                      'time_period_length',
                      parseInt(value, 10)
                    )
                  }
                  value={_get(
                    props.calculationParams,
                    'time_period_length',
                    null
                  )}
                  kitmanDesignSystem
                />

                <SegmentedControl
                  styles={{
                    group: {
                      marginLeft: '10px',
                    },
                  }}
                  width="inline"
                  buttons={[
                    {
                      name: props.t('Days'),
                      value: 'days',
                    },
                    {
                      name: props.t('Weeks'),
                      value: 'weeks',
                    },
                  ]}
                  selectedButton={_get(
                    props.calculationParams,
                    'time_period_length_unit',
                    null
                  )}
                  onClickButton={(value) =>
                    props.onSetCalculationParam(
                      'time_period_length_unit',
                      value
                    )
                  }
                />
              </Panel.InlineField>
            )}
        </Panel.SubField>
      )}
    </>
  );
}

export const CalculationModuleTranslated = withNamespaces()(CalculationModule);
export default CalculationModule;
