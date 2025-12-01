import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import { OrganisationProvider } from '@kitman/common/src/contexts/OrganisationContext';
import {
  setTableColumnGameKinds,
  setTableColumnGameResult,
  setTableColumnTimeInPositions,
  setTableColumnStatus,
  setTableColumnDataSourceIds,
  setTableColumnTimeInFormation,
  clickComparisonTableColumnPanelApply,
  clickLongitudinalTableColumnPanelApply,
  clickScorecardTableColumnPanelApply,
  toggleTableColumnPanel,
  setTableColumnCalculation,
  setTableColumnCalculationParam,
  setTableColumnDateRange,
  setTableColumnMetrics,
  setTableColumnPopulation,
  setTableColumnTitle,
  setTableColumnTimePeriod,
  setTableColumnActivity,
  setTableColumnEventType,
  setColumnPanelInputParams,
  setTableColumnTimePeriodConfig,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import { ColumnPanelTranslated as TableColumnPanelComponent } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel';
import {
  setTableColumnTimePeriodLength,
  setTableColumnTimePeriodLengthOffset,
  setTableElementFilter,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
  useGetMetricVariablesQuery,
  useGetActiveSquadQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

export default (props) => {
  const dispatch = useDispatch();

  const isTableColumnPanelOpen = useSelector(
    (state) => state.dashboard.isTableColumnPanelOpen
  );
  const tableColumnCalculation = useSelector(
    (state) => state.tableWidget.columnPanel.calculation
  );
  const tableColumnCalculationParams = useSelector(
    (state) => state.tableWidget.columnPanel.calculation_params
  );
  const tableColumnStartDate = useSelector(
    (state) => state.tableWidget.columnPanel.time_scope.start_time
  );
  const tableColumnEndDate = useSelector(
    (state) => state.tableWidget.columnPanel.time_scope.end_time
  );
  const tableColumnDataSource = useSelector(
    (state) => state.tableWidget.columnPanel.dataSource
  );
  const tableColumnPopulation = useSelector(
    (state) => state.tableWidget.columnPanel.population
  );
  const tableColumnTitle = useSelector(
    (state) => state.tableWidget.columnPanel.name
  );
  const tableColumnTimePeriod = useSelector(
    (state) => state.tableWidget.columnPanel.time_scope.time_period
  );
  const tableColumnTimePeriodLength = useSelector(
    (state) => state.tableWidget.columnPanel.time_scope.time_period_length
  );
  const tableColumnTimePeriodLengthOffset = useSelector(
    (state) =>
      state.tableWidget.columnPanel.time_scope.time_period_length_offset
  );
  const tableColumnTimeConfig = useSelector(
    (state) => state.tableWidget.columnPanel.time_scope.config
  );
  const isLoading = useSelector(
    (state) => state.tableWidget.columnPanel.isLoading
  );
  const isEditMode = useSelector(
    (state) => state.tableWidget.columnPanel.isEditMode
  );
  const tableType = useSelector((state) => state.tableWidget.tableType);

  const filters = useSelector((state) => state.tableWidget.columnPanel.filters);
  const source = useSelector((state) => state.tableWidget.columnPanel.source);

  const onSetFilters = (panel, filter, value) => {
    dispatch(setTableElementFilter(panel, filter, value));
  };

  const { data: squadAthletes } = useGetSquadAthletesQuery();
  const { data: squads } = useGetPermittedSquadsQuery();
  // TODO remove this with table-widget-creation-sidepanel-ui
  const { data: availableVariables } = useGetMetricVariablesQuery();
  const { data: currentSquad } = useGetActiveSquadQuery();

  return (
    <OrganisationProvider>
      <ErrorBoundary>
        <TableColumnPanelComponent
          source={source}
          calculation={tableColumnCalculation}
          calculationParams={tableColumnCalculationParams}
          columnTitle={tableColumnTitle}
          isLoading={isLoading}
          isEditMode={isEditMode}
          dateRange={
            tableColumnStartDate && tableColumnEndDate
              ? {
                  start_date: tableColumnStartDate,
                  end_date: tableColumnEndDate,
                }
              : null // NOTE: If null here then will fallback to DateRange for today and call back to onSetDateRange
          }
          isOpen={isTableColumnPanelOpen}
          dataSource={tableColumnDataSource}
          filters={filters}
          selectedPopulation={tableColumnPopulation}
          tableType={tableType}
          timePeriod={tableColumnTimePeriod}
          timePeriodLength={tableColumnTimePeriodLength}
          timePeriodLengthOffset={tableColumnTimePeriodLengthOffset}
          timePeriodConfig={tableColumnTimeConfig}
          onSetFilters={onSetFilters}
          onComparisonColumnApply={(addAnother) => {
            dispatch(clickComparisonTableColumnPanelApply(addAnother));
          }}
          onLongitudinalColumnApply={(addAnother) => {
            dispatch(clickLongitudinalTableColumnPanelApply(addAnother));
          }}
          onScorecardColumnApply={(addAnother) => {
            dispatch(clickScorecardTableColumnPanelApply(addAnother));
          }}
          onSetCalculation={(calculation) => {
            dispatch(setTableColumnCalculation(calculation));
          }}
          onSetCalculationParam={(key, value) =>
            dispatch(setTableColumnCalculationParam(key, value))
          }
          onSetDateRange={(range) => dispatch(setTableColumnDateRange(range))}
          // TODO remove this with table-widget-creation-sidepanel-ui
          onSetMetrics={(metric) => dispatch(setTableColumnMetrics(metric))}
          onSetPopulation={(population) =>
            dispatch(setTableColumnPopulation(population))
          }
          onSetColumnTitle={(title) => dispatch(setTableColumnTitle(title))}
          onSetTimePeriod={(timePeriod) =>
            dispatch(setTableColumnTimePeriod(timePeriod))
          }
          onSetTimePeriodLength={(timePeriodLength) =>
            dispatch(setTableColumnTimePeriodLength(timePeriodLength))
          }
          onSetTimePeriodLengthOffset={(timePeriodLengthOffset) =>
            dispatch(
              setTableColumnTimePeriodLengthOffset(timePeriodLengthOffset)
            )
          }
          onSetTimePeriodConfig={(config) =>
            dispatch(setTableColumnTimePeriodConfig(config))
          }
          onSetGameActivityKinds={(kindsInput) =>
            dispatch(setTableColumnGameKinds(kindsInput, 'GameActivity'))
          }
          onSetGameActivityResult={(resultInput) =>
            dispatch(setTableColumnGameResult(resultInput, 'GameResultAthlete'))
          }
          onSetTimeInPositions={(positionChange) =>
            dispatch(setTableColumnTimeInPositions(positionChange))
          }
          onSetAvailabilitySource={(status) => {
            dispatch(setTableColumnStatus(status, 'Availability'));
          }}
          togglePanel={() => dispatch(toggleTableColumnPanel())}
          onSetActivitySource={(ids, type) =>
            dispatch(setTableColumnActivity(ids, type))
          }
          onSetDatasourceIds={(ids) => {
            dispatch(setTableColumnDataSourceIds(ids, 'ParticipationLevel'));
          }}
          onSetParticipationStatus={(status) => {
            dispatch(setTableColumnStatus(status, 'ParticipationLevel'));
          }}
          onSetTimeInFormation={(formations) =>
            dispatch(setTableColumnTimeInFormation(formations))
          }
          onSetParticipationEvent={(event) =>
            dispatch(setTableColumnEventType(event, 'ParticipationLevel'))
          }
          onSetInputParams={(params) => {
            dispatch(setColumnPanelInputParams(params));
          }}
          {...props}
          availableVariables={availableVariables || []}
          squadAthletes={squadAthletes || { position_groups: [] }}
          currentSquad={currentSquad}
          squads={squads || []}
        />
      </ErrorBoundary>
    </OrganisationProvider>
  );
};
