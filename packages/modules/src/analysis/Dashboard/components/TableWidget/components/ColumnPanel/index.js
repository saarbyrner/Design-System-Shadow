// @flow
import { useState, useEffect, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import _isEmpty from 'lodash/isEmpty';
import { isSelectionEmpty } from '@kitman/components/src/AthleteSelector/utils';
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
import { getDateRangeForToday } from '@kitman/common/src/utils/dateRange';
import { GameActivityModuleTranslated as GameActivityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/GameActivityModule';
import { AvailabilityModuleTranslated as AvailabilityModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/AvailabilityModule';
import { getCalculationDropdownOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { ComparisonPanelTranslated as ComparisonPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel/components/ComparisonPanel';
import { LongitudinalPanelTranslated as LongitudinalPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel/components/LongitudinalPanel';
import { ScorecardPanelTranslated as ScorecardPanel } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel/components/ScorecardPanel';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { SetState } from '@kitman/common/src/types/react';
import type { StatusVariable, DateRange } from '@kitman/common/src/types';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import {
  type InputParams,
  type Calculation,
  type TimeScopeConfig,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import type {
  TableWidgetType,
  TableWidgetElementSource,
  TableElementFilters,
  TableWidgetDataSource,
  TableWidgetCalculationParams,
} from '../../types';

type Props = {
  source: TableWidgetDataSource,
  availableVariables: Array<StatusVariable>,
  calculation: Calculation,
  calculationParams: TableWidgetCalculationParams,
  columnTitle: string,
  dataSource: TableWidgetElementSource,
  dateRange: ?DateRange,
  isOpen: boolean,
  isEditMode: boolean,
  onComparisonColumnApply: Function,
  onLongitudinalColumnApply: Function,
  onScorecardColumnApply: Function,
  onSetCalculation: Function,
  onSetCalculationParam: Function,
  onSetColumnTitle: Function,
  onSetDateRange: Function,
  onSetMetrics: Function,
  onSetPopulation: Function,
  onSetTimePeriod: Function,
  onSetTimePeriodLength: Function,
  onSetTimePeriodLengthOffset: Function,
  onSetTimePeriodConfig: (config: TimeScopeConfig) => void,
  onSetGameActivityKinds: (kind: string | Array<string>) => void,
  onSetGameActivityResult: (result: string) => void,
  onSetTimeInPositions: (positionIds: Array<string>) => void,
  onSetTimeInFormation: (formationIds: Array<string>) => void,
  selectedPopulation: SquadAthletesSelection,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  tableType: TableWidgetType,
  timePeriod: string,
  timePeriodLength: ?number,
  timePeriodLengthOffset: ?number,
  timePeriodConfig: ?TimeScopeConfig,
  togglePanel: Function,
  turnaroundList: Array<Turnaround>,
  isLoading: boolean,
  onSetActivitySource: Function,
  onSetAvailabilitySource: Function,
  filters: TableElementFilters,
  onSetFilters: Function,
  onSetDatasourceIds: SetState<Array<number>>,
  onSetParticipationStatus: SetState<string>,
  onSetParticipationEvent: (event: string | null) => void,
  onSetInputParams: (params: InputParams) => void,
};

function ColumnPanel(props: I18nProps<Props>) {
  /**
   * The table-widget-creation-sidepanel-ui feature flag
   * exposes a new UI for creating columns for different configurations
   * when removing logic for that feature flag you can start here
   */
  // table-widget-creation-sidepanel-ui --- REMOVE START
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
    if (props.tableType === 'SCORECARD') {
      return (
        step === 'STEP_TWO' &&
        (isSelectionEmpty(props.selectedPopulation) || !props.timePeriod)
      );
    }

    if (props.tableType === 'LONGITUDINAL') {
      return (
        step === 'STEP_THREE' &&
        (_isEmpty(props.dataSource) ||
          !props.calculation ||
          isSelectionEmpty(props.selectedPopulation))
      );
    }

    return (
      step === 'STEP_THREE' &&
      (_isEmpty(props.dataSource) || !props.calculation || !props.timePeriod)
    );
  };

  const handleNext = () => {
    if (window.getFlag('table-widget-creation-sidepanel-ui')) {
      return;
    }

    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_ONE') {
        setStep('STEP_TWO');
      } else if (!isApplyDisabled()) {
        props.onScorecardColumnApply();
        setDateRangeInvalid(false);
      }
    } else if (props.tableType === 'LONGITUDINAL') {
      if (step === 'STEP_ONE') {
        setStep('STEP_TWO');
      } else if (step === 'STEP_TWO') {
        setStep('STEP_THREE');
      } else if (!isApplyDisabled()) {
        props.onLongitudinalColumnApply();
        setDateRangeInvalid(false);
      }
    } else if (!props.tableType || props.tableType === 'COMPARISON') {
      if (step === 'STEP_ONE') {
        setStep('STEP_TWO');
      } else if (step === 'STEP_TWO') {
        setStep('STEP_THREE');
      } else if (!isApplyDisabled()) {
        props.onComparisonColumnApply();
        setDateRangeInvalid(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 'STEP_TWO') {
      setStep('STEP_ONE');
    } else if (step === 'STEP_THREE') {
      setStep('STEP_TWO');
    }
  };

  const onKeyDown = (event) => {
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
    props.timePeriod,
    props.dataSource,
    props.calculation,
  ]);

  const getPanelTitle = () => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_ONE') {
        return props.t('#sport_specific__Athlete');
      }

      return `${props.t('#sport_specific__Athlete')} / ${props.t(
        'Session & Periods'
      )}`;
    }

    if (step === 'STEP_ONE') {
      return props.t('Metrics');
    }

    if (step === 'STEP_TWO') {
      return props.t('Metrics / Calculation');
    }

    return props.tableType === 'LONGITUDINAL'
      ? `${props.t('Metrics')} / ${props.t('Calculation')} / ${props.t(
          '#sport_specific__Athlete'
        )}`
      : props.t('Metrics / Calculation / Session & Periods');
  };

  const getBackButtonText = () => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_TWO') {
        return props.t('#sport_specific__Athlete');
      }
    }

    if (step === 'STEP_TWO') {
      return props.t('Metrics');
    }
    return props.t('Calculation');
  };

  const nextButtonClasses = classNames('columnPanel__next', {
    'columnPanel__next--apply':
      (props.tableType === 'SCORECARD' && step === 'STEP_TWO') ||
      step === 'STEP_THREE',
  });

  const getNextButtonText = () => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_ONE') {
        return props.t('Session & Periods');
      }

      return props.t('Apply');
    }

    if (step === 'STEP_ONE') {
      return props.t('Calculation');
    }

    if (step === 'STEP_TWO') {
      return props.tableType === 'LONGITUDINAL'
        ? props.t('#sport_specific__Athlete')
        : props.t('Session & Periods');
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

  const { squadAthletes, squads, selectedPopulation, onSetPopulation } = props;

  const athleteModule = useCallback(() => {
    return (
      <AthleteSelector
        singleSelection
        squadAthletes={squadAthletes}
        squads={squads}
        showDropdownButton={false}
        selectedSquadAthletes={selectedPopulation}
        onSelectSquadAthletes={(squadAthletesSelection) => {
          onSetPopulation(squadAthletesSelection);
        }}
      />
    );
  }, [squadAthletes, squads, selectedPopulation, onSetPopulation]);

  const calculationModule = useCallback(() => {
    return (
      <div className="columnPanel__calculationSelector">
        <Dropdown
          label={props.t('Calculation')}
          value={props.calculation}
          items={getCalculationDropdownOptions()}
          onChange={(calc) => props.onSetCalculation(calc)}
        />
      </div>
    );
  }, [props.calculation, props.onSetCalculation, props.t]);

  const dateRangeModule = useCallback(() => {
    return (
      <>
        <div className="columnPanel__dateSelector">
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
              radioName="table_column_last_x"
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
                radioName="table_column_last_x_offset"
              />
            )}
        </div>
      </>
    );
  }, [
    props.t,
    props.timePeriod,
    dateRangeInvalid,
    props.turnaroundList,
    props.dateRange,
    props.onSetTimePeriod,
    props.onSetTimePeriodLength,
    props.timePeriodLength,
    props.timePeriodLengthOffset,
    props.onSetTimePeriodLengthOffset,
    lastXTimePeriodOffset,
    setLastXTimePeriodOffset,
    setCustomDateRange,
  ]);

  const metricModule = useCallback(() => {
    return (
      <>
        <label className="columnPanel__label">{props.t('Column Title')}</label>
        <input
          className="columnPanel__nameInput"
          type="text"
          value={props.columnTitle}
          onChange={(e) => props.onSetColumnTitle(e.currentTarget.value)}
        />
        <span className="columnPanel__optionalText">{props.t('Optional')}</span>
        <div className="columnPanel__metricSelector">
          <GroupedDropdown
            label={props.t('Data Source')}
            options={formatAvailableVariablesForGroupedDropdown(
              props.availableVariables
            )}
            onChange={(variable) => {
              props.onSetMetrics([variable]);
            }}
            value={!_isEmpty(props.dataSource) ? props.dataSource.key_name : ''}
            searchable
          />
        </div>
      </>
    );
  }, [
    props.t,
    props.columnTitle,
    props.availableVariables,
    props.dataSource,
    props.onSetColumnTitle,
    props.onSetMetrics,
  ]);

  const getTabContent = useCallback(() => {
    if (props.tableType === 'SCORECARD') {
      if (step === 'STEP_TWO') {
        return dateRangeModule();
      }

      return athleteModule();
    }

    if (step === 'STEP_TWO') {
      return calculationModule();
    }

    if (step === 'STEP_THREE') {
      return props.tableType === 'LONGITUDINAL'
        ? athleteModule()
        : dateRangeModule();
    }

    return metricModule();
  }, [
    props.tableType,
    step,
    dateRangeModule,
    athleteModule,
    calculationModule,
    metricModule,
  ]);

  // table-widget-creation-sidepanel-ui --- REMOVE END

  const renderPanelTitle = () => {
    if (props.isEditMode) {
      return props.t('Edit Column');
    }

    return props.t('Add Column');
  };

  const gameActivityModule = (
    <GameActivityModule
      data-testid="GameActivityModule"
      isPanelOpen={props.isOpen}
      panelType="column"
      title={props.columnTitle}
      calculation={props.calculation}
      onSetCalculation={props.onSetCalculation}
      onSetTitle={props.onSetColumnTitle}
      positionsIds={props.dataSource?.position_ids}
      selectedEvent={props.dataSource?.kinds || props.dataSource?.result}
      onSetGameActivityKinds={props.onSetGameActivityKinds}
      onSetGameActivityResult={props.onSetGameActivityResult}
      onSetTimeInPositions={props.onSetTimeInPositions}
      onSetTimeInFormation={props.onSetTimeInFormation}
      formationIds={props.dataSource?.formation_ids}
    />
  );

  const availabilityModule = (
    <AvailabilityModule
      data-testid="AvailabilityModule"
      isPanelOpen={props.isOpen}
      panelType="column"
      title={props.columnTitle}
      onSetTitle={props.onSetColumnTitle}
      calculation={props.calculation}
      onSetCalculation={props.onSetCalculation}
      onSetAvailabilitySource={props.onSetAvailabilitySource}
      selectedAvailabilityStatus={props.dataSource?.status}
    />
  );

  const renderPanel = () => {
    if (props.tableType === 'COMPARISON') {
      return (
        <ComparisonPanel
          data-testid="ColumnPanel|ComparisonPanel"
          source={props.source}
          isLoading={props.isLoading}
          calculation={props.calculation}
          calculationParams={props.calculationParams}
          columnTitle={props.columnTitle}
          dataSource={props.dataSource}
          dateRange={props.dateRange}
          onApply={(addAnother) => props.onComparisonColumnApply(addAnother)}
          onSetCalculation={props.onSetCalculation}
          onSetCalculationParam={props.onSetCalculationParam}
          onSetColumnTitle={props.onSetColumnTitle}
          onSetDateRange={props.onSetDateRange}
          onSetMetrics={props.onSetMetrics}
          onSetTimePeriod={props.onSetTimePeriod}
          onSetTimePeriodLength={props.onSetTimePeriodLength}
          onSetTimePeriodLengthOffset={props.onSetTimePeriodLengthOffset}
          onSetTimePeriodConfig={props.onSetTimePeriodConfig}
          timePeriod={props.timePeriod}
          timePeriodLength={props.timePeriodLength}
          timePeriodLengthOffset={props.timePeriodLengthOffset}
          timePeriodConfig={props.timePeriodConfig}
          isEditMode={props.isEditMode}
          isOpen={props.isOpen}
          filters={props.filters}
          onSetFilters={(filter, value) =>
            props.onSetFilters('column', filter, value)
          }
          onSetActivitySource={props.onSetActivitySource}
          onSetGameActivityKinds={props.onSetGameActivityKinds}
          onSetGameActivityResult={props.onSetGameActivityResult}
          onSetTimeInPositions={props.onSetTimeInPositions}
          gameActivityModule={gameActivityModule}
          availabilityModule={availabilityModule}
          onSetDatasourceIds={props.onSetDatasourceIds}
          onSetParticipationStatus={props.onSetParticipationStatus}
          onSetParticipationEvent={props.onSetParticipationEvent}
          onSetInputParams={props.onSetInputParams}
        />
      );
    }

    if (props.tableType === 'LONGITUDINAL') {
      return (
        <LongitudinalPanel
          data-testid="ColumnPanel|LongitudinalPanel"
          source={props.source}
          availableVariables={props.availableVariables}
          calculation={props.calculation}
          calculationParams={props.calculationParams}
          columnTitle={props.columnTitle}
          dataSource={props.dataSource}
          onSetCalculation={props.onSetCalculation}
          onSetCalculationParam={props.onSetCalculationParam}
          onSetColumnTitle={props.onSetColumnTitle}
          onSetMetrics={props.onSetMetrics}
          onSetPopulation={props.onSetPopulation}
          selectedPopulation={props.selectedPopulation}
          squadAthletes={props.squadAthletes}
          squads={props.squads}
          isLoading={props.isLoading}
          onApply={(addAnother) => props.onLongitudinalColumnApply(addAnother)}
          isEditMode={props.isEditMode}
          isOpen={props.isOpen}
          filters={props.filters}
          onSetFilters={(filter, value) =>
            props.onSetFilters('column', filter, value)
          }
          onSetActivitySource={props.onSetActivitySource}
          onSetGameActivityKinds={props.onSetGameActivityKinds}
          onSetGameActivityResult={props.onSetGameActivityResult}
          onSetTimeInPositions={props.onSetTimeInPositions}
          gameActivityModule={gameActivityModule}
          availabilityModule={availabilityModule}
          onSetDatasourceIds={props.onSetDatasourceIds}
          onSetParticipationStatus={props.onSetParticipationStatus}
          onSetParticipationEvent={props.onSetParticipationEvent}
          onSetInputParams={props.onSetInputParams}
        />
      );
    }

    if (props.tableType === 'SCORECARD') {
      return (
        <ScorecardPanel
          data-testid="ColumnPanel|ScorecardPanel"
          availableVariables={props.availableVariables}
          onSetPopulation={props.onSetPopulation}
          selectedPopulation={props.selectedPopulation}
          squadAthletes={props.squadAthletes}
          squads={props.squads}
          isLoading={props.isLoading}
          onApply={(addAnother) => props.onScorecardColumnApply(addAnother)}
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

    return null;
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
        data-testid="ColumnPanel|SlidingPanel"
        isOpen={props.isOpen}
        title={
          window.getFlag('table-widget-creation-sidepanel-ui')
            ? renderPanelTitle()
            : getPanelTitle()
        }
        togglePanel={props.togglePanel}
      >
        {window.getFlag('table-widget-creation-sidepanel-ui') ? (
          renderPanel()
        ) : (
          <div className="columnPanel">
            {/** When removing for table-widget-creation-sidepanel-ui it will be safe to remove all in thie block */}
            <div className="columnPanel__content">{getTabContent()}</div>
            <div className="columnPanel__actions">
              <div className="columnPanel__back">
                {step !== 'STEP_ONE' ? (
                  <>
                    <TextButton
                      onClick={() => handleBack()}
                      type="secondary"
                      text={getBackButtonText()}
                    />
                    <span className="columnPanel__backArrow icon-next-left" />
                  </>
                ) : null}
              </div>
              <div className={nextButtonClasses}>
                <TextButton
                  onClick={() => handleNext()}
                  isDisabled={isApplyDisabled()}
                  type="primary"
                  text={getNextButtonText()}
                />
                {(props.tableType === 'SCORECARD' && step !== 'STEP_TWO') ||
                !props.tableType ||
                ((props.tableType === 'COMPARISON' ||
                  props.tableType === 'LONGITUDINAL') &&
                  step !== 'STEP_THREE') ? (
                  <span className="columnPanel__nextArrow icon-next-right" />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </SlidingPanel>
    </div>
  );
}

export default ColumnPanel;
export const ColumnPanelTranslated = withNamespaces()(ColumnPanel);
