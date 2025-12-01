// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';

import {
  AthleteSelector,
  DateRangePicker,
  Dropdown,
  GroupedDropdown,
  LastXDaysSelector,
  LastXPeriodOffset,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import { formatAvailableVariablesForGroupedDropdown } from '@kitman/common/src/utils/formatAvailableVariables';
import { buildEventTypeTimePeriodOptions } from '@kitman/modules/src/analysis/shared/utils';
import { getCalculationDropdownOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel';
import { LongitudinalPanelTranslated as LongitudinalPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/RowPanel/components/LongitudinalPanel';
import { ScorecardPanelTranslated as ScorecardPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/RowPanel/components/ScorecardPanel';
import { ComparisonPanelTranslated as ComparisonPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/RowPanel/components/ComparisonPanel';
import { getDateRangeForToday } from '@kitman/common/src/utils/dateRange';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { SetState } from '@kitman/common/src/types/react';
import type { StatusVariable, DateRange } from '@kitman/common/src/types';
import type { SquadAthletes } from '@kitman/components/src/types';
import type {
  SquadAthletes as AllSquadAthletes,
  SquadAthletesSelection,
} from '@kitman/components/src/Athletes/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type {
  InputParams,
  Calculation,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import type {
  RowGroupingParams,
  TableWidgetType,
  TableWidgetMetric,
  TableWidgetRow,
  TableElementFilters,
  TableWidgetDataSource,
  TableWidgetCalculationParams,
  RowPanelConfig,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

type Props = {
  rowId: number,
  activeSquad: { id: null | number, name: string },
  source: TableWidgetDataSource,
  appliedRows: Array<TableWidgetRow>,
  availableVariables: Array<StatusVariable>,
  calculation: Calculation,
  calculationParams: TableWidgetCalculationParams,
  dateRange: ?DateRange,
  isOpen: boolean,
  isEditMode: boolean,
  isLoading: boolean,
  dataSource: Array<TableWidgetMetric>,
  onComparisonRowApply: Function,
  onLongitudinalRowApply: Function,
  onScorecardRowApply: Function,
  onSetCalculation: Function,
  onSetCalculationParam: Function,
  onSetDateRange: Function,
  onSetMetrics: Function,
  onSetPopulation: Function,
  onSetRowTitle: Function,
  onSetTimePeriod: Function,
  onSetTimePeriodLength: Function,
  onSetTimePeriodLengthOffset: Function,
  onSetAvailabilitySource: Function,
  onSetGameActivityKinds: (kind: string | Array<string>) => void,
  onSetGameActivityResult: (result: string) => void,
  onSetTimeInPositions: (positionIds: Array<string>) => void,
  onSetTimeInFormation: (formationIds: Array<string>) => void,
  rowTitle: string,
  selectedPopulation: SquadAthletesSelection[],
  squadAthletes: SquadAthletes,
  allSquadAthletes: AllSquadAthletes,
  squads: Array<Squad>,
  tableType: TableWidgetType,
  timePeriod: string,
  timePeriodLength: ?number,
  timePeriodLengthOffset: ?number,
  togglePanel: Function,
  turnaroundList: Array<Turnaround>,
  onSetActivitySource: Function,
  filters: TableElementFilters,
  rowConfig: RowPanelConfig,
  onSetFilters: Function,
  onSetDatasourceIds: SetState<Array<number>>,
  onSetParticipationStatus: SetState<string>,
  onSetParticipationEvent: (event: string) => void,
  onSetInputParams: (params: InputParams) => void,
  onSetGroupings: (params: RowGroupingParams) => void,
};

const emptyPopulation = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
  context_squads: [],
};

function RowPanel(props: I18nProps<Props>) {
  const [step, setStep] = useState('STEP_ONE');
  const [dateRangeInvalid, setDateRangeInvalid] = useState(false);
  const [lastXTimePeriodOffset, setLastXTimePeriodOffset] = useState('days');

  useEffect(() => {
    if (props.timePeriod === TIME_PERIODS.customDateRange && !props.dateRange) {
      props.onSetDateRange(getDateRangeForToday());
    }
  }, [props.timePeriod, props.dateRange]);

  useEffect(() => {
    if (props.isOpen) {
      setStep('STEP_ONE');
    }
  }, [props.isOpen]);

  const isApplyDisabled = () => {
    if (
      props.tableType === 'SCORECARD' &&
      step === 'STEP_TWO' &&
      (_isEmpty(props.dataSource) || !props.calculation)
    ) {
      return true;
    }

    if (props.tableType === 'LONGITUDINAL' && !props.timePeriod) {
      return true;
    }

    if (props.tableType === 'COMPARISON') {
      if (
        props.selectedPopulation.length === 0 ||
        _isEqual(props.selectedPopulation[0], emptyPopulation)
      ) {
        return true;
      }
    }

    return false;
  };

  const handleNext = () => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_ONE') {
        setStep('STEP_TWO');
      } else if (!isApplyDisabled()) {
        props.onScorecardRowApply();
      }
    } else if (props.tableType === 'LONGITUDINAL' && !isApplyDisabled()) {
      props.onLongitudinalRowApply();
    } else if (
      !props.tableType ||
      (props.tableType === 'COMPARISON' && !isApplyDisabled())
    ) {
      props.onComparisonRowApply();
    }
  };

  const handleBack = () => {
    if (step === 'STEP_TWO') {
      setStep('STEP_ONE');
    }
  };

  const onKeyDown = (event) => {
    if (
      window.getFlag('table-widget-creation-sidepanel-ui') &&
      props.tableType !== 'COMPARISON'
    ) {
      return;
    }

    const ENTER_KEY_CODE = 13;
    const ESC_KEY_CODE = 27;
    const RIGHT_ARROW_KEY_CODE = 39;
    const LEFT_ARROW_KEY_CODE = 37;
    const { keyCode } = event;

    if (!props.isOpen) {
      return;
    }

    if (keyCode === ENTER_KEY_CODE || keyCode === RIGHT_ARROW_KEY_CODE) {
      handleNext();
    }

    if (step !== 'STEP_ONE' && keyCode === LEFT_ARROW_KEY_CODE) {
      handleBack();
    }

    if (keyCode === ESC_KEY_CODE) {
      props.togglePanel();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [
    props.isOpen,
    step,
    props.selectedPopulation,
    props.dataSource,
    props.calculation,
    props.timePeriod,
  ]);

  const getPanelTitle = () => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_ONE') {
        return props.t('Metric');
      }

      return props.t('Metric / Calculation');
    }

    if (props.tableType === 'LONGITUDINAL') {
      if (step === 'STEP_ONE') {
        return props.t('Session & Periods');
      }
    }

    return props.t('#sport_specific__Athletes');
  };

  const nextButtonClasses = classNames('rowPanel__next', {
    'rowPanel__next--apply':
      !props.tableType ||
      props.tableType === 'COMPARISON' ||
      props.tableType === 'LONGITUDINAL' ||
      (props.tableType === 'SCORECARD' && step === 'STEP_TWO'),
  });

  const getNextButtonText = () => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_ONE') {
        return props.t('Calculation');
      }

      return props.t('Apply');
    }

    return props.t('Apply');
  };

  const setCustomDateRange = (range = {}) => {
    setDateRangeInvalid(false);
    props.onSetDateRange({
      start_date: range.start_date,
      end_date: range.end_date,
    });
  };

  const athleteModule = () => {
    const hasMultiselectFF = window.getFlag(
      'table-widget-comparison-multiselect'
    );
    const disabledSquadAthletes: SquadAthletesSelection = hasMultiselectFF
      ? props.appliedRows.reduce((baseSquadAthletes, current) => {
          if (current.id === props.rowId) {
            return baseSquadAthletes;
          }

          const currentSquadPopulation = current.population || {
            ...emptyPopulation,
          };
          const newPopulation: SquadAthletesSelection = {
            all_squads: currentSquadPopulation.all_squads,
            applies_to_squad: currentSquadPopulation.applies_to_squad,
            position_groups: [
              ...baseSquadAthletes.position_groups,
              ...currentSquadPopulation.position_groups,
            ],
            positions: [
              ...baseSquadAthletes.positions,
              ...currentSquadPopulation.positions,
            ],
            athletes: [
              ...baseSquadAthletes.athletes,
              ...currentSquadPopulation.athletes,
            ],
            squads: [
              ...baseSquadAthletes.squads,
              ...currentSquadPopulation.squads,
            ],
            context_squads: [],
          };

          if (currentSquadPopulation.applies_to_squad) {
            newPopulation.applies_to_squad =
              currentSquadPopulation.applies_to_squad;
          }

          if (currentSquadPopulation.all_squads) {
            newPopulation.applies_to_squad = currentSquadPopulation.all_squads;
          }

          return newPopulation;
        }, emptyPopulation)
      : emptyPopulation;

    return (
      <AthleteSelector
        singleSelection={!hasMultiselectFF || props.isEditMode}
        squadAthletes={props.squadAthletes || { position_groups: [] }}
        squads={props.squads}
        showDropdownButton={false}
        selectedSquadAthletes={
          props.selectedPopulation[0] || { ...emptyPopulation }
        }
        disabledSquadAthletes={disabledSquadAthletes}
        onSelectSquadAthletes={(squadAthletesSelection) =>
          props.onSetPopulation([{ ...squadAthletesSelection }])
        }
      />
    );
  };

  const calculationModule = () => {
    return (
      <div className="rowPanel__calculationSelector">
        <Dropdown
          label={props.t('Calculation')}
          value={props.calculation}
          items={getCalculationDropdownOptions()}
          onChange={(calc) => {
            props.onSetCalculation(calc);
          }}
        />
      </div>
    );
  };

  const dateRangeModule = () => {
    return (
      <>
        <div className="rowPanel__dateSelector">
          <GroupedDropdown
            label={props.t('Date')}
            options={buildEventTypeTimePeriodOptions('isPivot')}
            onChange={(selection) => {
              props.onSetTimePeriod(selection.key_name);
            }}
            type="use_id"
            value={props.timePeriod}
          />
          {props.timePeriod === TIME_PERIODS.customDateRange && (
            <div className="lastXDaysSelector lastXDaysSelector--pushdown">
              <span className="dateRangePicker__label">
                {props.t('Select Date Range')}
              </span>
              <DateRangePicker
                invalid={dateRangeInvalid}
                onChange={(newDateRange) => setCustomDateRange(newDateRange)}
                position="center"
                turnaroundList={props.turnaroundList}
                value={props.dateRange || getDateRangeForToday()}
                allowFutureDate
              />
            </div>
          )}
          {props.timePeriod === TIME_PERIODS.lastXDays && (
            <LastXDaysSelector
              onChange={(value) => props.onSetTimePeriodLength(value)}
              periodLength={props.timePeriodLength}
              customClass="slidingPanel__rollingDatePicker"
            />
          )}
          {window.getFlag('graphing-offset-calc') &&
            props.timePeriod === TIME_PERIODS.lastXDays && (
              <LastXPeriodOffset
                timePeriodLengthOffset={props.timePeriodLengthOffset}
                onUpdateTimePeriodLengthOffset={(value) => {
                  props.onSetTimePeriodLengthOffset(value);
                }}
                lastXTimePeriodOffset={lastXTimePeriodOffset}
                onUpdateLastXTimePeriodOffset={(value) => {
                  setLastXTimePeriodOffset(value);
                }}
                radioName="table_row_last_x_offset"
              />
            )}
        </div>
      </>
    );
  };

  const metricModule = () => {
    return (
      <div className="rowPanel__metricSelector">
        <GroupedDropdown
          label={props.t('Data Source')}
          options={formatAvailableVariablesForGroupedDropdown(
            props.availableVariables
          )}
          onChange={(variable) => {
            props.onSetMetrics([variable]);
          }}
          // $FlowFixMe the type was updated for the new flow, this will be removed
          value={!_isEmpty(props.dataSource) ? props.dataSource.key_name : ''}
          searchable
        />
      </div>
    );
  };

  const getTabContent = () => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_TWO') {
        return calculationModule();
      }
      return metricModule();
    }

    return props.tableType === 'LONGITUDINAL'
      ? dateRangeModule()
      : athleteModule();
  };

  const renderPanelTitle = () => {
    if (props.isEditMode) {
      return props.t('Edit Row');
    }

    return props.t('Add Row');
  };

  const renderPanel = () => {
    if (props.tableType === 'LONGITUDINAL') {
      return (
        <LongitudinalPanel
          data-testid="RowPanel|LongitudinalPanel"
          isLoading={props.isLoading}
          onApply={(addAnother) => props.onLongitudinalRowApply(addAnother)}
          dateRange={props.dateRange}
          onSetDateRange={props.onSetDateRange}
          onSetTimePeriod={props.onSetTimePeriod}
          onSetTimePeriodLength={props.onSetTimePeriodLength}
          onSetTimePeriodLengthOffset={props.onSetTimePeriodLengthOffset}
          timePeriod={props.timePeriod}
          timePeriodLength={props.timePeriodLength}
          timePeriodLengthOffset={props.timePeriodLengthOffset}
          isEditMode={props.isEditMode}
          isOpen={props.isOpen}
        />
      );
    }

    if (props.tableType === 'SCORECARD') {
      return (
        <ScorecardPanel
          data-testid="RowPanel|ScorecardPanel"
          source={props.source}
          onSetActivitySource={props.onSetActivitySource}
          isLoading={props.isLoading}
          onApply={(addAnother) => props.onScorecardRowApply(addAnother)}
          availableVariables={props.availableVariables}
          calculation={props.calculation}
          calculationParams={props.calculationParams}
          dataSource={props.dataSource}
          onSetCalculation={props.onSetCalculation}
          onSetCalculationParam={props.onSetCalculationParam}
          onSetMetrics={props.onSetMetrics}
          onSetRowTitle={props.onSetRowTitle}
          isEditMode={props.isEditMode}
          isOpen={props.isOpen}
          filters={props.filters}
          rowTitle={props.rowTitle}
          onSetFilters={(filter, value) =>
            props.onSetFilters('row', filter, value)
          }
          onSetAvailabilitySource={props.onSetAvailabilitySource}
          onSetGameActivityKinds={props.onSetGameActivityKinds}
          onSetGameActivityResult={props.onSetGameActivityResult}
          onSetTimeInPositions={props.onSetTimeInPositions}
          onSetTimeInFormation={props.onSetTimeInFormation}
          onSetDatasourceIds={props.onSetDatasourceIds}
          onSetParticipationStatus={props.onSetParticipationStatus}
          onSetParticipationEvent={props.onSetParticipationEvent}
          onSetInputParams={props.onSetInputParams}
        />
      );
    }

    if (props.tableType === 'COMPARISON') {
      return (
        <ComparisonPanel
          data-testid="RowPanel|ComparisonPanel"
          activeSquad={props.activeSquad}
          isEditMode={props.isEditMode}
          isLoading={props.isLoading}
          onApply={props.onComparisonRowApply}
          isOpen={props.isOpen}
          squadAthletes={props.allSquadAthletes}
          selectedPopulation={props.selectedPopulation}
          onSetPopulation={props.onSetPopulation}
          onSetGroupings={props.onSetGroupings}
          selectedGrouping={props.rowConfig?.groupings}
        />
      );
    }

    return null;
  };

  const shouldRenderPanel = () => {
    if (
      window.getFlag('table-widget-creation-sidepanel-ui') &&
      window.getFlag('graph-squad-selector') &&
      props.tableType === 'COMPARISON'
    ) {
      return true;
    }

    return (
      window.getFlag('table-widget-creation-sidepanel-ui') &&
      props.tableType !== 'COMPARISON'
    );
  };

  return (
    <div
      css={
        window.getFlag('table-widget-creation-sidepanel-ui')
          ? {
              '.slidingPanel__title': {
                marginLeft: '20px',
                fontSize: '18px',
              },
            }
          : null
      }
    >
      <SlidingPanel
        data-testid="RowPanel|SlidingPanel"
        isOpen={props.isOpen}
        title={
          window.getFlag('table-widget-creation-sidepanel-ui')
            ? renderPanelTitle()
            : getPanelTitle()
        }
        togglePanel={props.togglePanel}
      >
        {shouldRenderPanel() ? (
          renderPanel()
        ) : (
          <Panel>
            <Panel.Content>{getTabContent()}</Panel.Content>
            <Panel.Loading isLoading={props.isLoading} />
            <Panel.Actions>
              <div className="rowPanel__back">
                {props.tableType === 'SCORECARD' && step !== 'STEP_ONE' ? (
                  <>
                    <TextButton
                      onClick={() => handleBack()}
                      type="secondary"
                      text={props.t('Metric')}
                    />
                    <span className="rowPanel__backArrow icon-next-left" />
                  </>
                ) : null}
              </div>
              <div className={nextButtonClasses}>
                <TextButton
                  onClick={() => handleNext()}
                  isDisabled={isApplyDisabled()}
                  type="primary"
                  text={getNextButtonText()}
                  kitmanDesignSystem={window.getFlag(
                    'table-widget-creation-sidepanel-ui'
                  )}
                />
                {props.tableType === 'SCORECARD' && step !== 'STEP_TWO' ? (
                  <span className="rowPanel__nextArrow icon-next-right" />
                ) : null}
              </div>
            </Panel.Actions>
          </Panel>
        )}
      </SlidingPanel>
    </div>
  );
}

RowPanel.defaultProps = {
  isOpen: false,
  togglePanel: () => {},
};

export default RowPanel;
export const RowPanelTranslated = withNamespaces()(RowPanel);
