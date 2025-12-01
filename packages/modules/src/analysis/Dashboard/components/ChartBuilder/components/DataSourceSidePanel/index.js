// @flow
import { useMemo, useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { InputTextField, SlidingPanel } from '@kitman/components';
import {
  Button,
  Box,
  Collapse,
  Alert,
  AlertTitle,
} from '@kitman/playbook/components';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import {
  addCalculation,
  addCalculationParams,
  addPopulation,
  addTimeScope,
  addInputParams,
  addFilter,
  addRenderOptions,
  updateFormStateType,
  setDataSourceSubtype,
  addDataSourceGroupingByIndex,
  deleteDataSourceGrouping,
  toggleChartFormattingPanel,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import {
  getDataSourceFormState,
  getTimeScope,
  getWidgetIdFromSidePanel,
  getChartTypeByWidgetId,
  getFiltersByType,
  getChartElementName,
  getSidePanelSource,
  getChartElementType,
  getLoaderLevelByWidgetId,
  getDataSourceGroupingByIndex,
  getIsChartFormattingPanelOpen,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import { TypeSelectorTranslated as TypeSelector } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/TypeSelector';
import { SquadModuleTranslated as SquadModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/SquadModule';
import { DateRangeModuleTranslated as DateRangeModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import { SessionTypeFilterTranslated as SessionTypeFilter } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/PanelFilters/components/SessionTypeFilter';
import { MatchDayFilterTranslated as MatchDayFilter } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/PanelFilters/components/MatchDayFilter';
import { FiltersTranslated as Filters } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/Filters';
import {
  formatDataSourceInputParams,
  isValidSourceForMatchDayFilter,
  isValidSourceForSessionTypeFilter,
} from '@kitman/modules/src/analysis/Dashboard/utils';
import { isSidePanelButtonDisabled } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { DataSourceModuleRendererTranslated as DataSourceModuleRenderer } from '@kitman/modules/src/analysis/Dashboard/components/DataSourceModuleRenderer';
import {
  getChartType,
  getChartData,
} from '@kitman/common/src/utils/TrackingData/src/data/analysis/getChartEventData';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

import type {
  TimeScopeOption,
  AddDataSourceGrouping,
} from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import { DATA_SOURCES } from '@kitman/modules/src/analysis/Dashboard/components/types';
import { unsupportedMetrics } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/constants';
import { GroupingModuleTranslated as GroupingModule } from './components/GroupingModule';
import { SeriesVisualisationModuleTranslated as SeriesVisualisationModule } from './components/SeriesVisualisationModule';
import { SidePanelButtonsTranslated as SidePanelButtons } from './components/SidePanelButtons';
import { ChartFormattingPanelTranslated as ChartFormattingPanel } from '../FormattingPanel';

type Props = {
  isOpen: boolean,
  togglePanel: () => void,
  label?: string,
  customStyles?: ObjectStyle,
};

export const styles = {
  alert: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '4.3rem',
    zIndex: 1000,
    marginLeft: '1rem',
    '.MuiPaper-root': {
      marginRight: '2rem',
    },
  },
};

const DataSourceSidePanel = ({ isOpen, togglePanel, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const { organisation } = useOrganisation();
  const { trackEvent } = useEventTracking();
  const codingSystemKey = organisation.coding_system_key;
  const isCI = codingSystemKey === codingSystemKeys.CLINICAL_IMPRESSIONS;

  const dataSourceFormState = useSelector(getDataSourceFormState);
  const timescope = useSelector(getTimeScope);
  const widgetId = useSelector(getWidgetIdFromSidePanel);
  const chartType = useSelector(getChartTypeByWidgetId(widgetId));
  const sessionFilters = useSelector(
    getFiltersByType('training_session_types')
  );
  const eventFilters = useSelector(getFiltersByType('event_types'));
  const matchDayFilters = useSelector(getFiltersByType('match_days'));
  const chartElementName = useSelector(getChartElementName);
  const sidePanelSource = useSelector(getSidePanelSource);

  const seriesType = useSelector(getChartElementType);
  const primaryGrouping = useSelector(getDataSourceGroupingByIndex(0));
  const secondaryGrouping = useSelector(getDataSourceGroupingByIndex(1));
  const loaderLevel: number = useSelector(getLoaderLevelByWidgetId(widgetId));

  const isChartFormattingPanelOpen = useSelector(getIsChartFormattingPanelOpen);
  const conditionalFormattingOptions =
    dataSourceFormState?.config?.render_options?.conditional_formatting;
  const showConditionalFormattingPanel =
    window.getFlag('rep-charts-conditional-formatting') &&
    chartType === CHART_TYPE.xy;

  const isMedicalSource = sidePanelSource === 'medical';

  const [openAlert, setOpenAlert] = useState(true);

  const onSetPopulation = (population) => {
    if (population[0]) {
      dispatch(addPopulation(population[0]));
    } else {
      dispatch(addPopulation(EMPTY_SELECTION));
    }
  };

  const onSetTimeScope = (key: TimeScopeOption, value: string | number) =>
    dispatch(addTimeScope({ key, value }));

  const showSecondaryGrouping = chartType === CHART_TYPE.xy;

  const formattedDataSourceFormState = useMemo(
    () => ({
      ...dataSourceFormState,
      input_params: formatDataSourceInputParams(
        dataSourceFormState.input_params,
        dataSourceFormState.data_source_type,
        codingSystemKey
      ),
    }),
    [dataSourceFormState, codingSystemKey]
  );

  const isButtonDisabled = isSidePanelButtonDisabled(
    chartType,
    dataSourceFormState
  );

  const showDateRangeLastOptions =
    sidePanelSource === DATA_SOURCES.metric &&
    !unsupportedMetrics.includes(dataSourceFormState.input_params?.source);

  const onSuccess = () => {
    const matchDay = dataSourceFormState.config?.filters?.match_days;
    const { population, config, time_scope: time } = dataSourceFormState;
    // axisConfig can be undefined when FF is off
    const axisConfig = config?.render_options?.axis_config;

    if (matchDay?.length) {
      trackEvent(reportingEventNames.gameDay, getChartType({ chartType }));
    }

    trackEvent(
      reportingEventNames.createChart,
      getChartData({
        seriesType,
        chartType,
        population,
        groupings: config?.groupings,
        timePeriod: time?.time_period,
        axisConfig,
      })
    );
  };

  const renderMedicalModule = () => {
    const sourceType =
      dataSourceFormState.type || dataSourceFormState.data_source_type;

    const updateRenderOptions = (type: string) => {
      let defaultName = t('Medical');
      switch (type) {
        case 'MedicalInjury':
          defaultName = t('Injuries');
          break;
        case 'MedicalIllness':
          defaultName = t('Illnesses');
          break;
        case 'RehabSessionExercise':
          defaultName = t('Rehab exercises');
          break;
        default:
          defaultName = t('Medical');
          break;
      }
      dispatch(
        addRenderOptions({
          key: 'name',
          value: defaultName,
        })
      );
    };

    if (!chartElementName && sourceType && isMedicalSource) {
      updateRenderOptions(sourceType);
    }

    return (
      <TypeSelector
        hideIllness={isCI}
        selectedType={sourceType}
        setSelectedType={(type) => {
          dispatch(updateFormStateType(type));
          if (type) updateRenderOptions(type);
        }}
      />
    );
  };

  const isValueChart = chartType === 'value';

  const isLoaderLevelLong = loaderLevel === LOADING_LEVEL.LONG_LOAD;
  const isSessionTypeFilterShown =
    isValidSourceForSessionTypeFilter(sidePanelSource);
  const isMatchDayFilterShown = isValidSourceForMatchDayFilter(sidePanelSource);
  const areFiltersShown = [
    isLoaderLevelLong,
    isMedicalSource,
    isSessionTypeFilterShown,
    isMatchDayFilterShown,
  ].some(Boolean);

  return (
    <>
      <SlidingPanel
        isOpen={isOpen}
        align="right"
        togglePanel={togglePanel}
        title="Add Metric"
      >
        <Panel>
          <Panel.Content>
            {!isValueChart && (
              <>
                <Panel.SectionTitle>{t('Visualisation')} </Panel.SectionTitle>
                <SeriesVisualisationModule widgetId={widgetId} />
                <Panel.Divider />
              </>
            )}
            <Panel.SectionTitle>{t('Dimensions')} </Panel.SectionTitle>
            <DataSourceModuleRenderer
              hideColumnTitle
              isOpen={isOpen}
              hideProportionOption={chartType !== CHART_TYPE.value}
              hideComplexCalcs={chartType === CHART_TYPE.pie}
              dataSource={sidePanelSource}
              calculation={dataSourceFormState.calculation}
              onChangeCalculation={(calculation) =>
                dispatch(addCalculation(calculation))
              }
              calculationParams={dataSourceFormState.config?.calculation_params}
              onChangeCalculationParams={(key, value) =>
                dispatch(
                  addCalculationParams({
                    [`${key}`]: value,
                  })
                )
              }
              inputParams={dataSourceFormState.input_params}
              addInputParams={(params) => {
                dispatch(addInputParams(params));
              }}
              onChangeName={(name) =>
                dispatch(addRenderOptions({ key: 'name', value: name }))
              }
              medicalTypeSelector={renderMedicalModule()}
            />
            <SquadModule
              key={String(dataSourceFormState?.id)}
              selectedPopulation={[dataSourceFormState.population]}
              onSetPopulation={(population) => onSetPopulation(population)}
              enableMultiSelect
              showExtendedPopulationOptions={window.getFlag(
                'rep-labels-and-groups'
              )}
              isMultiSelect
            />
            <DateRangeModule
              dateRange={
                timescope.start_time && timescope.end_time
                  ? {
                      start_date: timescope.start_time,
                      end_date: timescope.end_time,
                    }
                  : null // NOTE: If null here then will fallback to DateRange for today and call back to onSetDateRange
              }
              onSetDateRange={(dateRange) => {
                onSetTimeScope('start_time', dateRange.start_date);
                onSetTimeScope('end_time', dateRange.end_date);
              }}
              timePeriod={timescope.time_period}
              onSetTimePeriod={(timePeriod) =>
                onSetTimeScope('time_period', timePeriod)
              }
              timePeriodLength={timescope.time_period_length}
              onSetTimePeriodLength={(timePeriodLength) =>
                onSetTimeScope('time_period_length', timePeriodLength)
              }
              timePeriodLengthOffset={timescope.time_period_length_offset}
              onSetTimePeriodLengthOffset={(lengthOffset) =>
                onSetTimeScope('time_period_length_offset', lengthOffset)
              }
              onSetTimePeriodConfig={(config) => {
                onSetTimeScope('config', config);
              }}
              showLastGamesAndSessions={showDateRangeLastOptions}
              config={timescope?.config}
            />
            <Panel.Field>
              <InputTextField
                label={t('Name')}
                inputType="text"
                value={chartElementName}
                onChange={(e) => {
                  dispatch(
                    addRenderOptions({
                      key: 'name',
                      value: e.currentTarget.value,
                    })
                  );
                }}
                kitmanDesignSystem
              />
            </Panel.Field>
            <Panel.Divider />
            {!isValueChart && (
              <>
                <Panel.SectionTitle dataAttribute="chart_builder_groupings_selector">
                  {t('Groupings')}{' '}
                </Panel.SectionTitle>
                <GroupingModule
                  withSecondaryGrouping={showSecondaryGrouping}
                  seriesType={seriesType}
                  label={t('on the axis')}
                  dataSourceType={dataSourceFormState.data_source_type}
                  primaryGrouping={primaryGrouping}
                  secondaryGrouping={secondaryGrouping}
                  widgetId={widgetId}
                  dataSourceFormState={dataSourceFormState}
                  addDataSourceGrouping={(param: AddDataSourceGrouping) => {
                    dispatch(addDataSourceGroupingByIndex(param));
                  }}
                  deleteDataSourceGrouping={() => {
                    dispatch(deleteDataSourceGrouping());
                  }}
                />
                <Panel.Divider />
              </>
            )}
            {areFiltersShown && (
              <Panel.SectionTitle>{t('Filters')} </Panel.SectionTitle>
            )}
            {isLoaderLevelLong && (
              <Box sx={{ width: '100%' }} css={styles.alert}>
                <Collapse in={openAlert}>
                  <Alert
                    color="warning"
                    severity="warning"
                    variant="standard"
                    onClose={() => setOpenAlert(false)}
                    sx={{
                      mb: 2,
                    }}
                  >
                    <AlertTitle>
                      {t('Large dataset. Preview is taking a while...')}
                    </AlertTitle>
                    {t(
                      'Wait or continue without a preview. You can still save the chart and view it when it’s ready.'
                    )}
                  </Alert>
                </Collapse>
              </Box>
            )}
            {isMedicalSource ? (
              <Filters
                selectedType={
                  dataSourceFormState.type ||
                  dataSourceFormState.data_source_type
                }
                subtypes={dataSourceFormState.input_params.subtypes ?? {}}
                onChangeSubType={(subtypeKey, value) => {
                  dispatch(
                    setDataSourceSubtype({
                      data: { subtypeKey, value },
                    })
                  );
                }}
                onChangeFilterSubType={(subtypeKey, value) => {
                  dispatch(addFilter({ type: subtypeKey, value }));
                }}
                filterSubTypes={dataSourceFormState.config?.filters}
                hideTitle
              />
            ) : (
              <>
                {isSessionTypeFilterShown && (
                  <SessionTypeFilter
                    onSelectSessionTypes={(value) =>
                      dispatch(
                        addFilter({ type: 'training_session_types', value })
                      )
                    }
                    onSelectEventTypes={(value) =>
                      dispatch(addFilter({ type: 'event_types', value }))
                    }
                    selectedSessionTypes={sessionFilters}
                    selectedEventTypes={eventFilters}
                  />
                )}
                {isMatchDayFilterShown &&
                  window.getFlag('rep-match-day-filter') && (
                    <MatchDayFilter
                      data-testid="MatchDayFilter"
                      selectedMatchDays={matchDayFilters}
                      onSelectMatchDays={(value) =>
                        dispatch(addFilter({ type: 'match_days', value }))
                      }
                    />
                  )}
              </>
            )}

            {areFiltersShown && <Panel.Divider />}

            {showConditionalFormattingPanel && (
              <>
                <Panel.SectionTitle dataAttribute="chart_builder_conditional_formatting_selector">
                  {t('Conditional formatting')}
                </Panel.SectionTitle>
                <Box
                  sx={{
                    marginLeft: '1rem',
                  }}
                >
                  <Button
                    color="secondary"
                    size="small"
                    disabled={false}
                    onClick={() =>
                      dispatch(
                        toggleChartFormattingPanel({
                          isOpen: !isChartFormattingPanelOpen,
                        })
                      )
                    }
                  >
                    {conditionalFormattingOptions?.length > 0
                      ? t('Edit formatting rules ({{count}})', {
                          count: conditionalFormattingOptions.length,
                        })
                      : t('Add formatting rule')}
                  </Button>
                </Box>
                <Panel.Divider />
              </>
            )}
          </Panel.Content>
          <SidePanelButtons
            chartType={chartType}
            widgetId={widgetId}
            dataSourceFormState={formattedDataSourceFormState}
            isButtonDisabled={isButtonDisabled}
            onSuccess={onSuccess}
          />
        </Panel>
      </SlidingPanel>
      <ChartFormattingPanel
        isOpen={isChartFormattingPanelOpen}
        togglePanel={() =>
          dispatch(
            toggleChartFormattingPanel({
              isOpen: !getIsChartFormattingPanelOpen,
            })
          )
        }
        canViewMetrics={false}
      />
    </>
  );
};

export const DataSourceSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(DataSourceSidePanel);

export default DataSourceSidePanel;
