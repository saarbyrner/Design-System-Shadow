// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { breakPoints } from '@kitman/common/src/variables';
import {
  InputText,
  Select,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { EventDevelopmentGoal } from '@kitman/modules/src/PlanningHub/src/services/getEventDevelopmentGoals';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type InitialItems = Array<{ id: number | string, name: string }>;
export type FilterItem =
  | 'athlete'
  | 'position'
  | 'development_goal_type'
  | 'principle';

type Props = {
  eventDevelopmentGoals: Array<EventDevelopmentGoal>,
  onFilterByItem: (
    filterItem: FilterItem,
    filterItemIds: Array<number>
  ) => void,
  areCoachingPrinciplesEnabled: boolean,
  onFilterBySearch: (chars: string) => void,
};

const style = {
  desktopFilters: {
    display: 'flex',
    width: '100%',
    [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
  },
  mobileFilters: {
    [`@media only screen and (min-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
  },
  filter: {
    flex: 1,
    margin: '8px 0 0 0',
    minWidth: '176px',
    [`@media only screen and (min-width: ${breakPoints.desktop})`]: {
      margin: '0 8px 0 0',
      maxWidth: '200px',
    },
  },
  filtersPanel: {
    padding: '0 25px',
  },
};

const getListWithNoRepeatedItems = (initialItems: InitialItems): InitialItems =>
  Array.from(
    initialItems
      .reduce(
        (accItems, nextItem) =>
          accItems.set(nextItem.id, {
            id: nextItem.id,
            name: nextItem.name,
          }),
        new Map()
      )
      .values()
  );

const getSelectOptions = (items: InitialItems): Array<Option> =>
  items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

const DevelopmentGoalsFilters = (props: I18nProps<Props>) => {
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);
  const [searchChars, setSearchChars] = useState('');
  const [selectedAthletes, setSelectedAthletes] = useState<Array<number>>([]);
  const [selectedPositions, setSelectedPositions] = useState<Array<number>>([]);
  const [selectedTypes, setSelectedTypes] = useState<Array<number>>([]);
  const [selectedPrinciples, setSelectedPrinciples] = useState<Array<number>>(
    []
  );

  const athleteEvents = props.eventDevelopmentGoals.map(
    (eventDevelopmentGoal) => eventDevelopmentGoal.athlete_event
  );

  const developmentGoalItems = props.eventDevelopmentGoals.flatMap(
    (eventDevelopmentGoal) => eventDevelopmentGoal.event_development_goals
  );

  const athletes = athleteEvents.map((athleteEvent) => ({
    id: athleteEvent.athlete.id,
    name: athleteEvent.athlete.fullname,
  }));
  const selectableAthletes = getSelectOptions(athletes);

  const positions = athleteEvents.map((athleteEvent) => ({
    id: athleteEvent.athlete.position.id,
    name: athleteEvent.athlete.position.name,
  }));
  const selectablePositions = getSelectOptions(
    getListWithNoRepeatedItems(positions)
  );

  const types = developmentGoalItems.flatMap(
    (eventDevelopmentGoalItem) =>
      eventDevelopmentGoalItem.development_goal.development_goal_types
  );
  const selectableTypes = getSelectOptions(getListWithNoRepeatedItems(types));

  const principles = developmentGoalItems.flatMap(
    (eventDevelopmentGoalItem) =>
      eventDevelopmentGoalItem.development_goal.principles
  );
  const selectablePrinciples = getSelectOptions(
    getListWithNoRepeatedItems(principles)
  );

  const filterBySearch = useDebouncedCallback((value: string) => {
    props.onFilterBySearch(value);
  }, 400);

  const filterByItem = useDebouncedCallback(
    (filterItem: FilterItem, filterItemIds: Array<number>) => {
      props.onFilterByItem(filterItem, filterItemIds);
    },
    400
  );

  const searchFilter = (
    <div className="developmentGoalsFilters__filter" css={style.filter}>
      <InputText
        placeholder={props.t('Search')}
        onValidation={({ value = '' }) => {
          if (value === searchChars) {
            return;
          }
          setSearchChars(value);
          filterBySearch(value);
        }}
        value={searchChars}
        kitmanDesignSystem
        searchIcon
      />
    </div>
  );
  const athleteFilter = (
    <div className="developmentGoalsFilters__filter" css={style.filter}>
      <Select
        placeholder={props.t('Athlete')}
        options={selectableAthletes}
        onChange={(athleteIds) => {
          setSelectedAthletes(athleteIds);
          filterByItem('athlete', athleteIds);
        }}
        value={selectedAthletes}
        isMulti
      />
    </div>
  );
  const positionsFilter = (
    <div className="developmentGoalsFilters__filter" css={style.filter}>
      <Select
        placeholder={props.t('Positions')}
        options={selectablePositions}
        onChange={(positionIds) => {
          setSelectedPositions(positionIds);
          filterByItem('position', positionIds);
        }}
        value={selectedPositions}
        isMulti
      />
    </div>
  );

  const typeFilter = (
    <div className="developmentGoalsFilters__filter" css={style.filter}>
      <Select
        placeholder={props.t('Type')}
        options={selectableTypes}
        onChange={(typeIds) => {
          setSelectedTypes(typeIds);
          filterByItem('development_goal_type', typeIds);
        }}
        value={selectedTypes}
        isMulti
      />
    </div>
  );
  const principleFilter = (
    <div className="developmentGoalsFilters__filter" css={style.filter}>
      <Select
        placeholder={props.t('Principle')}
        options={selectablePrinciples}
        onChange={(principleIds) => {
          setSelectedPrinciples(principleIds);
          filterByItem('principle', principleIds);
        }}
        value={selectedPrinciples}
        isMulti
      />
    </div>
  );

  return (
    <>
      <div
        className="developmentGoalsFilters developmentGoalsFilters--desktop"
        css={style.desktopFilters}
      >
        {searchFilter}
        {athleteFilter}
        {positionsFilter}
        {typeFilter}
        {props.areCoachingPrinciplesEnabled && principleFilter}
      </div>
      <div
        className="developmentGoalsFilters developmentGoalsFilters--mobile"
        css={style.mobileFilters}
      >
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setIsFilterPanelShown(true)}
          kitmanDesignSystem
        />
        <SlidingPanel
          isOpen={isFilterPanelShown}
          kitmanDesignSystem
          title={props.t('Filters')}
          togglePanel={() => setIsFilterPanelShown(false)}
        >
          <div css={style.filtersPanel}>
            {searchFilter}
            {athleteFilter}
            {positionsFilter}
            {typeFilter}
            {principleFilter}
          </div>
        </SlidingPanel>
      </div>
    </>
  );
};

export const DevelopmentGoalsFiltersTranslated = withNamespaces()(
  DevelopmentGoalsFilters
);
export default DevelopmentGoalsFilters;
