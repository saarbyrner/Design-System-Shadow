import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '@kitman/components';
import {
  setTableRowGameKinds,
  setTableRowGameResult,
  setTableRowTimeInPositions,
  setTableRowStatus,
  setTableRowDataSourceIds,
  setTableRowTimeInFormation,
  setTableRowEventType,
  clickComparisonTableRowPanelApply,
  clickLongitudinalTableRowPanelApply,
  clickScorecardTableRowPanelApply,
  toggleTableRowPanel,
  setTableRowCalculation,
  setTableRowCalculationParam,
  setTableRowDateRange,
  setTableRowMetrics,
  setTableRowPopulation,
  setTableRowTitle,
  setTableRowTimePeriod,
  setTableRowTimePeriodLength,
  setTableRowTimePeriodLengthOffset,
  setTableRowActivity,
  setRowPanelInputParams,
  setTableRowGroupings,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import { setTableElementFilter } from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
  useGetMetricVariablesQuery,
  useGetAllSquadAthletesQuery,
  useGetActiveSquadQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { getTableRowsByTableContainerIdFactory } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/tableWidget';
import { RowPanelTranslated as TableRowPanelComponent } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/RowPanel';

export default (props) => {
  const dispatch = useDispatch();

  const isTableRowPanelOpen = useSelector(
    (state) => state.dashboard.isTableRowPanelOpen
  );
  const tableRowCalculation = useSelector(
    (state) => state.tableWidget.rowPanel.calculation
  );
  const tableRowCalculationParams = useSelector(
    (state) => state.tableWidget.rowPanel.calculation_params
  );
  const rowId = useSelector((state) => state.tableWidget.rowPanel.rowId);
  const isEditMode = useSelector(
    (state) => state.tableWidget.rowPanel.isEditMode
  );
  const tableRowStartDate = useSelector(
    (state) => state.tableWidget.rowPanel.time_scope.start_time
  );
  const tableRowEndDate = useSelector(
    (state) => state.tableWidget.rowPanel.time_scope.end_time
  );
  const dataSource = useSelector(
    (state) => state.tableWidget.rowPanel.dataSource
  );
  const tableRowPopulation = useSelector(
    (state) => state.tableWidget.rowPanel.population
  );
  const tableRowTitle = useSelector(
    (state) => state.tableWidget.rowPanel?.dataSource?.name
  );
  const tableRowTimePeriod = useSelector(
    (state) => state.tableWidget.rowPanel.time_scope.time_period
  );
  const isLoading = useSelector(
    (state) => state.tableWidget.rowPanel.isLoading
  );
  const tableRowTimePeriodLength = useSelector(
    (state) => state.tableWidget.rowPanel.time_scope.time_period_length
  );
  const tableColumnTimePeriodLengthOffset = useSelector(
    (state) => state.tableWidget.rowPanel.time_scope.time_period_length_offset
  );
  const tableType = useSelector((state) => state.tableWidget.tableType);
  const appliedRowDetails = useSelector((state) =>
    getTableRowsByTableContainerIdFactory(state.tableWidget.tableContainerId)(
      state
    )
  );

  const filters = useSelector((state) => state.tableWidget.rowPanel.filters);
  const onSetFilters = (panel, filter, value) => {
    dispatch(setTableElementFilter(panel, filter, value));
  };
  const source = useSelector((state) => state.tableWidget.rowPanel.source);
  const rowPanelConfig = useSelector(
    (state) => state.tableWidget.rowPanel.config
  );

  const { data: activeSquad = { id: null } } = useGetActiveSquadQuery();

  const { data: squadAthletes = { position_groups: [] } } =
    useGetSquadAthletesQuery();
  const { data: squads = [] } = useGetPermittedSquadsQuery();
  // TODO remove this with table-widget-creation-sidepanel-ui
  const { data: availableVariables } = useGetMetricVariablesQuery();
  const { data: allSquadAthletes, isFetching: isLoadingAllSquadAthletes } =
    useGetAllSquadAthletesQuery({ refreshCache: true });

  return (
    <ErrorBoundary>
      <TableRowPanelComponent
        source={source}
        rowId={rowId}
        appliedRows={appliedRowDetails}
        calculation={tableRowCalculation}
        calculationParams={tableRowCalculationParams}
        dateRange={
          tableRowStartDate && tableRowEndDate
            ? {
                start_date: tableRowStartDate,
                end_date: tableRowEndDate,
              }
            : null // NOTE: If null here then will fallback to DateRange for today and call back to onSetDateRange}
        }
        filters={filters}
        isOpen={isTableRowPanelOpen}
        dataSource={dataSource}
        timePeriod={tableRowTimePeriod}
        timePeriodLength={tableRowTimePeriodLength}
        timePeriodLengthOffset={tableColumnTimePeriodLengthOffset}
        isEditMode={isEditMode}
        isLoading={isLoading || isLoadingAllSquadAthletes}
        onSetFilters={onSetFilters}
        onComparisonRowApply={() => {
          dispatch(clickComparisonTableRowPanelApply());
        }}
        onLongitudinalRowApply={(addAnother) => {
          dispatch(clickLongitudinalTableRowPanelApply(addAnother));
        }}
        onScorecardRowApply={(addAnother) => {
          dispatch(clickScorecardTableRowPanelApply(addAnother));
        }}
        onSetCalculation={(calculation) => {
          dispatch(setTableRowCalculation(calculation));
        }}
        onSetCalculationParam={(key, value) =>
          dispatch(setTableRowCalculationParam(key, value))
        }
        onSetDateRange={(range) => dispatch(setTableRowDateRange(range))}
        // TODO remove this with table-widget-creation-sidepanel-ui
        onSetMetrics={(metric) => dispatch(setTableRowMetrics(metric))}
        onSetPopulation={(population) =>
          dispatch(setTableRowPopulation(population))
        }
        onSetGroupings={(params) => dispatch(setTableRowGroupings(params))}
        onSetRowTitle={(title) => dispatch(setTableRowTitle(title))}
        onSetTimePeriod={(timePeriod) =>
          dispatch(setTableRowTimePeriod(timePeriod))
        }
        onSetTimePeriodLength={(timePeriodLength) =>
          dispatch(setTableRowTimePeriodLength(timePeriodLength))
        }
        onSetTimePeriodLengthOffset={(timePeriodLengthOffset) =>
          dispatch(setTableRowTimePeriodLengthOffset(timePeriodLengthOffset))
        }
        onSetGameActivityKinds={(kindsInput) =>
          dispatch(setTableRowGameKinds(kindsInput, 'GameActivity'))
        }
        onSetGameActivityResult={(resultInput) =>
          dispatch(setTableRowGameResult(resultInput, 'GameResultAthlete'))
        }
        onSetTimeInPositions={(positionChange) =>
          dispatch(setTableRowTimeInPositions(positionChange))
        }
        onSetTimeInFormation={(formations) =>
          dispatch(setTableRowTimeInFormation(formations))
        }
        onSetAvailabilitySource={(status, name) => {
          dispatch(setTableRowStatus(status, name, 'Availability'));
        }}
        onSetDatasourceIds={(ids, name) => {
          dispatch(setTableRowDataSourceIds(ids, 'ParticipationLevel', name));
        }}
        onSetParticipationStatus={(status, name) => {
          dispatch(setTableRowStatus(status, name, 'ParticipationLevel'));
        }}
        onSetParticipationEvent={(event) =>
          dispatch(setTableRowEventType(event, 'ParticipationLevel'))
        }
        selectedPopulation={tableRowPopulation}
        rowTitle={tableRowTitle}
        tableType={tableType}
        togglePanel={() => dispatch(toggleTableRowPanel())}
        onSetActivitySource={(ids, type, name) =>
          dispatch(setTableRowActivity(ids, type, name))
        }
        activeSquad={activeSquad}
        onSetInputParams={(params) => {
          dispatch(setRowPanelInputParams(params));
        }}
        {...props}
        availableVariables={availableVariables || []}
        squadAthletes={squadAthletes}
        allSquadAthletes={allSquadAthletes ? allSquadAthletes.squads : []}
        squads={squads}
        rowConfig={rowPanelConfig}
      />
    </ErrorBoundary>
  );
};
