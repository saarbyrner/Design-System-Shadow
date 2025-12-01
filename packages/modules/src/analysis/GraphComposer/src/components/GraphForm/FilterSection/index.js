// @flow
import { withNamespaces } from 'react-i18next';

import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Metric } from '@kitman/common/src/types/Metric';
import {
  IconButton,
  MultipleGroupSelector,
  MultiSelectDropdown,
} from '@kitman/components';
import type {
  GroupItems,
  GroupSelections,
  MultiSelectDropdownItems,
} from '@kitman/components/src/types';

type Props = {
  metricType: 'metric' | 'medical',
  filters: $PropertyType<Metric, 'filters'>,
  addFilter: Function,
  removeFilter: Function,
  updateTimeLossFilters?: Function,
  updateSessionTypeFilters: Function,
  updateCompetitionFilters?: Function,
  timeLossTypes?: MultiSelectDropdownItems,
  sessionsTypes?: MultiSelectDropdownItems,
  eventTypes?: GroupItems,
  trainingSessionTypes?: GroupItems,
  updateEventTypeFilters?: Function,
  updateTrainingSessionTypeFilters?: Function,
  medicalCategory?: ?$PropertyType<Metric, 'main_category'>,
  competitions?: MultiSelectDropdownItems,
};

const FilterSection = (props: I18nProps<Props>) => {
  const onClickTimeLossFilterItem = (clickedFilter) => {
    const filterIndex = props.filters.time_loss.indexOf(clickedFilter.id);

    const newTimeLossFilters =
      filterIndex === -1
        ? [...props.filters.time_loss, clickedFilter.id]
        : [
            ...props.filters.time_loss.slice(0, filterIndex),
            ...props.filters.time_loss.slice(filterIndex + 1),
          ];

    if (props.updateTimeLossFilters) {
      props.updateTimeLossFilters(newTimeLossFilters);
    }
  };

  const onClickSessionTypeFilterItem = (clickedFilter) => {
    const filterIndex = props.filters.session_type.indexOf(clickedFilter.id);

    const newSessionTypeFilters =
      filterIndex === -1
        ? [...props.filters.session_type, clickedFilter.id]
        : [
            ...props.filters.session_type.slice(0, filterIndex),
            ...props.filters.session_type.slice(filterIndex + 1),
          ];

    if (props.updateSessionTypeFilters) {
      props.updateSessionTypeFilters(newSessionTypeFilters);
    }
  };

  const createGroupSelectionsFromFilters = (
    eventTypeFilterSelection: Array<string>,
    trainingSessionTypeFilterSelection: Array<number>
  ): GroupSelections => {
    const groupSelections = {};
    groupSelections.game = [];
    groupSelections.training_session = [];

    if (eventTypeFilterSelection && eventTypeFilterSelection.length > 0) {
      const gameIndex = eventTypeFilterSelection.indexOf('game');
      if (gameIndex !== -1) {
        groupSelections.game = [eventTypeFilterSelection[gameIndex]];
      }
    }
    if (
      trainingSessionTypeFilterSelection &&
      trainingSessionTypeFilterSelection.length > 0
    ) {
      groupSelections.training_session = trainingSessionTypeFilterSelection.map(
        (value) => {
          return value.toString();
        }
      );
    }
    return groupSelections;
  };

  const onGroupedFilterChanged = (groupedEventTypeFilters: GroupSelections) => {
    let gameActivities = [];
    let trainingSessionEvents = [];

    Object.keys(groupedEventTypeFilters).forEach((key) => {
      if (key === 'game') {
        gameActivities = groupedEventTypeFilters[key];
      } else if (key === 'training_session') {
        const numbers = groupedEventTypeFilters[key].map((value) =>
          Number(value)
        );
        trainingSessionEvents = numbers;
      }
    });

    if (props.updateEventTypeFilters) {
      props.updateEventTypeFilters(gameActivities);
    }

    if (props.updateTrainingSessionTypeFilters) {
      props.updateTrainingSessionTypeFilters(trainingSessionEvents);
    }
  };

  const onClickCompetitionFilterItem = (clickedFilter) => {
    const filterIndex = props.filters.competitions.indexOf(clickedFilter.id);

    const newCompetitionFilters =
      filterIndex === -1
        ? [...props.filters.competitions, clickedFilter.id]
        : [
            ...props.filters.competitions.slice(0, filterIndex),
            ...props.filters.competitions.slice(filterIndex + 1),
          ];

    if (props.updateCompetitionFilters) {
      props.updateCompetitionFilters(newCompetitionFilters);
    }
  };

  const renderFilterTypeFields = (metricType: 'metric' | 'medical') => {
    if (metricType === 'metric' && !window.getFlag('metric-session-filter')) {
      return null;
    }

    if (metricType === 'metric' && window.getFlag('metric-session-filter')) {
      return (
        <>
          <div className="col-xl-6">
            <MultipleGroupSelector
              label="Session Type (Filter)"
              showDropdownButton
              groupItems={[
                ...(props.eventTypes || []),
                ...(props.trainingSessionTypes || []),
              ]}
              activeSelections={createGroupSelectionsFromFilters(
                props.filters.event_types,
                props.filters.training_session_types
              )}
              onUpdatedSelection={onGroupedFilterChanged}
              maxHeight="390"
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="col-xl-3">
          <MultiSelectDropdown
            label={props.t('Time-loss (Filter)')}
            listItems={props.timeLossTypes}
            selectedItems={props.filters.time_loss}
            onItemSelect={onClickTimeLossFilterItem}
          />
        </div>
        <div className="col-xl-4">
          <MultiSelectDropdown
            label={props.t('Session Type (Filter)')}
            listItems={props.sessionsTypes}
            selectedItems={props.filters.session_type}
            onItemSelect={onClickSessionTypeFilterItem}
            disabled={props.medicalCategory === 'illness'}
          />
        </div>
        <div className="col-xl-4">
          <MultiSelectDropdown
            label={props.t('Competition (Filter)')}
            listItems={props.competitions}
            selectedItems={props.filters.competitions}
            onItemSelect={onClickCompetitionFilterItem}
            disabled={props.medicalCategory === 'illness'}
          />
        </div>
      </>
    );
  };

  return (
    <div className="row filterSection statusForm__row">
      {!props.filters && (
        <div className="col-xl-12 filterSection__addFilterButton">
          <IconButton
            text={props.t('Filter')}
            icon="icon-add"
            onClick={() => {
              TrackEvent('Graph Builder', 'Click', 'medical filter');
              props.addFilter();
            }}
            isSmall
          />
        </div>
      )}

      {props.filters && (
        <div className="filterSection__filters">
          {renderFilterTypeFields(props.metricType)}
          <div className="filterSection__removeFilterButton">
            <IconButton
              icon="icon-close"
              onClick={props.removeFilter}
              isSmall
              isTransparent
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const FilterSectionTranslated = withNamespaces()(FilterSection);
export default FilterSection;
