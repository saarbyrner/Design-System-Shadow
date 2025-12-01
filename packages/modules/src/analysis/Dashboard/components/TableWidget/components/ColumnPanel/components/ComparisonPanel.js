// @flow
import { useState, useEffect, useCallback, type Node } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEmpty from 'lodash/isEmpty';

import { TextButton, Checkbox } from '@kitman/components';
import { ParticipationModuleTranslated as ParticipationModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ParticipationModule';
import MedicalModule, {
  MedicalData,
} from '@kitman/modules/src/analysis/Dashboard/containers/TableWidget/PanelModules/MedicalModule/Column';
import { MetricModuleTranslated as MetricModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MetricModule';
import { DateRangeModuleTranslated as DateRangeModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule';
import { ActivityModuleTranslated as ActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ActivityModule';
import {
  isDateRangeValid,
  isDataSourceValid,
} from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import { PanelFiltersTranslated as PanelFilters } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/PanelFilters';
import { useIsFiltersOpen } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/PanelFilters/hooks';
import {
  getReportingFilters,
  getReportingDefenseFilters,
  getMatchDayFilter,
  getInputParamsFromSource,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { isValidSourceForMatchDayFilter } from '@kitman/modules/src/analysis/Dashboard/utils';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import { DataSourceModuleRendererTranslated as DataSourceModuleRenderer } from '@kitman/modules/src/analysis/Dashboard/components/DataSourceModuleRenderer';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type SetState } from '@kitman/common/src/types/react';
import {
  type TableWidgetElementSource,
  type TableElementFilters,
  type TableWidgetDataSource,
  type TableWidgetCalculationParams,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { type DateRange } from '@kitman/common/src/types';
import {
  type DataSourceInputParams,
  type Calculation,
  type TimeScopeConfig,
  PANEL_TYPES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import { unsupportedMetrics } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/constants';

type Props = {
  source: TableWidgetDataSource,
  isOpen: boolean,
  isLoading: boolean,
  isEditMode: boolean,
  calculation: Calculation,
  calculationParams: TableWidgetCalculationParams,
  columnTitle: string,
  dataSource: TableWidgetElementSource,
  dateRange: ?DateRange,
  onApply: Function,
  onSetCalculation: Function,
  onSetCalculationParam: Function,
  onSetColumnTitle: Function,
  onSetDateRange: Function,
  onSetTimePeriod: Function,
  onSetTimePeriodLength: Function,
  onSetTimePeriodLengthOffset: Function,
  onSetFilters: Function,
  onSetMetrics: Function,
  onSetActivitySource: Function,
  timePeriod: string,
  timePeriodLength: ?number,
  timePeriodLengthOffset: ?number,
  timePeriodConfig: ?TimeScopeConfig,
  filters: TableElementFilters,
  gameActivityModule: Node,
  availabilityModule: Node,
  onSetDatasourceIds: SetState<Array<number>>,
  onSetParticipationStatus: SetState<string>,
  onSetParticipationEvent: (event: string) => void,
  onSetInputParams: (params: DataSourceInputParams) => void,
  onSetTimePeriodConfig: (config: TimeScopeConfig) => void,
};

function ComparisonPanel(props: I18nProps<Props>) {
  const filterOptions = [
    ...getReportingFilters(),
    ...(props.source === 'metric' ? getReportingDefenseFilters() : []),
  ];
  if (
    window.getFlag('rep-match-day-filter') &&
    isValidSourceForMatchDayFilter(props.source)
  ) {
    filterOptions.push(...getMatchDayFilter());
  }

  const canApply = useCallback(() => {
    return (
      !props.isLoading &&
      isDateRangeValid(
        props.timePeriod,
        props.dateRange,
        props.timePeriodLength
      ) &&
      isDataSourceValid(props.dataSource) &&
      !_isEmpty(props.calculation)
    );
  }, [
    props.isLoading,
    props.timePeriod,
    props.dateRange,
    props.timePeriodLength,
    props.dataSource,
    props.calculation,
  ]);
  const [addAnother, setAddAnother] = useState(false);
  const { isFilterOpen, openFilters, closeFilters } = useIsFiltersOpen(
    props.filters,
    props.isEditMode,
    props.isOpen,
    ['training_session_types', 'event_types', 'micro_cycle', 'match_days']
  );

  const onKeyDown = useCallback(
    ({ keyCode }) => {
      const RIGHT_ARROW_KEY_CODE = 39;

      if (keyCode === RIGHT_ARROW_KEY_CODE && canApply()) {
        props.onApply(addAnother);
      }
    },
    [props.onApply, addAnother, canApply]
  );

  const renderMedicalModule = () => (
    <MedicalModule data-testid="ComparisonPanel|MedicalModule" />
  );

  const enableDataSourceRenderer = window.getFlag('rep-data-source-renderer');
  const showDateRangeLastOptions =
    props.source === TABLE_WIDGET_DATA_SOURCES.metric &&
    !unsupportedMetrics.includes(props.dataSource?.source);

  const renderSource = () => {
    switch (props.source) {
      case TABLE_WIDGET_DATA_SOURCES.metric:
        return (
          <MetricModule
            data-testid="ComparisonPanel|MetricModule"
            calculation={props.calculation}
            calculationParams={props.calculationParams}
            columnTitle={props.columnTitle}
            selectedMetric={props.dataSource?.key_name}
            onSetCalculation={props.onSetCalculation}
            onSetCalculationParam={props.onSetCalculationParam}
            onSetColumnTitle={props.onSetColumnTitle}
            onSetMetrics={props.onSetMetrics}
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.activity:
        return (
          <ActivityModule
            data-testid="ComparisonPanel|ActivityModule"
            isPanelOpen={props.isOpen}
            panelType="column"
            calculation={props.calculation}
            columnTitle={props.columnTitle}
            onSetCalculation={props.onSetCalculation}
            onSetColumnTitle={props.onSetColumnTitle}
            selectedActivitySource={{
              ids: props.dataSource.ids,
              type: props.dataSource.type,
            }}
            onSetActivitySource={props.onSetActivitySource}
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.availability:
        return props.availabilityModule;
      case TABLE_WIDGET_DATA_SOURCES.participation:
        return (
          <ParticipationModule
            isPanelOpen={props.isOpen}
            data-testid="ComparisonPanel|ParticipationModule"
            selectedIds={props.dataSource.ids}
            participationStatus={props.dataSource.status}
            columnTitle={props.columnTitle}
            calculation={props.calculation}
            onSetCalculation={props.onSetCalculation}
            onSetParticipationIds={props.onSetDatasourceIds}
            onSetParticipationStatus={props.onSetParticipationStatus}
            onSetColumnTitle={props.onSetColumnTitle}
            onSetParticipationEvent={props.onSetParticipationEvent}
            panelType="column"
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.medical:
        return <MedicalModule data-testid="ComparisonPanel|MedicalModule" />;
      case TABLE_WIDGET_DATA_SOURCES.games:
        return props.gameActivityModule;
      default:
        return null;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [props.isOpen, onKeyDown]);

  return (
    <Panel>
      <Panel.Content>
        {enableDataSourceRenderer ? (
          <DataSourceModuleRenderer
            isOpen={props.isOpen}
            panelType={PANEL_TYPES.column}
            calculation={props.calculation}
            calculationParams={props.calculationParams}
            onChangeCalculation={props.onSetCalculation}
            onChangeCalculationParams={props.onSetCalculationParam}
            dataSource={props.source}
            inputParams={getInputParamsFromSource(
              props.source,
              props.dataSource
            )}
            addInputParams={props.onSetInputParams}
            onChangeName={props.onSetColumnTitle}
            name={props.columnTitle}
            medicalTypeSelector={renderMedicalModule()}
          />
        ) : (
          renderSource()
        )}
        <DateRangeModule
          data-testid="ComparisonPanel|DateRangeModule"
          dateRange={props.dateRange}
          onSetDateRange={props.onSetDateRange}
          onSetTimePeriod={props.onSetTimePeriod}
          onSetTimePeriodLength={props.onSetTimePeriodLength}
          onSetTimePeriodLengthOffset={props.onSetTimePeriodLengthOffset}
          onSetTimePeriodConfig={props.onSetTimePeriodConfig}
          timePeriod={props.timePeriod}
          timePeriodLength={props.timePeriodLength}
          timePeriodLengthOffset={props.timePeriodLengthOffset}
          config={props.timePeriodConfig}
          showLastGamesAndSessions={showDateRangeLastOptions}
        />
        {props.source === 'medical' && (
          <MedicalData data-testid="ComparisonPanel|MedicalData" />
        )}
        {props.source !== 'medical' && (
          <PanelFilters
            data-testid="ComparisonPanel|Filters"
            isOpen={isFilterOpen}
            onClickOpenFilters={openFilters}
            onClickCloseFilters={() => {
              props.onSetFilters('training_session_types', []);
              props.onSetFilters('event_types', []);
              props.onSetFilters('micro_cycle', []);
              props.onSetFilters('match_days', []);
              closeFilters();
            }}
            supportedFilters={filterOptions}
            filters={props.filters}
            onSetFilters={props.onSetFilters}
          />
        )}
      </Panel.Content>
      <Panel.Loading isLoading={props.isLoading} />
      <Panel.Actions>
        {!props.isEditMode && (
          <Checkbox
            data-testid="ComparisonPanel|AddAnother"
            id="add-another"
            name="add-another"
            isChecked={addAnother}
            toggle={() => setAddAnother(!addAnother)}
            label={props.t('Add another')}
            isLabelPositionedOnTheLeft
            kitmanDesignSystem
          />
        )}
        <TextButton
          data-testid="ComparisonPanel|Apply"
          onClick={() => props.onApply(addAnother)}
          isDisabled={!canApply()}
          type="primary"
          text={props.t('Apply')}
          kitmanDesignSystem
        />
      </Panel.Actions>
    </Panel>
  );
}

export const ComparisonPanelTranslated = withNamespaces()(ComparisonPanel);
export default ComparisonPanel;
