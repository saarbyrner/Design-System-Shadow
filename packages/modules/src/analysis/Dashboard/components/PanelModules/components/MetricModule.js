// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo } from 'react';
import _find from 'lodash/find';

import { InputTextField, Select } from '@kitman/components';
import { formatAvailableVariablesForGroupedSelect } from '@kitman/common/src/utils/formatAvailableVariables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetMetricVariablesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import type {
  TableWidgetCalculationParams,
  TablePanel,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { CalculationModuleTranslated as CalculationModule } from './CalculationModule';

type Props = {
  hideColumnTitle?: boolean,
  calculation: string,
  calculationParams: TableWidgetCalculationParams,
  columnTitle?: string,
  selectedMetric: string,
  onSetCalculation: Function,
  onSetCalculationParam: Function,
  onSetColumnTitle?: Function,
  onSetMetrics: Function,
  panelType?: TablePanel,
  hideComplexCalcs?: boolean,
};

function MetricModule(props: I18nProps<Props>) {
  const { data: availableVariables } = useGetMetricVariablesQuery();

  const metrics = useMemo(
    () => formatAvailableVariablesForGroupedSelect(availableVariables),
    [availableVariables]
  );

  return (
    <>
      <Panel.Field>
        <Select
          label={props.t('Metric Source')}
          data-testid="MetricModule|DataSource"
          options={metrics}
          onChange={(variable) => {
            const metric = _find(
              metrics.reduce((acc, curr) => {
                const options = curr.options || [];

                return [...acc, ...options];
              }, []),
              {
                value: variable,
              }
            );

            props.onSetMetrics([
              {
                name: metric?.label,
                key_name: metric?.value,
              },
            ]);
          }}
          value={props.selectedMetric}
          searchable
        />
      </Panel.Field>
      <CalculationModule
        data-testid="MetricModule|Calculation"
        dataSourceOptions={metrics}
        calculation={props.calculation}
        onSetCalculation={props.onSetCalculation}
        calculationParams={props.calculationParams}
        onSetCalculationParam={props.onSetCalculationParam}
        panelType={props.panelType}
        hideComplexCalcs={props.hideComplexCalcs}
      />
      {!props.hideColumnTitle && (
        <>
          <Panel.Divider />
          <Panel.Field>
            <InputTextField
              data-testid="MetricModule|ColumnTitle"
              label={
                props.panelType === 'row'
                  ? props.t('Row Title')
                  : props.t('Column Title')
              }
              inputType="text"
              value={props.columnTitle || ''}
              onChange={(e) => props.onSetColumnTitle?.(e.currentTarget.value)}
              kitmanDesignSystem
            />
          </Panel.Field>
        </>
      )}
    </>
  );
}

export const MetricModuleTranslated = withNamespaces()(MetricModule);
export default MetricModule;
