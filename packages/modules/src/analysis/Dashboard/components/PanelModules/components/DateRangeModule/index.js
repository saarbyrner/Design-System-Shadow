// @flow
import { useState, useMemo, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  LastXDaysSelector,
  LastXPeriodOffset,
  Select,
} from '@kitman/components';
import { buildEventTypeTimePeriodSelectOptions } from '@kitman/modules/src/analysis/shared/utils';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import { CustomDateRangeTranslated as CustomDateRange } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule/CustomDateRange';
import { LastXEventsTranslated as LastXEvents } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/DateRangeModule/LastXEvents';
import { EVENT_TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DateRange } from '@kitman/common/src/types';
import type { TimeScopeConfig } from '@kitman/modules/src/analysis/Dashboard/components/types';

import { eventTypesMap, lastXEventsOptions } from './constants';
import { getTimePeriodValue } from '../../utils';

type Props = {
  title?: string,
  dateRange: ?DateRange,
  onSetDateRange: Function,
  onSetTimePeriod: Function,
  onSetTimePeriodLength: Function,
  onSetTimePeriodLengthOffset: Function,
  onSetTimePeriodConfig?: (config: TimeScopeConfig) => void,
  timePeriod: string,
  timePeriodLength: ?number,
  timePeriodLengthOffset: ?number,
  config?: TimeScopeConfig,
  hideLastXEvents?: boolean,
  showLastGamesAndSessions?: boolean,
};

function DateRangeModule(props: I18nProps<Props>) {
  const [lastXTimePeriodOffset, setLastXTimePeriodOffset] = useState('days');
  const showLastEvents =
    window.getFlag('table-widget-last-x-events') && !props.hideLastXEvents;
  const showLastGamesAndSessions =
    window.getFlag('rep-last-x-games-and-sessions') &&
    !!props.showLastGamesAndSessions;

  const handleOnChange = (selection: string) => {
    const isLastXEvent = lastXEventsOptions.includes(selection);
    const timePeriod = isLastXEvent
      ? EVENT_TIME_PERIODS.lastXEvents
      : selection;

    props.onSetTimePeriodLength(null);
    props.onSetTimePeriod(timePeriod);
    props.onSetTimePeriodConfig?.(
      isLastXEvent ? { event_types: eventTypesMap[selection] || [] } : {}
    );
  };

  const timePeriodValue = useMemo(
    () => getTimePeriodValue(props.timePeriod, props.config),
    [props.timePeriod, props.config]
  );

  useEffect(() => {
    /*
    This effect is to reset timePeriod and config when a user switches data source from one that is compatible with lastXGamesEvents to one that isn't.
    config may be undefined, and event_types may be an empty array, so we just need to check if event_types has any values to know when to reset.
    */
    if (
      props.config?.event_types &&
      props.config.event_types.length > 0 &&
      !showLastGamesAndSessions
    ) {
      props.onSetTimePeriod(null);
      props.onSetTimePeriodConfig?.({});
    }
  }, [showLastGamesAndSessions]);

  return (
    <>
      <Panel.Field>
        <Select
          data-testid="DateRangeModule|DateSelect"
          label={props.title || props.t('Date')}
          options={buildEventTypeTimePeriodSelectOptions(
            true,
            showLastEvents,
            showLastGamesAndSessions
          )}
          onChange={handleOnChange}
          value={timePeriodValue}
          menuPosition="fixed"
          minMenuHeight={500}
          appendToBody
        />
      </Panel.Field>

      {props.timePeriod === EVENT_TIME_PERIODS.customDateRange && (
        <Panel.Field data-testid="DateRangeModule|CustomDateRange">
          <CustomDateRange
            dateRange={props.dateRange}
            onSetDateRange={props.onSetDateRange}
          />
        </Panel.Field>
      )}

      {props.timePeriod === EVENT_TIME_PERIODS.lastXDays && (
        <Panel.Field data-testid="DateRangeModule|LastXDays">
          <LastXDaysSelector
            onChange={(value) => props.onSetTimePeriodLength(value)}
            periodLength={props.timePeriodLength}
            customClass="slidingPanel__rollingDatePicker"
            radioName="table_column_last_x"
            kitmanDesignSystem
          />
        </Panel.Field>
      )}
      {window.getFlag('graphing-offset-calc') &&
        props.timePeriod === EVENT_TIME_PERIODS.lastXDays && (
          <Panel.Field data-testid="DateRangeModule|LastXPeriod">
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
              kitmanDesignSystem
            />
          </Panel.Field>
        )}
      {props.timePeriod === EVENT_TIME_PERIODS.lastXEvents && (
        <LastXEvents
          data-testid="DateRangeModule|LastXEvents"
          timePeriodLength={props.timePeriodLength}
          onSetTimePeriodLength={props.onSetTimePeriodLength}
          timePeriodLengthOffset={props.timePeriodLengthOffset}
          onSetTimePeriodLengthOffset={props.onSetTimePeriodLengthOffset}
          timePeriodValue={timePeriodValue}
        />
      )}
    </>
  );
}

export const DateRangeModuleTranslated = withNamespaces()(DateRangeModule);
export default DateRangeModule;
