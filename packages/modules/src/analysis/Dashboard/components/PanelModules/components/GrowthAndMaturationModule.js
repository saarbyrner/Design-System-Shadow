// @flow
import { withNamespaces } from 'react-i18next';

import { Select } from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { useGetMaturityEstimatesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import {
  TABLE_WIDGET_DATA_SOURCE_TYPES,
  type TableWidgetCalculationParams,
  type TablePanel,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  type OnSetCalculationParam,
  type OnSetCalculation,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

import { CalculationModuleTranslated as CalculationModule } from './CalculationModule';

type Props = I18nProps<{
  estimate: string,
  onEstimateChange: (name: string, value: string) => void,

  // Pass-through props.
  calculation: string,
  calculationParams: TableWidgetCalculationParams,
  onSetCalculation: OnSetCalculation,
  onSetCalculationParam: OnSetCalculationParam,
  panelType?: TablePanel,
}>;

function GrowthAndMaturationModule(props: Props) {
  const { data: estimates = [] } = useGetMaturityEstimatesQuery();

  const estimateOptions = estimates.map((option) => {
    const labelSuffix =
      option.unit && !option.name.includes(option.unit)
        ? ` (${option.unit})`
        : '';
    return {
      label: `${option.name}${labelSuffix}`,
      value: option.id,
      ...option,
    };
  });

  return (
    <>
      <Panel.Field>
        <Select
          label={props.t('Growth and maturation source')}
          options={estimateOptions}
          onChange={(estimate) =>
            props.onEstimateChange(
              estimateOptions.find(({ id }) => id === estimate)?.label ?? '',
              estimate
            )
          }
          value={props.estimate}
          searchable
        />
      </Panel.Field>
      <CalculationModule
        dataSourceType={TABLE_WIDGET_DATA_SOURCE_TYPES.maturityEstimate}
        calculation={props.calculation}
        calculationParams={props.calculationParams}
        onSetCalculation={props.onSetCalculation}
        onSetCalculationParam={props.onSetCalculationParam}
        panelType={props.panelType}
      />
    </>
  );
}

export const GrowthAndMaturationModuleTranslated = withNamespaces()(
  GrowthAndMaturationModule
);
export default GrowthAndMaturationModule;
