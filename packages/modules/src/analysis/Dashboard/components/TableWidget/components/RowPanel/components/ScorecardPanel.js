// @flow
import { useEffect, useCallback, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEmpty from 'lodash/isEmpty';

import { TextButton, Checkbox } from '@kitman/components';
import { GameActivityModuleTranslated as GameActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/GameActivityModule';
import { ParticipationModuleTranslated as ParticipationModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ParticipationModule';
import { AvailabilityModuleTranslated as AvailabilityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AvailabilityModule';
import MedicalModule, {
  MedicalData,
} from '@kitman/modules/src/analysis/Dashboard/containers/TableWidget/PanelModules/MedicalModule/Row';
import { ActivityModuleTranslated as ActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ActivityModule';
import { MetricModuleTranslated as MetricModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MetricModule';
import {
  getReportingFilters,
  getReportingDefenseFilters,
  getInputParamsFromSource,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { isDataSourceValid } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import { DataSourceModuleRendererTranslated as DataSourceModuleRenderer } from '@kitman/modules/src/analysis/Dashboard/components/DataSourceModuleRenderer';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type SetState } from '@kitman/common/src/types/react';
import {
  type TableElementFilters,
  type TableWidgetDataSource,
  type TableWidgetElementSource,
  type TableWidgetCalculationParams,
  type TableWidgetAvailabilityStatus,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  type DataSourceInputParams,
  type Calculation,
  PANEL_TYPES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

import Panel from '../../Panel';
import { PanelFiltersTranslated as PanelFilters } from '../../PanelFilters';
import { useIsFiltersOpen } from '../../PanelFilters/hooks';

type Props = {
  isLoading: boolean,
  isOpen: boolean,
  isEditMode: boolean,
  source: TableWidgetDataSource,
  onSetActivitySource: Function,
  calculation: Calculation,
  calculationParams: TableWidgetCalculationParams,
  columnTitle: string,
  dataSource: TableWidgetElementSource,
  onApply: Function,
  onSetCalculation: Function,
  onSetCalculationParam: Function,
  onSetRowTitle: Function,
  onSetMetrics: Function,
  rowTitle: string,
  filters: TableElementFilters,
  onSetFilters: Function,
  onSetGameActivityKinds: (kind: string | Array<string>) => void,
  onSetGameActivityResult: (result: string) => void,
  onSetTimeInPositions: (positionIds: Array<string>) => void,
  onSetTimeInFormation: (formationIds: Array<string>) => void,
  onSetAvailabilitySource: (
    status: TableWidgetAvailabilityStatus,
    name?: string
  ) => void,
  onSetDatasourceIds: SetState<Array<number>>,
  onSetParticipationStatus: SetState<string>,
  onSetParticipationEvent: (event: string) => void,
  onSetInputParams: (params: DataSourceInputParams) => void,
};

function ScorecardPanel(props: I18nProps<Props>) {
  const filterOptions = [
    ...getReportingFilters(),
    ...(props.source === 'metric' ? getReportingDefenseFilters() : []),
  ];
  const canApply = useCallback(() => {
    return (
      !props.isLoading &&
      isDataSourceValid(props.dataSource) &&
      !_isEmpty(props.calculation)
    );
  }, [props.isLoading, props.dataSource, props.calculation]);
  const [addAnother, setAddAnother] = useState(false);
  const { isFilterOpen, openFilters, closeFilters } = useIsFiltersOpen(
    props.filters,
    props.isEditMode,
    props.isOpen,
    ['training_session_types', 'event_types']
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

  const enableDataSourceRenderer = window.getFlag('rep-data-source-renderer');

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [props.isOpen, onKeyDown]);

  const renderSource = () => {
    switch (props.source) {
      case TABLE_WIDGET_DATA_SOURCES.metric:
        return (
          <MetricModule
            data-testid="ScorecardPanel|MetricModule"
            calculation={props.calculation}
            calculationParams={props.calculationParams}
            columnTitle={props.rowTitle}
            selectedMetric={props.dataSource?.key_name}
            onSetCalculation={props.onSetCalculation}
            onSetCalculationParam={props.onSetCalculationParam}
            onSetColumnTitle={props.onSetRowTitle}
            onSetMetrics={props.onSetMetrics}
            panelType="row"
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.activity:
        return (
          <ActivityModule
            data-testid="ScorecardPanel|ActivityModule"
            isPanelOpen={props.isOpen}
            panelType="row"
            calculation={props.calculation}
            columnTitle={props.columnTitle}
            onSetCalculation={props.onSetCalculation}
            onSetColumnTitle={props.onSetRowTitle}
            rowTitle={props.rowTitle}
            selectedActivitySource={{
              ids: props.dataSource.ids,
              type: props.dataSource.type,
            }}
            onSetActivitySource={props.onSetActivitySource}
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.availability:
        return (
          <AvailabilityModule
            data-testid="ScorecardPanel|AvailabilityModule"
            isPanelOpen={props.isOpen}
            panelType="row"
            title={props.rowTitle}
            calculation={props.calculation}
            onSetCalculation={props.onSetCalculation}
            onSetTitle={props.onSetRowTitle}
            onSetAvailabilitySource={props.onSetAvailabilitySource}
            selectedAvailabilityStatus={props.dataSource?.status}
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.participation:
        return (
          <ParticipationModule
            data-testid="ScorecardPanel|ParticipationModule"
            isPanelOpen={props.isOpen}
            selectedIds={props.dataSource.ids}
            participationStatus={props.dataSource?.status}
            calculation={props.calculation}
            onSetCalculation={props.onSetCalculation}
            onSetParticipationIds={props.onSetDatasourceIds}
            onSetParticipationStatus={props.onSetParticipationStatus}
            onSetParticipationEvent={props.onSetParticipationEvent}
            panelType="row"
            hideColumnTitle
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.medical:
        return <MedicalModule data-testid="ScorecardPanel|MedicalModule" />;
      case TABLE_WIDGET_DATA_SOURCES.games:
        return (
          <GameActivityModule
            data-testid="ScorecardPanel|GameActivityModule"
            isPanelOpen={props.isOpen}
            panelType="row"
            title={props.rowTitle}
            calculation={props.calculation}
            onSetCalculation={props.onSetCalculation}
            onSetTitle={props.onSetRowTitle}
            positionsIds={props.dataSource?.position_ids}
            selectedEvent={props.dataSource?.kinds || props.dataSource?.result}
            onSetGameActivityKinds={props.onSetGameActivityKinds}
            onSetGameActivityResult={props.onSetGameActivityResult}
            onSetTimeInPositions={props.onSetTimeInPositions}
            onSetTimeInFormation={props.onSetTimeInFormation}
            formationIds={props.dataSource?.formation_ids}
          />
        );
      default:
        return null;
    }
  };

  const renderMedicalModule = () => (
    <MedicalModule data-testid="ComparisonPanel|MedicalModule" />
  );

  return (
    <Panel>
      <Panel.Content>
        {enableDataSourceRenderer ? (
          <DataSourceModuleRenderer
            isOpen={props.isOpen}
            panelType={PANEL_TYPES.row}
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
            onChangeName={props.onSetRowTitle}
            name={props.rowTitle}
            medicalTypeSelector={renderMedicalModule()}
          />
        ) : (
          renderSource()
        )}
        {props.source === 'medical' && (
          <MedicalData data-testid="ScorecardPanel|MedicalData" />
        )}
        {props.source !== 'medical' && (
          <PanelFilters
            data-testid="ScorecardPanel|Filters"
            isOpen={isFilterOpen}
            onClickOpenFilters={openFilters}
            onClickCloseFilters={closeFilters}
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
            data-testid="ScorecardPanel|AddAnother"
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
          data-testid="ScorecardPanel|Apply"
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

export const ScorecardPanelTranslated = withNamespaces()(ScorecardPanel);
export default ScorecardPanel;
