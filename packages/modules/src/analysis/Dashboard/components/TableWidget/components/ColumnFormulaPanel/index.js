// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEqual from 'lodash/isEqual';

import {
  SlidingPanelResponsive as SlidingPanel,
  Select,
} from '@kitman/components';
import { Box } from '@kitman/playbook/components';
import InputProgressTracker from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnFormulaPanel/components/InputProgressTracker';
import {
  emptyPopulation,
  POPULATION_TYPES,
} from '@kitman/modules/src/analysis/shared/constants';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import {
  getDataTypeDropdownOptions,
  getReportingFilters,
  isValidCalculation,
  getReportingDefenseFilters,
  getMatchDayFilter,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { MetricModuleTranslated as MetricModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MetricModule';
import { GrowthAndMaturationModuleTranslated as GrowthAndMaturationModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/GrowthAndMaturationModule';
import { ActivityModuleTranslated as ActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ActivityModule';
import { ParticipationModuleTranslated as ParticipationModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/ParticipationModule';
import { GameActivityModuleTranslated as GameActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/GameActivityModule';
import { AvailabilityModuleTranslated as AvailabilityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AvailabilityModule';
import { DateRangeModuleTranslated as DateRangeModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule';
import { SquadModuleTranslated as SquadModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/SquadModule';
import { AthleteModuleTranslated as AthleteModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AthleteModule';
import { PanelFiltersTranslated as PanelFilters } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/PanelFilters';
import { TypeSelectorTranslated as TypeSelector } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/TypeSelector';
import { FiltersTranslated as Filters } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/Filters';
import {
  isDateRangeValid,
  isDataSourceValid,
  isValidFormulaGrouping,
} from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type DateRange } from '@kitman/common/src/types';
import { type Squad } from '@kitman/common/src/types/Squad';
import { type SquadAthletes } from '@kitman/components/src/types';
import {
  type FormulaInputParams,
  type TableCalculation,
  type TableWidgetFormulaInput,
  type TableWidgetDataSource,
  type TableWidgetParticipationStatus,
  type UpdateFormulaInput,
  type UpdateFormulaInputDataSource,
  type UpdateFormulaInputElementConfig,
  type TimeScope,
  type UpdateFormulaInputDataSourceSubtype,
  type WidgetType,
  TABLE_WIDGET_DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { type FormulaDetails } from '@kitman/modules/src/analysis/shared/types';
import { isValidSourceForMatchDayFilter } from '@kitman/modules/src/analysis/Dashboard/utils';
import { initialTableWidgetFormulaInput as initialInput } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import { DATA_SOURCE_TYPES } from '@kitman/modules/src/analysis/Dashboard/components/types';

import { FormulaColumnInputPanelTranslated as FormulaColumnInputPanel } from './components/FormulaColumnInputPanel';
import { FormulaChartInputPanelTranslated as FormulaChartInputPanel } from './components/FormulaChartInputPanel';

type Props = {
  isOpen: boolean,
  isEditMode: boolean,
  isLoading: boolean,
  widgetType: WidgetType,
  progressStep: number,
  formulaInputId: string,
  activeFormula: ?FormulaDetails,
  inputs: FormulaInputParams,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  columnName: ?string,
  codingSystemKey?: string,
  updateFormulaInput: (param: UpdateFormulaInput) => void,
  updateFormulaInputElementConfig: (
    param: UpdateFormulaInputElementConfig
  ) => void,
  updateFormulaInputDataSource: (param: UpdateFormulaInputDataSource) => void,
  updateFormulaInputDataSourceSubtype: (
    param: UpdateFormulaInputDataSourceSubtype
  ) => void,
  onNext: () => void,
  onPrevious: () => void,
  onSubmit: () => void,
  onClose: () => void,
  onSetColumnName: (name: string) => void,
};

function ColumnFormulaPanel({
  t,
  formulaInputId,
  updateFormulaInput,
  updateFormulaInputElementConfig,
  updateFormulaInputDataSource,
  updateFormulaInputDataSourceSubtype,
  ...props
}: I18nProps<Props>) {
  const input: TableWidgetFormulaInput = useMemo(() => {
    return (
      props.inputs[formulaInputId] || {
        panel_source: null,
        dataSource: null,
        population: { ...emptyPopulation },
        time_scope: null,
        calculation: null,
        element_config: null,
        population_selection: null,
      }
    );
  }, [props.inputs, formulaInputId]);

  const enableMatchDayFilter =
    window.getFlag('rep-match-day-filter') &&
    isValidSourceForMatchDayFilter(input.panel_source || '');

  const filterOptions = [
    ...getReportingFilters(),
    ...(input?.panel_source === 'metric' ? getReportingDefenseFilters() : []),
    ...(enableMatchDayFilter ? getMatchDayFilter() : []),
  ];

  const inputsCount = props.activeFormula?.inputs.length || 0;
  const panelType = 'column';
  const dateRange: ?DateRange =
    input.time_scope?.start_time && input.time_scope?.end_time
      ? {
          end_date: input.time_scope.end_time,
          start_date: input.time_scope.start_time,
        }
      : null;

  const inputConfig = props.activeFormula?.inputs.find(
    (element) => element.id === formulaInputId
  );

  const allowedPopulations =
    inputConfig?.population_config.supported_types || [];

  const canShowPopulationSelection = allowedPopulations.includes(
    POPULATION_TYPES.squad
  );

  const canShowInheritPopulation = allowedPopulations.includes(
    POPULATION_TYPES.inherit
  );

  const isProgressStepValid = (): boolean => {
    if (props.isLoading) {
      return false;
    }

    if (props.progressStep === inputsCount) {
      return props.columnName != null && props.columnName !== '';
    }

    const dataSourceIsValid = !!(
      input.dataSource && isDataSourceValid(input.dataSource)
    );

    const dateIsValid = isDateRangeValid(
      input.time_scope?.time_period,
      dateRange,
      input.time_scope?.time_period_length
    );
    // TODO: also confirm Offset date range set if selected

    const calculationIsValid = isValidCalculation(
      input.calculation,
      input.element_config?.calculation_params
    );

    const noPopulationCheckNeeded =
      input.population_selection === POPULATION_TYPES.inherit ||
      (!input.population_selection &&
        inputConfig?.population_config.default_value ===
          POPULATION_TYPES.inherit);

    const populationIsValid =
      noPopulationCheckNeeded ||
      !!(input.population && !_isEqual(input.population, emptyPopulation));

    const groupingIsValid =
      props.widgetType === CHART_TYPE.xy && props.progressStep === 0
        ? isValidFormulaGrouping(input.element_config?.groupings)
        : true;

    return (
      dataSourceIsValid &&
      dateIsValid &&
      calculationIsValid &&
      populationIsValid &&
      groupingIsValid
    );
  };

  const renderPanelTitle = () => {
    if (props.isEditMode) {
      return props.activeFormula
        ? t('Edit {{formulaName}} formula', {
            formulaName: props.activeFormula.label,
          })
        : t('Edit formula');
    }

    return props.activeFormula
      ? t('Add {{formulaName}} formula', {
          formulaName: props.activeFormula.label,
        })
      : t('Add formula');
  };

  const getProgressHeadings = () => {
    return [
      ...(props.activeFormula
        ? props.activeFormula.inputs.map((element) => element.label)
        : []),
      [CHART_TYPE.value, CHART_TYPE.xy].includes(props.widgetType)
        ? t('Display options')
        : t('Add column title'),
    ];
  };

  const metricModule = (
    <MetricModule
      data-testid="ColumnFormulaPanel|MetricModule"
      hideColumnTitle
      calculation={input.calculation}
      calculationParams={input.element_config?.calculation_params}
      selectedMetric={input.dataSource?.key_name}
      onSetCalculation={(value: TableCalculation) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            calculation: value,
          },
        })
      }
      onSetCalculationParam={(key, value) => {
        updateFormulaInputElementConfig({
          formulaInputId,
          configKey: 'calculation_params',
          properties: {
            [key]: value,
          },
        });
      }}
      onSetMetrics={(metrics: Array<{ name: string, key_name: string }>) => {
        // TODO: we only process a single metric selection, so why array?
        if (metrics?.length) {
          const firstMetricKeyName = metrics[0].key_name;
          updateFormulaInputDataSource({
            formulaInputId,
            properties: {
              type: 'TableMetric',
              key_name: firstMetricKeyName,
              source: firstMetricKeyName.split('|')[0],
              variable: firstMetricKeyName.split('|')[1],
            },
          });
        }
      }}
      panelType="formula"
    />
  );

  const activityModule = (
    <ActivityModule
      data-testid="ColumnFormulaPanel|ActivityModule"
      isPanelOpen={props.isOpen}
      hideColumnTitle
      panelType={panelType}
      calculation={input.calculation}
      onSetCalculation={(value: TableCalculation) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            calculation: value,
          },
        })
      }
      selectedActivitySource={{
        ids: input.dataSource?.ids,
        type: input.dataSource?.type,
      }}
      onSetActivitySource={(ids: number[], type: TableWidgetDataSource) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            ids,
            type,
          },
        });
      }}
    />
  );

  const participationModule = (
    <ParticipationModule
      data-testid="ColumnFormulaPanel|ParticipationModule"
      isPanelOpen={props.isOpen}
      hideColumnTitle
      selectedIds={input.dataSource?.ids}
      participationStatus={input.dataSource?.status}
      calculation={input.calculation}
      onSetCalculation={(value: TableCalculation) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            calculation: value,
          },
        })
      }
      onSetParticipationIds={(ids: number[]) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            ids,
            type: 'ParticipationLevel',
          },
        });
      }}
      onSetParticipationStatus={(status: TableWidgetParticipationStatus) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            status,
            type: 'ParticipationLevel',
          },
        });
      }}
      panelType={panelType}
      hideProportionOption
      hidePercentageOption
    />
  );

  const gameActivityModule = (
    <GameActivityModule
      data-testid="ColumnFormulaPanel|GameActivityModule"
      isPanelOpen={props.isOpen}
      hideColumnTitle
      panelType={panelType}
      calculation={input.calculation || ''}
      onSetCalculation={(value: TableCalculation) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            calculation: value,
          },
        })
      }
      positionsIds={input.dataSource?.position_ids}
      formationIds={input.dataSource?.formation_ids}
      selectedEvent={input.dataSource?.kinds || input.dataSource?.result}
      onSetGameActivityKinds={(kinds: string | Array<string>) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            kinds: [...kinds],
            result: null,
            type: 'GameActivity',
          },
        });
      }}
      onSetGameActivityResult={(result: string) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            result,
            kinds: null,
            type: 'GameResultAthlete',
          },
        });
      }}
      onSetTimeInFormation={(formationIds: Array<string>) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            formation_ids: [...formationIds],
          },
        });
      }}
      onSetTimeInPositions={(positionIds: Array<string>) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            position_ids: [...positionIds],
          },
        });
      }}
    />
  );

  const availabilityModule = (
    <AvailabilityModule
      data-testid="ColumnFormulaPanel|AvailabilityModule"
      isPanelOpen={props.isOpen}
      hideColumnTitle
      panelType={panelType}
      selectedAvailabilityStatus={input.dataSource?.status}
      calculation={input.calculation}
      onSetCalculation={(value: TableCalculation) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            calculation: value,
          },
        })
      }
      onSetAvailabilitySource={(status: string) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            status,
            type: 'Availability',
          },
        });
      }}
      hideProportionOption
      hidePercentageOption
    />
  );

  const medicalTypeSelector = (
    <TypeSelector
      selectedType={input.dataSource?.type ?? 'MedicalInjury'}
      setSelectedType={(newType) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            type: newType,
          },
        });
      }}
      hideIllness={
        props.codingSystemKey === codingSystemKeys.CLINICAL_IMPRESSIONS
      }
    />
  );

  const growthAndMaturationModule = (
    <GrowthAndMaturationModule
      estimate={input.dataSource?.training_variable_ids?.[0]}
      onEstimateChange={(_, estimate) => {
        updateFormulaInputDataSource({
          formulaInputId,
          properties: {
            type: DATA_SOURCE_TYPES.maturityEstimate,
            training_variable_ids: [estimate],
          },
        });
      }}
      calculation={input.calculation}
      calculationParams={input.element_config?.calculation_params}
      onSetCalculation={(value: TableCalculation) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            calculation: value,
          },
        })
      }
      onSetCalculationParam={(key, value) => {
        updateFormulaInputElementConfig({
          formulaInputId,
          configKey: 'calculation_params',
          properties: {
            [key]: value,
          },
        });
      }}
      panelType={panelType}
    />
  );

  const dateRangeModule = (
    <DateRangeModule
      key={formulaInputId}
      data-testid="ColumnFormulaPanel|DateRangeModule"
      title={t('Time range')}
      dateRange={dateRange}
      onSetDateRange={(value: ?DateRange) => {
        const updatedTimeScope: TimeScope = { ...input.time_scope };
        if (updatedTimeScope?.start_time && !value?.start_date) {
          delete updatedTimeScope.start_time;
        }
        if (updatedTimeScope?.end_time && !value?.end_date) {
          delete updatedTimeScope.end_time;
        }

        const range =
          value?.start_date && value?.end_date
            ? { start_time: value.start_date, end_time: value.end_date }
            : {};

        updateFormulaInput({
          formulaInputId,
          properties: {
            time_scope: { ...updatedTimeScope, ...range },
          },
        });
      }}
      onSetTimePeriod={(value: string) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            time_scope: {
              ...(input.time_scope || {}),
              time_period: value,
            },
          },
        })
      }
      onSetTimePeriodLength={(value: ?number) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            time_scope: {
              ...(input.time_scope || {}),
              time_period_length: value,
            },
          },
        })
      }
      onSetTimePeriodLengthOffset={(value: ?number) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            time_scope: {
              ...(input.time_scope || {}),
              time_period_length_offset: value,
            },
          },
        })
      }
      timePeriod={input.time_scope?.time_period}
      timePeriodLength={input.time_scope?.time_period_length}
      timePeriodLengthOffset={input.time_scope?.time_period_length_offset}
      hideLastXEvents
    />
  );

  const areFiltersPresent = (): boolean => {
    if (input.element_config?.filters) {
      const filters = input.element_config.filters;
      const searchKeys = ['training_session_types', 'event_types'];
      const configKeys = Object.keys(filters);

      if (
        searchKeys.some((key) =>
          configKeys.includes(key) && Array.isArray(filters[key])
            ? filters[key].length > 0
            : filters[key] != null
        )
      ) {
        return true;
      }
    }

    return false;
  };

  const panelFilterMedical =
    input.panel_source && input.panel_source === 'medical' ? (
      <Filters
        key={`medical-filter-${formulaInputId}`}
        selectedType={input.dataSource?.type}
        direction="column"
        subtypes={input.dataSource?.subtypes || {}}
        onChangeSubType={(subtypeKey, value) => {
          updateFormulaInputDataSourceSubtype({
            formulaInputId,
            properties: {
              subtypeKey,
              value,
            },
          });
        }}
        onChangeFilterSubType={(key, value) => {
          updateFormulaInputElementConfig({
            formulaInputId,
            configKey: 'filters',
            properties: {
              [key]: value,
            },
          });
        }}
        filterSubTypes={input.element_config?.filters || {}}
      />
    ) : null;

  const panelFiltersUI =
    input.panel_source && input.panel_source !== 'medical' ? (
      <PanelFilters
        key={`panel-filter-${formulaInputId}`}
        data-testid="ColumnFormulaPanel|Filters"
        isOpen={areFiltersPresent() || input.isPanelFiltersOpen}
        onClickOpenFilters={() => {
          updateFormulaInput({
            formulaInputId,
            properties: {
              isPanelFiltersOpen: true,
            },
          });
        }}
        onClickCloseFilters={() => {
          updateFormulaInputElementConfig({
            formulaInputId,
            configKey: 'filters',
            properties: {
              training_session_types: [],
              event_types: [],
            },
          });
          updateFormulaInput({
            formulaInputId,
            properties: {
              isPanelFiltersOpen: false,
            },
          });
        }}
        selectedSessionTypes={
          input.element_config?.filters?.training_session_types || []
        }
        noChangeOnUnload
        selectedEventTypes={input.element_config?.filters?.event_types || []}
        supportedFilters={filterOptions}
        filters={input.element_config?.filters}
        onSetFilters={(filterKey, value) => {
          updateFormulaInputElementConfig({
            formulaInputId,
            configKey: 'filters',
            properties: {
              [filterKey]: value,
            },
          });
        }}
      />
    ) : null;

  const getActiveSourceModule = () => {
    switch (input.panel_source) {
      case TABLE_WIDGET_DATA_SOURCES.metric:
        return metricModule;
      case TABLE_WIDGET_DATA_SOURCES.activity:
        return activityModule;
      case TABLE_WIDGET_DATA_SOURCES.participation:
        return participationModule;
      case TABLE_WIDGET_DATA_SOURCES.availability:
        return availabilityModule;
      case TABLE_WIDGET_DATA_SOURCES.games:
        return gameActivityModule;
      case TABLE_WIDGET_DATA_SOURCES.medical:
        return medicalTypeSelector;
      case TABLE_WIDGET_DATA_SOURCES.growthAndMaturation:
        return growthAndMaturationModule;
      default:
        return null;
    }
  };

  const populationUI = window.getFlag('graph-squad-selector') ? (
    <SquadModule
      data-testid="ColumnFormulaPanel|SquadModule"
      selectedPopulation={[input.population || { ...emptyPopulation }]}
      onSetPopulation={(population) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            // NOTE: The updated population here is an array
            population: population[0],
          },
        })
      }
      label={t('Population')}
      showExtendedPopulationOptions
    />
  ) : (
    <AthleteModule
      data-testid="ColumnFormulaPanel|AthleteModule"
      selectedPopulation={input.population || { ...emptyPopulation }}
      squadAthletes={props.squadAthletes}
      squads={props.squads}
      onSetPopulation={(population) =>
        updateFormulaInput({
          formulaInputId,
          properties: {
            population, // NOTE: The updated population here is NOT an array
          },
        })
      }
      label={t('Population')}
    />
  );

  const dataTypeSelection = (
    <Select
      options={getDataTypeDropdownOptions()}
      onChange={(selected) => {
        updateFormulaInput({
          formulaInputId,
          properties: {
            panel_source: selected,
            dataSource: {},
            element_config: initialInput.element_config,
          },
        });
      }}
      value={input.panel_source || null}
      searchable
    />
  );

  const renderPanel = () => {
    const commonProps = {
      isOpen: props.isOpen,
      isLoading: props.isLoading,
      columnName: props.columnName,
      isEditMode: false,
      canShowPopulationSelection,
      formulaInputId,
      squadAthletes: props.squadAthletes,
      squads: props.squads,
      isFinalStep: props.progressStep === inputsCount,
      canGoPrevious: props.progressStep > 0,
      onSetColumnName: props.onSetColumnName,
      onNext: props.onNext,
      onPrevious: props.onPrevious,
      onSubmit: props.onSubmit,
      input,
      inputConfig,
      updateFormulaInput,
      isStepValid: isProgressStepValid(),
      activeSourceModule: getActiveSourceModule(),
      dateRangeModule,
      dataTypeSelection,
      populationUI,
      panelFiltersUI,
      panelFilterMedical,
    };

    const chartProps = {
      ...commonProps,
      codingSystemKey: props.codingSystemKey,
      activeFormula: props.activeFormula,
      canShowInheritPopulation: false,
    };

    switch (props.widgetType) {
      case 'COMPARISON':
        return (
          <FormulaColumnInputPanel
            {...commonProps}
            data-testid="ColumnFormulaPanel|FormulaInputPanel"
            canShowInheritPopulation={canShowInheritPopulation}
          />
        );
      case CHART_TYPE.value:
        return (
          <FormulaChartInputPanel
            {...chartProps}
            data-testid="ColumnFormulaPanel|FormulaChartInputPanel"
          />
        );
      case CHART_TYPE.xy:
        return (
          <FormulaChartInputPanel
            {...chartProps}
            data-testid="ColumnFormulaPanel|FormulaXYChartInputPanel"
            widgetType={props.widgetType}
            updateFormulaInputElementConfig={updateFormulaInputElementConfig}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      css={{
        '.slidingPanel__title': {
          marginLeft: '20px',
          fontSize: '18px',
        },
      }}
    >
      <SlidingPanel
        data-testid="ColumnFormulaPanel|SlidingPanel"
        isOpen={props.isOpen}
        title={renderPanelTitle()}
        onClose={props.onClose}
      >
        <Box mt={2}>
          <InputProgressTracker
            headings={getProgressHeadings()}
            currentHeadingId={props.progressStep + 1}
          />
        </Box>
        <Panel.Divider />
        {renderPanel()}
      </SlidingPanel>
    </div>
  );
}

export default ColumnFormulaPanel;
export const ColumnFormulaPanelTranslated =
  withNamespaces()(ColumnFormulaPanel);
