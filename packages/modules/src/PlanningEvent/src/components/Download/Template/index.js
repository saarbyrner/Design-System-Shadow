// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';

import {
  type Event,
  type AthleteEvent,
  type DownloadTemplateAthlete,
  type EventActivityV2,
  type DownloadTemplateEventActivity,
  type SportType,
} from '@kitman/common/src/types/Event';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { type ParticipationLevel } from '@kitman/modules/src/OrganisationSettings/src/types';
import { INITIAL_ATHLETE_FILTER } from '@kitman/modules/src/PlanningEvent/src/components/AthleteFilters';
import { type RequestStatus } from '@kitman/modules/src/PlanningEvent/types';
import searchAthletes from '@kitman/modules/src/PlanningEvent/src/services/searchAthletes';
import {
  getEventActivities,
  getEventActivityGlobalStates,
  getEventsUsers,
} from '@kitman/services/src/services/planning';

import { TemplateHeaderTranslated as Header } from './TemplateHeader';
import { AvailableAthletesTranslated as AvailableAthletes } from './AvailableAthletes';
import { ActivitiesTranslated as Activities } from './Activities';
import { ActivitiesV2Translated as ActivitiesV2 } from './ActivitiesV2';

import style from './style';

type Props = I18nProps<{
  event: Event,
  orgTimezone: string,
  orgLogoPath: string,
  orgName: string,
  orgSport: SportType,
  squadName: string,
  template: string,
  disableSaveButton: () => void,
  gameParticipationLevels: Array<ParticipationLevel>,
  areCoachingPrinciplesEnabled: boolean,
  showParticipants: boolean,
  showNotes: boolean,
}>;

const Template = (props: Props) => {
  const isMounted = useRef<boolean>(false);

  const [fetchRequestStatus, setFetchRequestStatus] =
    useState<RequestStatus>('LOADING');
  const [athletes, setAthletes] = useState([]);
  const [areAthletesMissing, setAreAthletesMissing] = useState<boolean>(false);
  const [
    transformedEventSessionActivities,
    setTransformedEventSessionActivities,
  ] = useState<Array<DownloadTemplateEventActivity>>([]);
  const [eventSessionActivities, setEventSessionActivities] = useState<
    Array<EventActivityV2>
  >([]);

  const transformAthletes = (
    athleteResponse: Array<AthleteEvent>
  ): Array<DownloadTemplateAthlete> => {
    return athleteResponse.map((athleteEvent) => {
      return {
        id: athleteEvent.athlete.id,
        firstname: athleteEvent.athlete.firstname,
        lastname: athleteEvent.athlete.lastname,
        participation_level:
          athleteEvent.participation_level.canonical_participation_level,
        position: athleteEvent.athlete.position.name,
      };
    });
  };

  const transformActivities = (
    activityResponse: Array<EventActivityV2>
  ): Array<DownloadTemplateEventActivity> => {
    return activityResponse.map((activity) => {
      return {
        id: activity.id,
        activityname: activity.event_activity_type?.name,
        drillname: activity.event_activity_drill?.name,
        duration: activity.duration,
        principles: props.areCoachingPrinciplesEnabled
          ? activity.principles
          : [],
        notes: activity.event_activity_drill?.notes,
        participants: athletes.filter((ath) => {
          return activity.athletes.find((a) => a.id === ath.id);
        }),
        attachment: activity.event_activity_drill?.diagram,
        event_activity_drill_labels:
          activity.event_activity_drill?.event_activity_drill_labels,
      };
    });
  };

  const fetchAndSetEventSessionActivities = async () => {
    let activities;
    try {
      activities = await getEventActivities({ eventId: props.event.id });
    } catch {
      if (!isMounted.current) return;
      setFetchRequestStatus('FAILURE');
      return;
    }

    let athletesCounts;
    let availableStaff;
    try {
      [athletesCounts, availableStaff] = await Promise.all([
        getEventActivityGlobalStates({
          eventId: +props.event.id,
          eventActivityIds: activities.map(({ id }) => id),
        }),
        getEventsUsers({
          eventId: props.event.id,
        }),
      ]);
    } catch {
      if (!isMounted.current) return;
      setFetchRequestStatus('FAILURE');
      return;
    }

    if (!isMounted.current) return;
    setEventSessionActivities(
      activities.map((activity) => {
        const { count: available, totalCount: total } =
          athletesCounts.find(
            ({ eventActivityId }) => eventActivityId === activity.id
          ) ?? {};

        return {
          ...activity,
          participants: {
            athletes: {
              available,
              total,
            },
            staff: {
              available: availableStaff.filter(({ event_activity_ids: ids }) =>
                ids.includes(activity.id)
              ).length,
              total: props.event.event_users.length,
            },
          },
        };
      })
    );
    const transformed = transformActivities(activities);
    setTransformedEventSessionActivities(transformed);
    setFetchRequestStatus('SUCCESS');
    props.disableSaveButton();
  };

  const fetchAndSetAthletes = (eventId, filters) => {
    searchAthletes(eventId, filters, true).then((fetchedAthletes) => {
      const transformed = transformAthletes(fetchedAthletes);
      if (!isMounted.current) return;
      if (transformed.length === 0) setAreAthletesMissing(true);
      setAthletes(transformed);
    });
  };

  useEffect(() => {
    isMounted.current = true;

    fetchAndSetAthletes(props.event.id, INITIAL_ATHLETE_FILTER);

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (athletes.length === 0) return;
    fetchAndSetEventSessionActivities();
  }, [athletes]);

  const renderContent = () => {
    if (areAthletesMissing)
      return (
        <div css={style.addAthletesMessage}>
          {props.t('Please add athletes to the session')}
        </div>
      );
    if (fetchRequestStatus === 'LOADING') return <DelayedLoadingFeedback />;
    if (fetchRequestStatus === 'SUCCESS') {
      return (
        <>
          <Header
            event={props.event}
            orgTimezone={props.orgTimezone}
            orgLogoPath={props.orgLogoPath}
            orgName={props.orgName}
            squadName={props.squadName}
          />

          <AvailableAthletes
            athletes={athletes}
            gameParticipationLevels={props.gameParticipationLevels}
          />

          <div className="template__seperator" />
          {window.getFlag('planning-tab-sessions') ? (
            <ActivitiesV2
              activities={eventSessionActivities}
              templateType={props.template}
              areParticipantsDisplayed={props.showParticipants}
              areNotesDisplayed={props.showNotes}
              organisationSport={props.orgSport}
            />
          ) : (
            <Activities
              template={props.template}
              activities={transformedEventSessionActivities}
              showParticipants={props.showParticipants}
              showNotes={props.showNotes}
            />
          )}
        </>
      );
    }
    if (fetchRequestStatus === 'FAILURE') return <AppStatus status="error" />;
    return null;
  };

  return (
    // The class is the hook for html2pdf, without it the printing won’t work.
    // See packages/modules/src/PlanningEvent/src/components/Download/DownloadOptionsModal.js.
    <div className="template" css={style.template}>
      {renderContent()}
    </div>
  );
};

export const TemplateTranslated = withNamespaces()(Template);
export default Template;
