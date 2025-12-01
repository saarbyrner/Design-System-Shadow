// @flow
import {
  DateRangePicker,
  Dropdown,
  LastXPeriodPicker,
} from '@kitman/components';
import { dateRangeTimePeriods } from '@kitman/common/src/utils/status_utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { DateRange } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  graphGroup?: string,
  metricIndex?: number,
  excludeRollingPeriod?: ?boolean,
  turnaroundList: Array<Turnaround>,
  updateTimePeriod: Function,
  updateDateRange: Function,
  onUpdateTimePeriodLength?: Function,
  onUpdateLastXTimePeriod?: Function,
  timePeriod: string,
  timePeriodLength?: ?number,
  lastXTimePeriod?: 'weeks' | 'days',
  dateRange: DateRange,
  disableTimePeriod?: boolean,
};

const TimePeriod = (props: I18nProps<Props>) => {
  const dateRangePickerEl = (
    <div className="col-xl-3 lastXDaysSelector lastXDaysSelector--pushdown">
      <DateRangePicker
        turnaroundList={props.turnaroundList}
        onChange={(newDateRange) => props.updateDateRange(newDateRange)}
        value={props.dateRange}
        disabled={props.disableTimePeriod}
        ignoreValidation={props.disableTimePeriod}
        position="center"
        allowFutureDate={window.getFlag('reporting-future-dates')}
      />
    </div>
  );

  const renderLastXDaysPicker = () => (
    <LastXPeriodPicker
      onPeriodLengthChange={(value) => {
        if (props.onUpdateTimePeriodLength) {
          props.onUpdateTimePeriodLength(value);
        }
      }}
      onTimePeriodChange={(value) => {
        if (props.onUpdateLastXTimePeriod) {
          props.onUpdateLastXTimePeriod(value);
        }
      }}
      timePeriod={props.lastXTimePeriod}
      periodLength={props.timePeriodLength}
      radioName={
        // $FlowFixMe if metricIndex is provided it can only be a number and not undefined
        props.metricIndex !== 'undefined' && props.metricIndex !== null
          ? // $FlowFixMe metricIndex is checked above
            `rollingDateRadios__${props.metricIndex}`
          : 'rollingDateRadios'
      }
      customClass="sessionDateRange__rollingDatePicker"
      disabled={
        props.graphGroup !== 'summary' &&
        props.metricIndex &&
        props.metricIndex > 0
      }
      metricIndex={props.metricIndex}
    />
  );

  return (
    <>
      <div className="col-xl-3">
        <Dropdown
          onChange={(timePeriod) => props.updateTimePeriod(timePeriod)}
          items={dateRangeTimePeriods(props.excludeRollingPeriod)}
          label={props.t('Date Range')}
          disabled={props.disableTimePeriod}
          value={props.timePeriod || ''}
          ignoreValidation={props.disableTimePeriod}
        />
      </div>

      {props.timePeriod === TIME_PERIODS.customDateRange && dateRangePickerEl}
      {props.timePeriod === TIME_PERIODS.lastXDays && renderLastXDaysPicker()}
    </>
  );
};

export default TimePeriod;
