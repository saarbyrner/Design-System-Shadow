// @flow
import React, { useState, useMemo, useEffect } from 'react';
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';

import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Select } from '@kitman/components';
import type { TableElementFilters } from '../../types';
import Panel from '../Panel';
import { SessionTypeFilterTranslated as SessionTypeFilter } from './components/SessionTypeFilter';
import { WeekOfTrainingFilterTranslated as WeekOfTrainingFilter } from './components/WeekOfTrainingFilter';
import { MatchDayFilterTranslated as MatchDayFilter } from './components/MatchDayFilter';

type Props = {
  children: Node,
  isOpen: boolean,
  filters: TableElementFilters,
  onClickOpenFilters: Function,
  onClickCloseFilters: Function,
  supportedFilters: Array<{| label: string, value: string |}>,
  onSetFilters: Function,
};

const styles = {
  linkContainer: { margin: '20px', textAlign: 'right' },
  link: {
    color: colors.blue_100,
    cursor: 'pointer',
    '&:hover': {
      color: colors.blue_100,
    },
    '&:active': {
      color: colors.blue_100,
    },
    '&:visited': {
      color: colors.blue_300,
    },
    '&.textLink--disabled': {
      color: colors.blue_300,

      '&:active': {
        color: colors.blue_300,
        cursor: 'not-allowed',
        textDecoration: 'none',
      },
      '&:hover': {
        color: colors.blue_300,
        cursor: 'not-allowed',
        textDecoration: 'none',
      },
      '&:visited': {
        color: colors.blue_300,
        cursor: 'not-allowed',
        textDecoration: 'none',
      },
    },
  },
};

const filterMapping = {
  training_session_types: 'activity_group_ids',
  time_loss: 'time_loss',
  competitions: 'competitions',
  event_types: 'activity_group_ids',
  session_type: 'session_type',
  micro_cycle: 'micro_cycle',
  match_days: 'match_day_number',
};

function PanelFilters(props: I18nProps<Props>) {
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    const filters = props.filters ?? {};
    const allFiltersEmpty = Object.values(filters).every(
      (filter) => Array.isArray(filter) && filter.length === 0
    );

    if (selectedFilters.length === 0 && (!props.filters || allFiltersEmpty)) {
      setSelectedFilters([]);
      return;
    }

    // Default the filter
    if (props.supportedFilters.length === 1) {
      setSelectedFilters([props.supportedFilters[0].value]);
      return;
    }

    /**
     * Session Types has two sub items: `training_session_types` and `event_types`.
     * They both are mapped to `activity_group_ids` in the `filterMapping`.
     * This handles the duplication ensuring Session Types filter is pre-populated
     * with appropriate values if either of the sub items was chosen.
     */
    setSelectedFilters(
      Array.from(
        new Set(
          Object.keys(props.filters)
            .filter((key) => props.filters[key].length > 0)
            .map((key) => filterMapping[key])
        )
      )
    );
  }, [props.filters, props.supportedFilters]);

  const availableFilters = useMemo(() => {
    return props.supportedFilters.filter(
      ({ value }) => !selectedFilters.includes(value)
    );
  }, [selectedFilters, props.supportedFilters]);

  // Open the filters block by default if there are multiple filters supported
  useEffect(() => {
    if (props.supportedFilters.length > 1) {
      props.onClickOpenFilters();
    }
  }, []);

  const addFilter = (key) => {
    setSelectedFilters((current) => [...current, key]);
  };

  const removeFilter = (key) => {
    const newFilters = [...selectedFilters];
    newFilters.splice(selectedFilters.indexOf(key), 1);
    setSelectedFilters(newFilters);
    props.onSetFilters(key, []);
  };

  const initWeekOfTrainingFilter = () => {
    return (
      <PanelFilters.WeekOfTrainingFilter
        noChangeOnUnload
        data-testid="WeekOfTrainingFilter"
        isPanelOpen={props.isOpen}
        selectedWeekOfTraining={props.filters?.micro_cycle || []}
        onSelectWeekOfTraining={(value) => {
          props.onSetFilters('micro_cycle', value);
        }}
        includeIconConfig={{
          iconName: 'icon-close',
          onClick: () => {
            removeFilter('micro_cycle');
            props.onSetFilters('micro_cycle', []);
          },
        }}
      />
    );
  };

  const initFilter = (key) => {
    switch (key) {
      case 'activity_group_ids':
        return (
          <PanelFilters.SessionType
            noChangeOnUnload
            data-testid="SessionTypeFilters"
            selectedSessionTypes={props.filters?.training_session_types || []}
            selectedEventTypes={props.filters?.event_types || []}
            onSelectSessionTypes={(value) => {
              props.onSetFilters('training_session_types', value);
            }}
            onSelectEventTypes={(value) => {
              props.onSetFilters('event_types', value);
            }}
            includeIconConfig={{
              iconName: 'icon-close',
              onClick: () => {
                removeFilter('activity_group_ids');
                props.onSetFilters('training_session_types', []);
                props.onSetFilters('event_types', []);
              },
            }}
          />
        );
      case 'micro_cycle':
        return initWeekOfTrainingFilter();
      case 'match_day_number':
        return (
          window.getFlag('rep-match-day-filter') && (
            <PanelFilters.MatchDay
              data-testid="MatchDayFilters"
              selectedMatchDays={props.filters?.match_days || []}
              onSelectMatchDays={(value) => {
                props.onSetFilters('match_days', value);
              }}
              includeIconConfig={{
                iconName: 'icon-close',
                onClick: () => {
                  removeFilter('match_days');
                  props.onSetFilters('match_day_number', []);
                },
              }}
            />
          )
        );
      default:
        return <></>;
    }
  };

  return props.isOpen || props.supportedFilters.length > 1 ? (
    <>
      <Panel.Divider />
      <Panel.SectionTitle data-testid="PanelFilters|Title">
        {props.t('Filters')}
      </Panel.SectionTitle>
      <div>
        {selectedFilters.map((key) => (
          <React.Fragment key={key}> {initFilter(key)} </React.Fragment>
        ))}
        <Panel.Field>
          {availableFilters.length > 0 && (
            <Select
              key="ApplyFiltersSelect"
              data-testid="ApplyFiltersSelect"
              options={availableFilters}
              onChange={addFilter}
              value=""
              placeholder={props.t('Add filter')}
              menuPosition="fixed"
              appendToBody
            />
          )}
        </Panel.Field>
      </div>
      {props.children}
      {props.supportedFilters.length === 1 && (
        <div css={styles.linkContainer}>
          <a
            data-testid="PanelFilters|Cancel"
            onClick={props.onClickCloseFilters}
            css={styles.link}
          >
            {props.t('Cancel')}
          </a>
        </div>
      )}
    </>
  ) : (
    props.supportedFilters.length > 0 && (
      <div css={styles.linkContainer}>
        <a
          data-testid="PanelFilters|AddFilter"
          onClick={props.onClickOpenFilters}
          css={styles.link}
        >
          {props.t('Add Filter')}
        </a>
      </div>
    )
  );
}

PanelFilters.SessionType = SessionTypeFilter;
PanelFilters.WeekOfTrainingFilter = WeekOfTrainingFilter;
PanelFilters.MatchDay = MatchDayFilter;

export const PanelFiltersTranslated = withNamespaces()(PanelFilters);
export default PanelFilters;
