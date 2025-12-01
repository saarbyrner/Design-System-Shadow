// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  InputText,
  Select,
  SlidingPanel,
  TextButton,
  DelayedLoadingFeedback,
} from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { getAvailabilityList } from '@kitman/common/src/utils/workload';
import { getPositionGroups, getSquads } from '@kitman/services';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteFilter } from '../../../types';

type Props = {
  athleteFilter: AthleteFilter,
  onFilterChange: Function,
  participationLevels: Array<ParticipationLevel>,
  canViewAvailabilities: boolean,
  showSquads: boolean,
  showParticipationLevels: boolean,
  showPositions: boolean,
  showNoneParticipationLevels: boolean,
};

export const INITIAL_ATHLETE_FILTER = {
  athlete_name: '',
  positions: [],
  squads: [],
  availabilities: [],
  participation_levels: [],
};

const availabilityOptions = defaultMapToOptions(getAvailabilityList());

const AthleteFilters = (props: I18nProps<Props>) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [positions, setPositions] = useState();
  const [squads, setSquads] = useState();
  const [requestStatus, setRequestStatus] = useState('LOADING');
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState();

  const setFailedStatus = () => setRequestStatus('FAILURE');

  const filteredParticipationLevels = () => {
    const participationLevels = props.showNoneParticipationLevels
      ? props.participationLevels
      : props.participationLevels.filter(
          (participationLevel) =>
            participationLevel.name !== 'No participation' &&
            participationLevel.canonical_participation_level !== 'none'
        );
    return participationLevels.map((participationLevel) => ({
      value: participationLevel.id,
      label: participationLevel.name,
      canonical_participation_level:
        participationLevel.canonical_participation_level,
      include_in_group_calculations:
        participationLevel.include_in_group_calculations,
    }));
  };

  useEffect(() => {
    if (props.showSquads || props.showPositions) {
      Promise.all([getPositionGroups(), getSquads()]).then(
        ([positionGroupsData, squadsData]) => {
          setPositions(
            positionGroupsData.map((group) => ({
              value: group.id,
              label: group.name,
              // eslint-disable-next-line max-nested-callbacks
              options: group.positions.map((position) => ({
                value: position.id,
                label: position.name,
              })),
            }))
          );
          setSquads(
            squadsData.map((squad) => ({ value: squad.id, label: squad.name }))
          );
          setRequestStatus('SUCCESS');
          setIsInitialDataLoaded(true);
        },
        () => setFailedStatus()
      );
    } else {
      setRequestStatus('SUCCESS');
      setIsInitialDataLoaded(true);
    }
  }, []);

  if (!isInitialDataLoaded) {
    switch (requestStatus) {
      case 'LOADING':
        return <DelayedLoadingFeedback />;
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return null;
    }
  }

  const athleteFilter = (
    <div className="planningEventGridTab__filter">
      <InputText
        value={props.athleteFilter.athlete_name}
        onValidation={({ value }) =>
          props.onFilterChange({
            ...props.athleteFilter,
            athlete_name: value,
          })
        }
        placeholder={props.t('Search athletes')}
        kitmanDesignSystem
        searchIcon
      />
    </div>
  );
  const positionFilter = (
    <div className="planningEventGridTab__filter">
      <Select
        options={positions}
        onChange={(selectedItems) =>
          props.onFilterChange({
            ...props.athleteFilter,
            positions: selectedItems,
          })
        }
        value={props.athleteFilter.positions}
        placeholder={props.t('Position')}
        isMulti
      />
    </div>
  );
  const participationFilter = (
    <div className="planningEventGridTab__filter">
      <Select
        options={filteredParticipationLevels()}
        onChange={(selectedItems) =>
          props.onFilterChange({
            ...props.athleteFilter,
            participation_levels: selectedItems,
          })
        }
        value={props.athleteFilter.participation_levels}
        placeholder={props.t('Participation level')}
        isMulti
      />
    </div>
  );
  const squadFilter = (
    <div className="planningEventGridTab__filter">
      <Select
        options={squads}
        onChange={(selectedItems) =>
          props.onFilterChange({
            ...props.athleteFilter,
            squads: selectedItems,
          })
        }
        value={props.athleteFilter.squads}
        placeholder={props.t('Squad')}
        isMulti
      />
    </div>
  );
  const availabilityFilter = (
    <div className="planningEventGridTab__filter">
      <Select
        options={availabilityOptions}
        onChange={(selectedItems) =>
          props.onFilterChange({
            ...props.athleteFilter,
            availabilities: selectedItems,
          })
        }
        value={props.athleteFilter.availabilities}
        placeholder={props.t('Availability')}
        isMulti
      />
    </div>
  );

  return (
    <>
      <div className="planningEventGridTab__filters planningEventGridTab__filters--desktop">
        {athleteFilter}
        {props.canViewAvailabilities && availabilityFilter}
        {props.showPositions && positionFilter}
        {props.showSquads && squadFilter}
        {props.showParticipationLevels && participationFilter}
      </div>

      <div className="planningEventGridTab__filters planningEventGridTab__filters--mobile">
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowFilterPanel(true)}
          kitmanDesignSystem
        />

        <SlidingPanel
          isOpen={showFilterPanel}
          kitmanDesignSystem
          title={props.t('Filters')}
          togglePanel={() => setShowFilterPanel(false)}
        >
          <div className="planningEventGridTab__filtersPanel">
            {athleteFilter}
            {props.canViewAvailabilities && availabilityFilter}
            {props.showPositions && positionFilter}
            {props.showSquads && squadFilter}
            {props.showParticipationLevels && participationFilter}
          </div>
        </SlidingPanel>
      </div>
    </>
  );
};

export const AthleteFiltersTranslated = withNamespaces()(AthleteFilters);
export default AthleteFilters;
