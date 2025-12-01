// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type {
  Event,
  AthleteEvent,
  EventActivity,
  EventActivityAthlete,
} from '@kitman/common/src/types/Event';
import type { ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import {
  AppStatus,
  TextButton,
  DelayedLoadingFeedback,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  AthleteFiltersTranslated as AthleteFilters,
  INITIAL_ATHLETE_FILTER,
} from '../AthleteFilters';
import { ParticipationGridTranslated as ParticipationGrid } from './ParticipationGrid';
import searchAthletes from '../../services/searchAthletes';
import type { RequestStatus, AthleteFilter } from '../../../types';

import PlanningTab from '../PlanningTabLayout';

type Props = {
  eventId: $PropertyType<Event, 'id'>,
  eventType: $PropertyType<Event, 'type'>,
  canViewAvailabilities: boolean,
  participationLevels: Array<ParticipationLevel>,
  isLoading: boolean,
  onClose: Function,
  activities: Array<EventActivity>,
  onSelectParticipant: Function,
  onSelectAllParticipants: Function,
};

const AthleteParticipation = (props: I18nProps<Props>) => {
  const [fetchAthletesRequestStatus, setFetchAthletesRequestStatus] =
    useState<RequestStatus>('LOADING');
  const [athletes, setAthletes] = useState([]);
  const [athleteFilter, setAthleteFilter] = useState(INITIAL_ATHLETE_FILTER);

  const transformAthletes = (
    athleteResponse: Array<AthleteEvent>
  ): Array<EventActivityAthlete> => {
    return athleteResponse.map((athleteEvent) => {
      return {
        avatar_url: athleteEvent.athlete.avatar_url,
        id: athleteEvent.athlete.id,
        name: athleteEvent.athlete.fullname,
        participation_level: athleteEvent.participation_level.name,
        availability: athleteEvent.athlete.availability,
        position: {
          id: athleteEvent.athlete.position.id,
          name: athleteEvent.athlete.position.name,
        },
      };
    });
  };

  const fetchAthletes = (eventId, filters) => {
    Promise.all([searchAthletes(eventId, filters, true)]).then(
      ([fetchedAthletes]) => {
        setAthletes(transformAthletes(fetchedAthletes));
        setFetchAthletesRequestStatus('SUCCESS');
      },
      () => setFetchAthletesRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    fetchAthletes(props.eventId, INITIAL_ATHLETE_FILTER);
  }, []);

  const onAthleteFilterChange = (newFilter: AthleteFilter) => {
    setAthleteFilter(newFilter);
    fetchAthletes(props.eventId, newFilter);
  };

  const renderContent = () => {
    switch (fetchAthletesRequestStatus) {
      case 'LOADING':
        return <DelayedLoadingFeedback />;
      case 'SUCCESS':
        return (
          <>
            <PlanningTab>
              <PlanningTab.TabHeader>
                <PlanningTab.TabTitle>
                  {props.t('Athletes participation')}
                </PlanningTab.TabTitle>
                <PlanningTab.TabActions>
                  <TextButton
                    text={props.t('Done')}
                    type="primary"
                    onClick={() => props.onClose()}
                    kitmanDesignSystem
                  />
                </PlanningTab.TabActions>
              </PlanningTab.TabHeader>
              <PlanningTab.TabFilters>
                <AthleteFilters
                  eventType={props.eventType}
                  athleteFilter={athleteFilter}
                  onFilterChange={(newFilter) =>
                    onAthleteFilterChange(newFilter)
                  }
                  participationLevels={props.participationLevels}
                  canViewAvailabilities={props.canViewAvailabilities}
                  showSquads={false}
                  hideNoneOption
                />
              </PlanningTab.TabFilters>
              <PlanningTab.TabContent>
                <ParticipationGrid
                  type="ATHLETE"
                  participants={athletes}
                  activities={props.activities}
                  onSelectParticipant={props.onSelectParticipant}
                  onSelectAllParticipants={props.onSelectAllParticipants}
                  canViewAvailabilities={props.canViewAvailabilities}
                  isLoading={props.isLoading}
                />
              </PlanningTab.TabContent>
            </PlanningTab>
          </>
        );
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return null;
    }
  };

  return renderContent();
};

export const AthleteParticipationTranslated =
  withNamespaces()(AthleteParticipation);
export default AthleteParticipation;
