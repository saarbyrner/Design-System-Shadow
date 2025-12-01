// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { SelectOption } from '@kitman/components/src/types';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import { gameDaysOptions } from '@kitman/common/src/utils/workload';
import {
  DateRangePicker,
  Select,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  EventFilters as EventFiltersType,
  PageView,
} from '../../../types';

type Props = {
  pageView: PageView,
  eventFilters: EventFiltersType,
  onEventFiltersChange: (partialState: $Shape<EventFiltersType>) => void,
  onPageViewChange: Function,
  competitions: Array<SelectOption>,
  teams: Array<SelectOption>,
  turnarounds: Array<Turnaround>,
};

const gameDaysItems = defaultMapToOptions(gameDaysOptions());

const EventFilters = (props: I18nProps<Props>) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const pageFilter = (
    <div className="planning__eventFiltersDropdown">
      <Select
        options={[
          { value: 'SCHEDULE', label: props.t('Schedule') },
          { value: 'TIMELINE', label: props.t('Timeline') },
          { value: 'WORKLOAD', label: props.t('Workload') },
        ]}
        onChange={(option) => props.onPageViewChange(option)}
        value={props.pageView}
        showAutoWidthDropdown
      />
    </div>
  );
  const dateFilter = (
    <div className="planning__eventFiltersDropdown planning__eventFiltersDropdown--daterange">
      <DateRangePicker
        position="right"
        onChange={(selectedDateRange) =>
          props.onEventFiltersChange({ dateRange: selectedDateRange })
        }
        value={props.eventFilters.dateRange}
        turnaroundList={props.turnarounds}
        allowFutureDate
        kitmanDesignSystem
      />
    </div>
  );
  const eventFilter = (
    <div className="planning__eventFiltersDropdown">
      <Select
        options={[
          { value: 'game_event', label: props.t('Games') },
          { value: 'session_event', label: props.t('Sessions') },
          ...(window.featureFlags['custom-events']
            ? [
                {
                  value: 'custom_event',
                  label: props.t('Event'),
                },
              ]
            : []),
        ]}
        onChange={(selectedEventTypes) =>
          props.onEventFiltersChange({ eventTypes: selectedEventTypes })
        }
        value={props.eventFilters.eventTypes}
        placeholder={props.t('Events')}
        isMulti
        showAutoWidthDropdown
      />
    </div>
  );
  const competitionFilter = (
    <div className="planning__eventFiltersDropdown">
      <Select
        options={props.competitions}
        onChange={(selectedCompetitions) =>
          props.onEventFiltersChange({ competitions: selectedCompetitions })
        }
        value={props.eventFilters.competitions}
        placeholder={props.t('Competition')}
        isMulti
        showAutoWidthDropdown
      />
    </div>
  );
  const gamedaysFilter = (
    <div className="planning__eventFiltersDropdown">
      <Select
        options={gameDaysItems}
        onChange={(selectedGameDays) =>
          props.onEventFiltersChange({ gameDays: selectedGameDays })
        }
        value={props.eventFilters.gameDays}
        placeholder={props.t('Game day')}
        isMulti
        showAutoWidthDropdown
      />
    </div>
  );
  const teamFilter = (
    <div className="planning__eventFiltersDropdown">
      <Select
        options={props.teams}
        onChange={(selectedOppositions) =>
          props.onEventFiltersChange({ oppositions: selectedOppositions })
        }
        value={props.eventFilters.oppositions}
        placeholder={props.t('Opposition')}
        isMulti
        showAutoWidthDropdown
      />
    </div>
  );

  return (
    <>
      <div className="planning__eventFilters planning__eventFilters--desktop">
        {window.getFlag('planning-toggle-to-other-planning-views') &&
          pageFilter}
        {dateFilter}
        {eventFilter}
        {competitionFilter}
        {gamedaysFilter}
        {teamFilter}
      </div>

      <div className="planning__eventFilters planning__eventFilters--mobile">
        {dateFilter}

        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowFilterPanel(true)}
          kitmanDesignSystem
        />

        <SlidingPanel
          isOpen={showFilterPanel}
          title={props.t('Filters')}
          togglePanel={() => setShowFilterPanel(false)}
        >
          <div className="planning__eventFiltersPanel">
            {competitionFilter}
            {eventFilter}
            {gamedaysFilter}
            {teamFilter}
          </div>
        </SlidingPanel>
      </div>
    </>
  );
};

export const EventFiltersTranslated = withNamespaces()(EventFilters);
export default EventFilters;
