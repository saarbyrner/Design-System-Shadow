// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import _cloneDeep from 'lodash/cloneDeep';
import { TrackEvent } from '@kitman/common/src/utils';
import {
  DateRangePicker,
  GroupedDropdown,
  LastXDaysSelector,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import { buildEventTypeTimePeriodOptions } from '@kitman/modules/src/analysis/shared/utils';
import AthleteSelector from '@kitman/modules/src/analysis/Dashboard/containers/AthleteSelector';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

// Types
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

type Props = {
  appliedSquadAthletes: SquadAthletesSelection,
  appliedDateRange: Object,
  appliedTimePeriod: string,
  appliedTimePeriodLength: ?number,
  isOpen: boolean,
  onApply: Function,
  onReset: Function,
  togglePanel: Function,
  turnaroundList: Array<Turnaround>,
};

const emptySquadAthletesSelection = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
};

function PivotSlidingPanel(props: I18nProps<Props>) {
  const [selectedSquadAthletes, setSelectedSquadAthletes] = useState(
    _cloneDeep(emptySquadAthletesSelection)
  );
  const [pivotBy, setPivotBy] = useState('ATHLETES');
  const [timePeriod, setTimePeriod] = useState('');
  const [timePeriodLength, setTimePeriodLength] = useState(null);
  const [dateRange, setDateRange] = useState(Object);

  const [timePeriodLengthInvalid, setTimePeriodLengthInvalid] = useState(false);
  const [dateRangeInvalid, setDateRangeInvalid] = useState(false);
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    if (!props.isOpen) {
      setSelectedSquadAthletes(props.appliedSquadAthletes);
      setDateRange(props.appliedDateRange);
      setTimePeriod(props.appliedTimePeriod);
      setTimePeriodLength(props.appliedTimePeriodLength);
    }
  }, [props.isOpen]);

  const clearAllSelectedItems = () => {
    setSelectedSquadAthletes(_cloneDeep(emptySquadAthletesSelection));
    setTimePeriod('');
    setTimePeriodLength(null);
    setDateRange(Object);
  };

  const setCustomDateRange = (range = {}) => {
    setDateRangeInvalid(false);
    setDateRange({
      start_date: range.start_date,
      end_date: range.end_date,
    });
  };

  const resetScrolling = () => {
    if (document.body) {
      // when you scroll in the multiSelectDropdown it sets overflowY to hidden
      // to lock the page scrolling. Here we need to set overflowY to '' to reset
      // the page scrolling.
      document.body.style.overflowY = '';
    }
  };

  const getMultiSelect = (turnaroundList) => {
    const dateRangePickerEl = (
      <div className="lastXDaysSelector lastXDaysSelector--pushdown">
        <span className="dateRangePicker__label">
          {props.t('Select Date Range')}
        </span>
        <DateRangePicker
          invalid={dateRangeInvalid}
          onChange={(newDateRange) => setCustomDateRange(newDateRange)}
          position="center"
          turnaroundList={turnaroundList}
          value={dateRange}
        />
      </div>
    );

    if (pivotBy === 'DATE') {
      return (
        <>
          <GroupedDropdown
            label={props.t('Date')}
            options={buildEventTypeTimePeriodOptions('isPivot')}
            onChange={(selection) => {
              setCustomDateRange();
              setTimePeriod(selection.key_name);
            }}
            type="use_id"
            value={timePeriod || ''}
          />
          {timePeriod === TIME_PERIODS.customDateRange && dateRangePickerEl}
          {timePeriod === TIME_PERIODS.lastXDays && (
            <LastXDaysSelector
              onChange={(value) => setTimePeriodLength(value)}
              periodLength={timePeriodLength}
              customClass="slidingPanel__rollingDatePicker"
              invalid={timePeriodLengthInvalid}
            />
          )}
        </>
      );
    }

    return (
      <AthleteSelector
        data-testid="PivotSlidingPanel|AthleteSelector"
        showDropdownButton={false}
        selectedSquadAthletes={selectedSquadAthletes}
        onSelectSquadAthletes={(squadAthletesSelection) =>
          setSelectedSquadAthletes(squadAthletesSelection)
        }
      />
    );
  };

  const handleApply = () => {
    // GA tracking
    TrackEvent('Graph Dashboard', 'Click', 'Apply Button');
    // Mixpanel
    trackEvent(reportingEventNames.pivotDashboard);
    if (timePeriod === TIME_PERIODS.lastXDays && !timePeriodLength) {
      setTimePeriodLengthInvalid(true);
    } else if (
      timePeriod === TIME_PERIODS.customDateRange &&
      !dateRange.start_date &&
      !dateRange.end_date
    ) {
      setDateRangeInvalid(true);
    } else {
      setTimePeriodLengthInvalid(false);
      setDateRangeInvalid(false);

      props.onApply({
        selectedSquadAthletes,
        timePeriod,
        dateRange,
        timePeriodLength,
      });
    }
  };

  return (
    <SlidingPanel
      isOpen={props.isOpen}
      title={props.t('Pivot Dashboard By')}
      togglePanel={props.togglePanel}
    >
      <div className="btn-group athletesDateSelector">
        <button
          type="button"
          className={classNames('btn btn-primary athletesButton', {
            active: pivotBy === 'ATHLETES',
          })}
          onClick={() => {
            TrackEvent('Graph Dashboard', 'Click', 'Click Athlete Toggle');
            setPivotBy('ATHLETES');
            resetScrolling();
          }}
        >
          {props.t('#sport_specific__Athletes')}
        </button>
        <button
          type="button"
          className={classNames('btn btn-primary datesButton', {
            active: pivotBy === 'DATE',
          })}
          onClick={() => {
            TrackEvent('Graph Dashboard', 'Click', 'Click Date Toggle');
            setPivotBy('DATE');
            resetScrolling();
          }}
        >
          {props.t('Date')}
        </button>
      </div>

      {getMultiSelect(props.turnaroundList)}

      <div className="slidingPanelActions">
        <div className="slidingPanelActions__reset">
          <TextButton
            onClick={() => {
              TrackEvent('Graph Dashboard', 'Click', 'Reset Button');
              clearAllSelectedItems();
              props.onReset();
            }}
            type="textOnly"
            text={props.t('Reset')}
          />
        </div>
        <div className="slidingPanelActions__apply">
          <TextButton
            onClick={() => {
              handleApply();
            }}
            type="primary"
            text={props.t('Apply')}
          />
        </div>
      </div>
    </SlidingPanel>
  );
}

PivotSlidingPanel.defaultProps = {
  appliedSquadAthletes: _cloneDeep(emptySquadAthletesSelection),
  appliedDateRange: {},
  appliedTimePeriod: '',
  isOpen: false,
  onApply: () => {},
  onReset: () => {},
  togglePanel: () => {},
  turnaroundList: [],
};

export default PivotSlidingPanel;
export const PivotSlidingPanelTranslated = withNamespaces()(PivotSlidingPanel);
