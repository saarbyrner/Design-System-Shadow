// @flow
import { withNamespaces } from 'react-i18next';

import { Select } from '@kitman/components';

import { LastXDaysSelectorTranslated as LastXDaysSelector } from '@kitman/components/src/LastXDaysSelector';
import { CustomDateRangeTranslated as CustomDateRange } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule/CustomDateRange';
import { getDateRangeForToday } from '@kitman/common/src/utils/dateRange';
import useFilter from '@kitman/modules/src/analysis/TemplateDashboards/hooks/useFilter';
import {
  getDateRanges,
  getDevelopmentJourneyDateRanges,
} from '@kitman/modules/src/analysis/TemplateDashboards/components/TimeScopeFilter/utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  dashboardKey: string,
};

const styles = {
  timeScopeFilter: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '15px',
    marginBottom: '15px',
    '.kitmanReactSelect': {
      marginBottom: 0,
    },
  },
  customDateRange: {
    '.textButton--kitmanDesignSystem--secondary': {
      fontWeight: 'inherit',
    },
  },
};

function TimeScopeFilter(props: I18nProps<Props>) {
  const { filter, setFilter } = useFilter('timescope');
  const dateRange =
    filter.start_time && filter.end_time
      ? {
          start_date: filter.start_time,
          end_date: filter.end_time,
        }
      : getDateRangeForToday();

  return (
    <div css={styles.timeScopeFilter}>
      <Select
        data-testid="TimeScopeFilter|Date"
        label={props.t('Date')}
        value={filter.time_period}
        onChange={(value) => {
          if (value === TIME_PERIODS.customDateRange) {
            setFilter({
              time_period: TIME_PERIODS.customDateRange,
              start_time: dateRange.start_date,
              end_time: dateRange.end_date,
            });
          } else {
            setFilter({ time_period: value });
          }
        }}
        options={
          props.dashboardKey === 'development_journey'
            ? getDevelopmentJourneyDateRanges()
            : getDateRanges()
        }
      />
      {filter.time_period === TIME_PERIODS.customDateRange && (
        <div css={styles.customDateRange}>
          <CustomDateRange
            dateRange={dateRange}
            onSetDateRange={(value) => {
              setFilter({
                time_period: TIME_PERIODS.customDateRange,
                start_time: value.start_date,
                end_time: value.end_date,
              });
            }}
            turnaroundList={[]}
          />
        </div>
      )}
      {filter.time_period === TIME_PERIODS.lastXDays && (
        <div>
          <LastXDaysSelector
            periodLength={filter.time_period_length}
            onChange={(value) => {
              setFilter({
                time_period: TIME_PERIODS.lastXDays,
                time_period_length: value,
              });
            }}
            radioName="static_dashboard_filter_last_x"
            kitmanDesignSystem
          />
        </div>
      )}
    </div>
  );
}

export const TimeScopeFilterTranslated: ComponentType<Props> =
  withNamespaces()(TimeScopeFilter);
export default TimeScopeFilter;
