// @flow
import { withNamespaces, type ComponentType, type Node } from 'react-i18next';

import { MetricModuleTranslated as MetricModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules//components/MetricModule';
import { ActivityModuleTranslated as ActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ActivityModule';
import { AvailabilityModuleTranslated as AvailabilityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AvailabilityModule';
import { ParticipationModuleTranslated as ParticipationModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ParticipationModule';
import { GameActivityModuleTranslated as GameActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/GameActivityModule';
import { GrowthAndMaturationModuleTranslated as GrowthAndMaturationModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/GrowthAndMaturationModule';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  type DataSource,
  type Calculation,
  type CalculationParams,
  type DataSourceInputParams,
  type PanelType,
  DATA_SOURCE_TYPES,
  PANEL_TYPES,
  DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

type Props = {
  isOpen: boolean,
  panelType?: PanelType,
  name?: string,
  hideColumnTitle?: boolean,
  hideProportionOption?: boolean,
  hideComplexCalcs?: boolean,

  dataSource: DataSource,
  inputParams: Object,
  calculation: Calculation,
  calculationParams: CalculationParams,

  medicalTypeSelector: Node,

  onChangeCalculation: (calculation: Calculation) => void,
  onChangeCalculationParams: (
    key: $Keys<CalculationParams>,
    values: $Values<CalculationParams>
  ) => void,
  addInputParams: (params: DataSourceInputParams) => void,
  onChangeName: (newName: ?string) => void,
};

const DataSourceModuleRenderer = ({
  isOpen,
  panelType,
  name,
  hideColumnTitle,
  hideProportionOption,
  hideComplexCalcs,

  dataSource,
  inputParams,
  addInputParams,
  calculation,
  calculationParams,

  medicalTypeSelector,

  onChangeCalculation,
  onChangeCalculationParams,
  onChangeName,
  t,
}: I18nProps<Props>) => {
  const renderMetricModule = () => {
    const selectedMetric = `${inputParams.source}|${inputParams.variable}`;

    return (
      <MetricModule
        hideColumnTitle={hideColumnTitle}
        panelType={panelType}
        calculation={calculation}
        calculationParams={calculationParams}
        selectedMetric={selectedMetric}
        columnTitle={name}
        onSetColumnTitle={onChangeName}
        onSetCalculation={onChangeCalculation}
        onSetCalculationParam={onChangeCalculationParams}
        onSetMetrics={(metric) => {
          addInputParams({ type: DATA_SOURCE_TYPES.tableMetric, data: metric });
          onChangeName(metric[0].name);
        }}
        hideComplexCalcs={hideComplexCalcs}
      />
    );
  };

  const renderActivityModule = () => {
    return (
      <ActivityModule
        hideColumnTitle={hideColumnTitle}
        isPanelOpen={isOpen}
        calculation={calculation}
        panelType={panelType}
        onSetColumnTitle={onChangeName}
        columnTitle={name}
        onSetCalculation={onChangeCalculation}
        selectedActivitySource={inputParams}
        onSetActivitySource={(values, type, label) => {
          addInputParams({ type, data: [{ ids: values }] });
          if (label) onChangeName(label);
        }}
      />
    );
  };

  const renderAvailabilityModule = () => {
    return (
      <AvailabilityModule
        isPanelOpen={isOpen}
        hideColumnTitle={hideColumnTitle}
        calculation={calculation}
        panelType={panelType}
        title={name}
        onSetTitle={onChangeName}
        onSetCalculation={onChangeCalculation}
        selectedAvailabilityStatus={inputParams.status}
        onSetAvailabilitySource={(status, label) => {
          addInputParams({
            type: DATA_SOURCE_TYPES.availability,
            data: [{ status }],
          });
          if (label) onChangeName(label);
        }}
        hideProportionOption={hideProportionOption}
      />
    );
  };

  const renderParticipationModule = () => {
    const setParticipationEvent = (event) => {
      addInputParams({
        type: DATA_SOURCE_TYPES.participationLevel,
        data: [
          {
            event,
          },
        ],
      });
    };

    const onSetParticipationEvent =
      [PANEL_TYPES.column, PANEL_TYPES.row].includes(panelType) &&
      setParticipationEvent;

    return (
      <ParticipationModule
        isPanelOpen={isOpen}
        data-testid="Charts|ParticipationModule"
        selectedIds={inputParams.participation_level_ids}
        participationStatus={inputParams.status}
        calculation={calculation}
        panelType={panelType}
        columnTitle={name}
        onSetColumnTitle={onChangeName}
        onSetCalculation={onChangeCalculation}
        onSetParticipationIds={(ids, label, status) => {
          addInputParams({
            type: DATA_SOURCE_TYPES.participationLevel,
            data: [
              {
                ids,
                status,
              },
            ],
          });
          if (label) onChangeName(label);
        }}
        onSetParticipationStatus={(status) => {
          addInputParams({
            type: DATA_SOURCE_TYPES.participationLevel,
            data: [
              {
                status,
                ids: inputParams.participation_level_ids ?? [],
              },
            ],
          });
        }}
        onSetParticipationEvent={onSetParticipationEvent}
        hideColumnTitle={hideColumnTitle}
        selectedAvailabilityStatus={inputParams.status}
        hideProportionOption={hideProportionOption}
      />
    );
  };

  const renderGameActivityModule = () => {
    return (
      <GameActivityModule
        isPanelOpen={isOpen}
        hideColumnTitle={hideColumnTitle}
        calculation={calculation}
        panelType={panelType}
        title={name}
        onSetTitle={onChangeName}
        onSetCalculation={onChangeCalculation}
        positionsIds={inputParams.position_ids}
        selectedEvent={inputParams.kinds || inputParams.result}
        onSetGameActivityKinds={(kinds, label) => {
          addInputParams({
            type: DATA_SOURCE_TYPES.gameActivity,
            data: [{ kinds, position_ids: [] }],
          });
          if (label) onChangeName(label);
        }}
        onSetGameActivityResult={(result, label) => {
          addInputParams({
            type: DATA_SOURCE_TYPES.gameResultAthlete,
            data: [{ result }],
          });
          if (label) onChangeName(label);
        }}
        onSetTimeInPositions={(positions) =>
          addInputParams({
            type: DATA_SOURCE_TYPES.gameActivity,
            data: [
              {
                kinds: ['position_change'],
                position_ids: positions,
                formation_ids: [],
              },
            ],
          })
        }
        formationIds={inputParams.formation_ids}
        onSetTimeInFormation={(formations) =>
          addInputParams({
            type: DATA_SOURCE_TYPES.gameActivity,
            data: [
              {
                kinds: ['formation_change'],
                formation_ids: formations,
                position_ids: [],
              },
            ],
          })
        }
      />
    );
  };

  const renderMedicalModule = () => medicalTypeSelector;

  const renderGrowthAndMaturationModule = () => (
    <GrowthAndMaturationModule
      estimate={inputParams.training_variable_ids?.[0]}
      onEstimateChange={(estimateName, estimate) => {
        addInputParams({
          type: DATA_SOURCE_TYPES.maturityEstimate,
          data: [estimate],
        });
        onChangeName(estimateName);
      }}
      calculation={calculation}
      calculationParams={calculationParams}
      onSetCalculation={onChangeCalculation}
      onSetCalculationParam={onChangeCalculationParams}
      panelType={panelType}
    />
  );

  const renderSource = () => {
    if (!dataSource) return null;

    switch (dataSource) {
      case DATA_SOURCES.metric:
        return renderMetricModule();
      case DATA_SOURCES.activity:
        return renderActivityModule();
      case DATA_SOURCES.games:
        return renderGameActivityModule();
      case DATA_SOURCES.availability:
        return renderAvailabilityModule();
      case DATA_SOURCES.participation:
        return renderParticipationModule();
      case DATA_SOURCES.medical:
        return renderMedicalModule();
      case DATA_SOURCES.growthAndMaturation:
        return renderGrowthAndMaturationModule();
      default:
        return t('No module found for selected data source');
    }
  };

  return renderSource();
};

export const DataSourceModuleRendererTranslated: ComponentType<Props> =
  withNamespaces()(DataSourceModuleRenderer);
export default DataSourceModuleRenderer;
