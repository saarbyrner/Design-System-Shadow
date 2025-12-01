// @flow
import { useEffect, useState, useCallback, type Node } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';

import { TextButton, Checkbox } from '@kitman/components';
import { ParticipationModuleTranslated as ParticipationModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ParticipationModule';
import MedicalModule, {
  MedicalData,
} from '@kitman/modules/src/analysis/Dashboard/containers/TableWidget/PanelModules/MedicalModule/Column';
import { ActivityModuleTranslated as ActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ActivityModule';
import { AthleteModuleTranslated as AthleteModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AthleteModule';
import { SquadModuleTranslated as SquadModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/SquadModule';
import { MetricModuleTranslated as MetricModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MetricModule';
import { isDataSourceValid } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import { DataSourceModuleRendererTranslated as DataSourceModuleRenderer } from '@kitman/modules/src/analysis/Dashboard/components/DataSourceModuleRenderer';
import {
  getReportingFilters,
  getReportingDefenseFilters,
  getInputParamsFromSource,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { type SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import { type SquadAthletes } from '@kitman/components/src/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { type SetState } from '@kitman/common/src/types/react';
import {
  type TableWidgetElementSource,
  type TableElementFilters,
  type TableWidgetDataSource,
  type TableWidgetCalculationParams,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  type DataSourceInputParams,
  type Calculation,
  PANEL_TYPES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

import Panel from '../../Panel';
import { useIsFiltersOpen } from '../../PanelFilters/hooks';
import { PanelFiltersTranslated as PanelFilters } from '../../PanelFilters';

type Props = {
  source: TableWidgetDataSource,
  onSetActivitySource: Function,
  calculation: Calculation,
  calculationParams: TableWidgetCalculationParams,
  columnTitle: string,
  dataSource: TableWidgetElementSource,
  filters: TableElementFilters,
  onSetCalculation: Function,
  onSetCalculationParam: Function,
  onSetColumnTitle: Function,
  onSetPopulation: Function,
  onSetFilters: Function,
  onSetMetrics: Function,
  onApply: Function,
  selectedPopulation: SquadAthletesSelection,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  isLoading: boolean,
  isEditMode: boolean,
  isOpen: boolean,
  gameActivityModule: Node,
  availabilityModule: Node,
  onSetDatasourceIds: SetState<Array<number>>,
  onSetParticipationStatus: SetState<string>,
  onSetParticipationEvent: (event: string) => void,
  onSetInputParams: (params: DataSourceInputParams) => void,
};

const emptySquadAthletesSelection = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
};

function LongitudinalPanel(props: I18nProps<Props>) {
  const filterOptions = [
    ...getReportingFilters(),
    ...(props.source === 'metric' ? getReportingDefenseFilters() : []),
  ];
  const canApply = useCallback(() => {
    return (
      !props.isLoading &&
      isDataSourceValid(props.dataSource) &&
      !_isEmpty(props.calculation) &&
      !_isEqual(props.selectedPopulation, emptySquadAthletesSelection)
    );
  }, [
    props.isLoading,
    props.selectedPopulation,
    props.dataSource,
    props.calculation,
  ]);
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

  const renderMedicalModule = () => (
    <MedicalModule data-testid="LongitudinalPanel|MedicalModule" />
  );

  const renderSource = () => {
    switch (props.source) {
      case TABLE_WIDGET_DATA_SOURCES.metric:
        return (
          <MetricModule
            data-testid="LongitudinalPanel|MetricModule"
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
            data-testid="LongitudinalPanel|ActivityModule"
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
            data-testid="LongitudinalPanel|ParticipationModule"
            selectedIds={props.dataSource.ids}
            participationStatus={props.dataSource.status}
            columnTitle={props.columnTitle}
            calculation={props.calculation}
            onSetCalculation={props.onSetCalculation}
            onSetColumnTitle={props.onSetColumnTitle}
            onSetParticipationIds={props.onSetDatasourceIds}
            onSetParticipationStatus={props.onSetParticipationStatus}
            onSetParticipationEvent={props.onSetParticipationEvent}
            panelType="column"
          />
        );
      case TABLE_WIDGET_DATA_SOURCES.medical:
        return <MedicalModule data-testid="LongitudinalPanel|MedicalModule" />;
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
        {window.getFlag('graph-squad-selector') ? (
          <SquadModule
            data-testid="LongitudinalPanel|SquadModule"
            selectedPopulation={[props.selectedPopulation]}
            onSetPopulation={(population) =>
              props.onSetPopulation(population[0])
            }
            showExtendedPopulationOptions
          />
        ) : (
          <AthleteModule
            data-testid="LongitudinalPanel|AthleteModule"
            selectedPopulation={props.selectedPopulation}
            squadAthletes={props.squadAthletes}
            squads={props.squads}
            onSetPopulation={props.onSetPopulation}
          />
        )}

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
        {props.source === 'medical' && (
          <MedicalData data-testid="LongitudinalPanel|MedicalData" />
        )}
        {props.source !== 'medical' && (
          <PanelFilters
            data-testid="LongitudinalPanel|Filters"
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
            data-testid="LongitudinalPanel|AddAnother"
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
          data-testid="LongitudinalPanel|Apply"
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

export const LongitudinalPanelTranslated = withNamespaces()(LongitudinalPanel);
export default LongitudinalPanel;
