// @flow
import { useState, useEffect } from 'react';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';
import { isEqual } from 'lodash';

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import {
  getEventConditions,
  getParticipationLevels,
  getTerminologies,
  getAreCoachingPrinciplesEnabled,
} from '@kitman/services';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import _last from 'lodash/last';
import {
  useLocationPathname,
  useLocationSearch,
} from '@kitman/common/src/hooks';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { getIsRepeatableEvent } from '@kitman/common/src/utils/events';
import { useGetPlanningEventQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import { transformBeRecurrenceToFitFe } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import { venueTypes } from '@kitman/common/src/consts/gameEventConsts';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import i18n from '@kitman/common/src/utils/i18n';

import getAssessmentsTemplates from './src/services/getAssessmentTemplates';
import { AppTranslated as App } from './src/components/App';
import { getEventPeriods } from './src/services/eventPeriods';
import { getGameActivities } from './src/services/gameActivities';
import { transformGameActivitiesDataFromServer } from './src/components/GameEventsTab/utils';
import { setAssessmentTemplates } from './src/redux/actions';
import { getPermission } from './src/helpers/utils';
import { setSavedGameActivities } from './src/redux/slices/gameActivitiesSlice';
import { setSavedEventPeriods } from './src/redux/slices/eventPeriodsSlice';
import {
  setTeam,
  initialState as pitchViewInitialState,
} from './src/redux/slices/pitchViewSlice';
import { setApiAthleteEvents } from './src/redux/slices/athleteEventsSlice';
import getAthleteEvents from './src/services/getAthleteEvents';
import getPlanningHubEvent from '../PlanningHub/src/services/getPlanningHubEvent';
import useUpdateDmrStatus from './src/hooks/useUpdateDmrStatus';
import { add } from '../Toasts/toastsSlice';

const orgTimezone =
  document.getElementsByTagName('body')[0].dataset.timezone || '';

const PlanningEventApp = () => {
  const dispatch = useDispatch();
  const { isLeague, isLeagueStaffUser } = useLeagueOperations();
  const { getUpdatedDmrStatusInfo } = useUpdateDmrStatus();

  const { preferences } = usePreferences();
  const { data: permissions } = useGetPermissionsQuery();
  const [data, setData] = useState<?Object>();
  const [childData, setChildData] = useState<?Object>();
  const [event, setEvent] = useState<?Object>();
  const [childEvent, setChildEvent] = useState<?Object>();
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const [participationLevels, setParticipationLevels] = useState();
  const [areCoachingPrinciplesEnabled, setCoachingPrinciplesEnabled] =
    useState(false);
  const [activeTeamEventId, setActiveTeamEventId] = useState();
  const [skipFollowupEventCalls, setSkipFollowupEventCalls] = useState(false);

  /*
   * given the url /planning_hub/events/2
   * eventId is the last part of the URL (2)
   */
  const pathname = useLocationPathname();
  const eventId = +_last(pathname.split('/'));
  const locationSearch = useLocationSearch();
  const originalStartTime = locationSearch.get('original_start_time');

  const isMatchDayFlow = event?.league_setup && preferences?.league_game_team;

  const viewableEvent =
    isLeagueStaffUser && isMatchDayFlow ? childEvent : event;

  const availabilityInfoDisabledFlag = window.getFlag(
    'availability-info-disabled'
  );

  const { data: eventData } = useGetPlanningEventQuery(
    {
      eventId,
      originalStartTime,
      showAthletesAndStaff: isLeagueStaffUser,
      includeNotificationStatus: isMatchDayFlow,
      includeDmrStatus: !isLeagueStaffUser && isMatchDayFlow,
      includeDmrBlockedTime: preferences?.league_game_team_lock_minutes,
      includeChildDmrStatuses: isLeagueStaffUser && isMatchDayFlow,
      includeTvInfo:
        event?.league_setup && preferences?.league_game_information,
      includeRRuleInstance: true,
      includeDivision: isLeague,
    },
    {
      skip: !eventId,
    }
  );

  const formatEventData = (eventInfo, setEventData) => {
    setEventData({
      ...eventInfo.event,
      // $FlowIgnore[exponential-spread]
      ...(originalStartTime ? { start_date: originalStartTime } : {}),
      ...(getIsRepeatableEvent(eventInfo.event.type) &&
        eventInfo.event.recurrence.rule && {
          recurrence: {
            ...eventInfo.event.recurrence,
            rule: transformBeRecurrenceToFitFe({
              rule: eventInfo.event.recurrence.rule,
              startTime: originalStartTime
                ? eventInfo.event.recurrence.original_start_time
                : eventInfo.event.start_date,
            }),
          },
        }),
    });
  };

  const refetchGameComplianceRuleInfo = () => {
    if (viewableEvent) {
      getUpdatedDmrStatusInfo({
        eventId: viewableEvent.id,
        currentStatuses: viewableEvent?.dmr,
      }).then((complianceRuleStatuses) => {
        // if there are new rules completed to update our local event state
        if (!isEqual(complianceRuleStatuses, viewableEvent?.dmr)) {
          // prevents api refresh
          setSkipFollowupEventCalls(true);
          // if a league user, update the league parent event as well as the child event
          if (isLeagueStaffUser) {
            setChildEvent({ ...childEvent, dmr: complianceRuleStatuses });
            const updatedLeagueGameComplianceProperty =
              childEvent?.venue_type?.name === venueTypes.home
                ? 'home_dmr'
                : 'away_dmr';
            const currentEvent = structuredClone(event);
            currentEvent[updatedLeagueGameComplianceProperty] =
              complianceRuleStatuses;
            setEvent(currentEvent);
          } else {
            // if a club user update the event as normal
            setEvent({ ...event, dmr: complianceRuleStatuses });
          }
          dispatch(
            add({
              status: toastStatusEnumLike.Success,
              title: i18n.t(
                `Game compliance rules have been updated. Please refresh to get synced data!`
              ),
            })
          );
        }
      });
    }
  };

  // Check if requested event (using id from URL) exists
  useEffect(() => {
    if (eventData) {
      formatEventData(eventData, setEvent);
      setActiveTeamEventId(eventData.event.home_event_id);
    }
  }, [eventData]);

  useEffect(() => {
    if (isLeagueStaffUser && isMatchDayFlow && activeTeamEventId) {
      getPlanningHubEvent({
        eventId: activeTeamEventId,
        originalStartTime,
        includeDmrStatus: isMatchDayFlow,
        includeDmrBlockedTime: preferences?.league_game_team_lock_minutes,
      }).then((result) => {
        setChildData(result);
      });
    }
  }, [activeTeamEventId]);

  useEffect(() => {
    if (isLeagueStaffUser && isMatchDayFlow && childData) {
      setRequestStatus('PENDING');
      formatEventData(childData, setChildEvent);
    }
  }, [childData]);

  useEffect(() => {
    // Automatic background game compliance rules tracker
    if (viewableEvent?.type === 'game_event' && isMatchDayFlow) {
      const interval = setInterval(refetchGameComplianceRuleInfo, 30000);
      return () => {
        clearInterval(interval);
      };
    }
    return () => {};
  }, [viewableEvent]);

  useEffect(() => {
    if (viewableEvent && !skipFollowupEventCalls) {
      Promise.all([
        getEventConditions(),
        getAssessmentsTemplates(),
        getParticipationLevels(viewableEvent.type),
        getTerminologies(),
        getAreCoachingPrinciplesEnabled(),
        getEventPeriods({ eventId: viewableEvent.id }),
        getGameActivities({ eventId: viewableEvent.id }),
        getAthleteEvents(viewableEvent.id, {
          includeSquadName: true,
          includeSquadNumber: true,
          includePositionGroup: true,
          includeDesignation: true,
        }),
        $.get('/ui/initial_data_planning_hub_event'),
      ])
        .then(
          ([
            eventConditions,
            assessmentTemplates,
            participationLevelsData,
            terminologies,
            getAreCoachingPrinciplesEnabledResponse,
            fetchedEventPeriods,
            fetchedGameActivities,
            fetchedAthleteEvents,
            initialData,
          ]) => {
            setData({
              eventConditions,
              assessmentTemplates,
              terminologies,
              variables: initialData.variables,
              turnarounds: initialData.turnarounds,
              organisation: initialData.organisation,
              logo_path: initialData.logo_path,
              squad: initialData.squad,
              organisation_modules: initialData.organisation_modules,
            });
            setParticipationLevels(participationLevelsData);
            setCoachingPrinciplesEnabled(
              getAreCoachingPrinciplesEnabledResponse.value || false
            );

            const transformedActivities = transformGameActivitiesDataFromServer(
              fetchedGameActivities
            );
            dispatch(setSavedGameActivities(transformedActivities));
            dispatch(setSavedEventPeriods(fetchedEventPeriods));
            dispatch(setAssessmentTemplates(assessmentTemplates));
            dispatch(setTeam(pitchViewInitialState.team));
            dispatch(setApiAthleteEvents(fetchedAthleteEvents));
            setRequestStatus('SUCCESS');
          },
          () => setRequestStatus('FAILURE')
        )
        .catch(() => {
          setRequestStatus('FAILURE');
        });
    } else {
      setSkipFollowupEventCalls(false);
    }
  }, [viewableEvent]);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <App
          orgName={data?.organisation.name}
          orgLogoPath={data?.logo_path}
          squad={data?.squad}
          orgTimezone={orgTimezone}
          leagueEvent={event}
          // TODO: Remove prop drilling of event to replace with getEventSelector
          event={viewableEvent}
          activeTeamEventId={activeTeamEventId}
          setActiveTeamEventId={setActiveTeamEventId}
          eventConditions={data?.eventConditions}
          canEditEvent={getPermission({
            name: 'edit',
            event: viewableEvent,
            permissions,
          })}
          canDeleteEvent={getPermission({
            name: 'delete',
            event: viewableEvent,
            permissions,
          })}
          canViewAvailabilities={
            permissions.medical?.availability?.canView &&
            !availabilityInfoDisabledFlag
          }
          canCreateAsssessment={permissions.assessments?.canCreateAsssessment}
          canCreateAssessmentFromTemplate={
            permissions.assessments?.canCreateAssessmentFromTemplate
          }
          canAnswerAssessment={permissions.assessments?.canAnswerAssessment}
          canViewAsssessments={permissions.assessments?.canViewAsssessments}
          canViewProtectedMetrics={permissions.general?.canViewProtectedMetrics}
          canViewDevelopmentGoals={
            permissions.developmentGoals?.canViewDevelopmentGoals
          }
          canManageWorkload={permissions.workloads?.canManageWorkload}
          canViewIssues={permissions.medical?.issues?.canView}
          hasDevelopmentGoalsModule={data?.organisation_modules.includes(
            'development-goals'
          )}
          developmentGoalTerminology={
            data?.terminologies.find(
              (terminology) => terminology.key === 'development_goal'
            )?.customName
          }
          statusVariables={data?.variables}
          orgSport={window.organisationSport}
          onUpdateEvent={(eventInfo, skipFollowupCalls) => {
            if (skipFollowupCalls) setSkipFollowupEventCalls(true);
            if (isLeagueStaffUser) {
              setChildEvent(eventInfo);
            } else {
              setEvent(eventInfo);
            }
          }}
          onUpdateLeagueEvent={setEvent}
          turnaroundList={data?.turnarounds}
          participationLevels={participationLevels}
          areCoachingPrinciplesEnabled={areCoachingPrinciplesEnabled}
        />
      );
    default:
      return null;
  }
};

export default PlanningEventApp;
