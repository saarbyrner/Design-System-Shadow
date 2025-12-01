/* eslint-disable react/jsx-boolean-value */
// @flow
import { useState, useRef, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import { ButtonGroup, Button } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  AthleteEventStorage,
  Event,
  EventActivityV2,
  EventAttachment,
  SportType,
} from '@kitman/common/src/types/Event';
import { DiagramBuilderTab } from '@kitman/modules/src/PlanningEvent/src/components/DiagramBuilderTab';
import { type Turnaround } from '@kitman/common/src/types/Turnaround';
import { formatGameDayPlusMinus } from '@kitman/common/src/utils/workload';
import { TabBar, AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { getEventActivities } from '@kitman/services/src/services/planning';
import { type EventConditions } from '@kitman/services/src/services/getEventConditions';
import { type StatusVariable } from '@kitman/common/src/types';
import { type ParticipationLevel } from '@kitman/services/src/services/getParticipationLevels';
import { getParticipationLevelReasons } from '@kitman/services';
import { PlanningTabBar } from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabBar/index';
import getActivityTypes, {
  type ActivityType,
} from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import { EditEventPanelTranslated as EventSidePanel } from '@kitman/modules/src/PlanningEventSidePanel';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import { type Squad } from '@kitman/common/src/types/Squad';
import {
  useBrowserTabTitle,
  useIsMountedCheck,
} from '@kitman/common/src/hooks';
import { getEventName } from '@kitman/modules/src/PlanningEvent/src/helpers/utils';
import DeleteAttachmentModalContainer from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/DeleteAttachment/DeleteAttachmentContainer/index';
import type {
  ParticipationLevelSelectOption,
  RequestStatus,
} from '@kitman/modules/src/PlanningEvent/types';
import { type SetState } from '@kitman/common/src/types/react';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';
import MatchDayNotice from '@kitman/modules/src/MatchDay';
import { MatchDayEmailPanelTranslated as MatchDayEmailPanel } from '@kitman/modules/src/PlanningEvent/src/components/MatchDayEmailPanel';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';

import CollectionTab from '../containers/CollectionTab';
import {
  saveGridColumn,
  saveAssessmentGridColumn,
} from '../services/saveGridColumn';
import deleteGridColumn from '../services/deleteGridColumn';
import { DUPLICATED_EVENT_HASH } from '../constants';
import { PlanningEventContextProvider } from '../contexts/PlanningEventContext';
import { MandatoryFieldsToastTranslated as MandatoryFieldsToast } from './GameEventsTab/MandatoryFieldsToast/MandatoryFieldsToast';
import { AppHeaderTranslated as AppHeader } from './AppHeader';
import { AthletesTabTranslated as AthletesTab } from './AthletesTab';
import DevelopmentGoalsTab from './DevelopmentGoalsTab';
import { SessionPlanningTabTranslated as SessionPlanningTab } from './SessionPlanningTab';
import { PlanningTabTranslated as PlanningTab } from './PlanningTab';
import { AthletesSelectionTabTranslated as AthletesSelectionTab } from './AthletesSelectionTab';
import StaffSelectionTab from './StaffSelectionTab';
import { ImportedDataTabTranslated as ImportedDataTab } from './ImportedDataTab';
import { DownloadOptionsModalTranslated as DownloadOptionsModal } from './Download/DownloadOptionsModal';
import { CustomEventsAthletesTabTranslated as CustomEventsAthletesTab } from './CustomEventsAthletesTab';
import { StaffTabTranslated as StaffTab } from './StaffTab';
import { GameEventsTabTranslated as GameEventsTab } from './GameEventsTab';
import { AttachmentsTabTranslated as AttachmentsTab } from './AttachmentsTab';
import style from './style';

import { getMatchDayView } from '../redux/selectors/planningEventSelectors';
import { toggleMatchDayView } from '../redux/slices/planningEventSlice';

const GAME_EVENTS_TAB = '1';
const PLANNING_TAB_HASH = '#planning';
const PLANNING_TAB_KEY = '0';

type Props = I18nProps<{
  eventConditions: EventConditions,
  leagueEvent: Event,
  event: Event,
  activeTeamEventId: number,
  setActiveTeamEventId: (number) => void,
  canEditEvent: boolean,
  canDeleteEvent: boolean,
  canViewAvailabilities: boolean,
  canCreateAsssessment: boolean,
  canViewAsssessments: boolean,
  canAnswerAssessment: boolean,
  canCreateAssessmentFromTemplate: boolean,
  canViewProtectedMetrics: boolean,
  canViewDevelopmentGoals: boolean,
  canManageWorkload: boolean,
  canViewIssues: boolean,
  hasDevelopmentGoalsModule: boolean,
  areCoachingPrinciplesEnabled: boolean,
  statusVariables: Array<StatusVariable>,
  participationLevels: Array<ParticipationLevel>,
  orgSport: SportType,
  orgTimezone: string,
  orgLogoPath: string,
  orgName: string,
  developmentGoalTerminology: ?string,
  turnaroundList: Array<Turnaround>,
  onUpdateEvent: SetState<Event>,
  onUpdateLeagueEvent: SetState<Event>,
  squad: Squad,
}>;

const App = (props: Props) => {
  const { isLeagueStaffUser, isOrgSupervised } = useLeagueOperations();
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();

  const dispatch = useDispatch();

  const checkIsMounted = useIsMountedCheck();

  const matchDayView = useSelector(getMatchDayView());

  const isImportedGame =
    props.event.type === eventTypePermaIds.game.type &&
    props.event.league_setup;

  const isMatchDayFlow = isImportedGame && preferences?.league_game_team;
  const isMatchDayCommunicationsGame =
    isMatchDayFlow && preferences?.league_game_match_report;

  const { apiAthleteEvents: athleteEvents } = useSelector<AthleteEventStorage>(
    (state) => state.planningEvent.athleteEvents
  );

  const [documentTitle, setDocumentTitle] = useState('');
  useBrowserTabTitle([
    getEventName({
      event: props.event,
      squadName: props.squad.name,
      isPitchViewToggleEnabled:
        window.getFlag('planning-game-events-field-view') &&
        props.event.type === eventTypePermaIds.game.type,
      isDmnDmrLeagueGame: isMatchDayFlow && isLeagueStaffUser,
    }),
    documentTitle,
  ]);

  // TODO: Pass activityTypes to session planning rather then called again there
  const [activityTypes, setActivityTypes] =
    useState<?Array<ActivityType>>(null);
  const [reloadCollectionGrid, setReloadCollectionGrid] = useState(false);
  const [reloadPlanningActivities, setReloadPlanningActivities] =
    useState(false);
  const [reloadDevelopmentGoals, setReloadDevelopmentGoals] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDuplicateEventModalOpen, setDuplicateEventModalOpen] =
    useState<boolean>(false);
  const [reloadGameEventsTab, setReloadGameEventsTab] = useState(false);
  const [eventSessionActivities, setEventSessionActivities] = useState<
    Array<EventActivityV2>
  >([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [participationLevelReasons, setParticipationLevelReasons] = useState<
    Array<ParticipationLevelSelectOption>
  >([]);
  const [saveProgressIsActive, setSaveProgressIsActive] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isPromptConfirmed, setIsPromptConfirmed] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('0');
  const [selectedTab, setSelectedTab] = useState('0');
  const [isPlanningTabDisplayed, setPlanningTabDisplayed] =
    useState<boolean>(true);
  const [chosenAttachment, setChosenAttachment] =
    useState<EventAttachment | null>(null);
  const [isDeleteAttachmentModalOpen, setIsDeleteAttachmentModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mandatoryFieldsToast, setMandatoryFieldsToast] = useState(false);

  const isGameEventSelectionEnabled =
    window.getFlag('selection-tab-games') &&
    props.event.type === eventTypePermaIds.game.type;

  const { toasts, toastDispatch } = useToasts();
  const closeToast = (id) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  const isSessionEvent = props.event.type === eventTypePermaIds.session.type;
  const isCustomEvent = props.event.type === eventTypePermaIds.custom.type;

  const isImportedDataTabEnabled = !(
    isCustomEvent ||
    window.getFlag(
      'coaching-and-development-hide-collection-and-imported-data-tabs'
    )
  );
  const isLegacyImportedDataTabEnabled =
    isImportedDataTabEnabled &&
    !window.getFlag('pac-calendar-events-imported-data-tab-in-mui');
  const isNewImportedDataTabEnabled =
    isImportedDataTabEnabled &&
    window.getFlag('pac-calendar-events-imported-data-tab-in-mui') &&
    (permissions.workloads.games.canEdit ||
      permissions.workloads.trainingSessions.canEdit ||
      props.canManageWorkload);

  const isWithMetaInformation = useMemo(
    () =>
      [
        formatGameDayPlusMinus(props.event),
        isSessionEvent &&
          (props.event.opponent_squad || props.event.opponent_team),
        props.event.surface_type,
        props.event.surface_quality,
        props.event.field_condition,
        props.event.weather,
        props.event.temperature,
        props.event.humidity,
        props.event.description,
        props.event.nfl_field_type,
        props.event.nfl_surface_composition,
        props.event.nfl_location_feed,
        props.event.type === eventTypePermaIds.game.type &&
          (props.event.venue_type || props.event.competition),
      ].some(Boolean),
    [props.event]
  );

  const { isEventSwitcherOpen } = useSelector(
    (state) => state.eventSwitcherSlice
  );

  const saveColumn = (item, tab, resetGrid, setFailure) => {
    const { columnName, columnType, planningStatusDefinition } = item;
    saveGridColumn(
      props.event.id,
      tab,
      columnName,
      columnType,
      planningStatusDefinition
    ).then(
      () => resetGrid(),
      () => setFailure()
    );
  };

  const saveAssessmentColumn = (
    selectedGridId,
    item,
    tab,
    resetGrid,
    setFailure
  ) => {
    const {
      columnName,
      columnType,
      planningStatusDefinition,
      trainingVariableId,
    } = item;
    saveAssessmentGridColumn(
      props.event.id,
      tab,
      columnName,
      columnType,
      planningStatusDefinition,
      trainingVariableId,
      selectedGridId
    ).then(
      () => resetGrid(),
      () => setFailure()
    );
  };

  const deleteColumn = (columnId, tab, resetGrid, setFailure) => {
    deleteGridColumn(props.event.id, columnId, tab).then(
      () => resetGrid(),
      () => setFailure()
    );
  };

  // fetch Events data here and pass in as a prop.
  const fetchEventSessionActivities = () => {
    getEventActivities({
      eventId: props.event.id,
      params: {
        excludeAthletes: window.getFlag('planning-tab-sessions'),
        excludeSquads: true,
      },
    }).then(
      (eventSessionActivitiesData) => {
        if (!checkIsMounted()) return;
        setEventSessionActivities(eventSessionActivitiesData);
        setRequestStatus('SUCCESS');
      },
      () => {
        if (!checkIsMounted()) return;
        setRequestStatus('FAILURE');
      }
    );
  };

  const hasGameDetailsMissing =
    selectedTab === GAME_EVENTS_TAB &&
    props?.event.type === eventTypePermaIds.game.type &&
    props?.event?.fas_game_key &&
    !props?.event?.surface_type;

  const displayFetchSessionStatus = () => {
    if (requestStatus === 'PENDING') return <DelayedLoadingFeedback />;
    if (requestStatus === 'FAILURE') return <AppStatus status="error" />;
    return null;
  };

  const checkIsAthleteJerseyNumberUnassigned = (tabHash: string) => {
    if (tabHash === '#game_events' && isMatchDayCommunicationsGame) {
      return athleteEvents.some(
        (athleteEvent) => athleteEvent.athlete.squad_number === null
      );
    }
    return false;
  };

  const renderStaffSelectionTab = () => {
    return (
      <StaffSelectionTab
        requestStatus={requestStatus}
        eventSessionActivities={eventSessionActivities}
        event={props.event}
        leagueEvent={props.leagueEvent}
        onUpdateEvent={props.onUpdateEvent}
        onUpdateLeagueEvent={props.onUpdateLeagueEvent}
      />
    );
  };

  const displayUnassignedAthleteJerseyNumberWarningToast = () => {
    dispatch(
      add({
        status: toastStatusEnumLike.Error,
        title: props.t(
          'Jersey numbers need to be assigned to all players before moving to the game event tab.'
        ),
      })
    );
  };

  useEffect(() => {
    // hide mandatory field toast if game details is open
    if (isEditModalOpen && checkIsMounted()) {
      setMandatoryFieldsToast(false);
    }
  }, [isEditModalOpen]);

  useEffect(() => {
    Promise.all([
      getEventActivities({
        eventId: props.event.id,
        params: {
          excludeAthletes: window.getFlag('planning-tab-sessions'),
          excludeSquads: true,
        },
      }),
      getActivityTypes({ onlyForCurrentSquad: true }),
      window.getFlag('planning-participation-reason')
        ? getParticipationLevelReasons()
        : Promise.resolve([]),
    ]).then(
      ([
        eventSessionActivitiesData,
        fetchedActivityTypes,
        participationLevelReasonsData,
      ]) => {
        if (!checkIsMounted()) return;
        setEventSessionActivities(eventSessionActivitiesData);
        setActivityTypes(fetchedActivityTypes);
        setParticipationLevelReasons(
          participationLevelReasonsData.map((reason) => ({
            id: reason.id,
            label: reason.name,
            value: reason.id,
            requireIssue: reason.require_issue,
          }))
        );
        setRequestStatus('SUCCESS');
      },
      () => {
        if (!checkIsMounted()) return;
        setRequestStatus('FAILURE');
      }
    );
  }, [props.event.id]);

  const isParticipantsTabVisible = () => {
    if (isSessionEvent) {
      return !window.getFlag('selection-tab-displaying-in-session');
    }

    if (props.orgSport === 'soccer') {
      return !(
        isCustomEvent ||
        window.getFlag('coaching-and-development-hide-participation-tab')
      );
    }

    return !isCustomEvent;
  };

  const tabPanes = useMemo(() =>
    [
      {
        title: props.t('Diagram builder'),
        content: (
          <DiagramBuilderTab width={600} height={500} background="#1099bb" />
        ),
        tabHash: '#diagram_builder',
        visible: window.getFlag('diagram-builder'),
      },
      {
        title: props.t('Planning'),
        content:
          requestStatus === 'SUCCESS' ? (
            <PlanningTab
              areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
              activities={eventSessionActivities}
              activityTypes={activityTypes}
              event={props.event}
              organisationSport={props.orgSport}
              squadId={props.squad.id}
              onActivitiesUpdate={(newActivities: Array<EventActivityV2>) => {
                if (!checkIsMounted()) return;
                setEventSessionActivities(newActivities);
              }}
              onAlreadyAddedPrinciple={(name: string) =>
                toastDispatch({
                  type: 'UPDATE_TOAST',
                  toast: {
                    id: 1,
                    title: props.t('{{name}} is already added', { name }),
                    status: 'WARNING',
                  },
                })
              }
              onOpenTab={(tabHash: string) => {
                setActiveTabKey(
                  String(
                    tabPanes.findIndex(({ tabHash: hash }) => hash === tabHash)
                  )
                );
              }}
            />
          ) : (
            displayFetchSessionStatus()
          ),
        tabHash: PLANNING_TAB_HASH,
        visible: window.getFlag('planning-tab-sessions') && isSessionEvent,
      },
      {
        title: props.t('Athletes'),
        content: props.event.type === 'custom_event' && (
          <CustomEventsAthletesTab
            event={props.event}
            athletes={
              props.event.athlete_events?.map(({ athlete }) => athlete) ?? []
            }
            onUpdateEvent={props.onUpdateEvent}
            participationLevels={props.participationLevels}
            canEditEvent={props.canEditEvent}
          />
        ),
        tabHash: '#athletesCustom',
        visible: isCustomEvent,
      },
      {
        title: props.t('Staff'),
        content: props.event.type === 'custom_event' && (
          <StaffTab
            event={props.event}
            onUpdateEvent={props.onUpdateEvent}
            canEditEvent={props.canEditEvent}
          />
        ),
        tabHash: '#staffCustom',
        visible: isCustomEvent,
      },
      {
        title: props.t('Attachments'),
        content: (
          <AttachmentsTab
            canDeleteAttachments={props.canEditEvent}
            canDownload={true}
            attachments={props.event.attachments ?? []}
            setIsDeleteAttachmentModalOpen={(value) => {
              if (!checkIsMounted()) return;
              setIsDeleteAttachmentModalOpen(value);
            }}
            setChosenAttachment={(value) => {
              if (!checkIsMounted()) return;
              setChosenAttachment(value);
            }}
          />
        ),
        tabHash: '#attachments',
        visible: isCustomEvent,
      },
      {
        title: props.t('Participants'),
        content:
          requestStatus === 'SUCCESS' ? (
            <AthletesTab
              event={props.event}
              canEditEvent={props.canEditEvent}
              canViewAvailabilities={props.canViewAvailabilities}
              statusVariables={props.statusVariables}
              saveColumn={saveColumn}
              deleteColumn={deleteColumn}
              participationLevels={props.participationLevels}
              participationLevelReasons={participationLevelReasons}
              toastAction={toastDispatch}
            />
          ) : (
            displayFetchSessionStatus()
          ),
        tabHash: '#participants',
        visible: isParticipantsTabVisible(),
      },
      {
        title: props.t('Athlete selection'),
        content:
          requestStatus === 'SUCCESS' ? (
            <AthletesSelectionTab
              requestStatus={requestStatus}
              eventSessionActivities={eventSessionActivities}
              event={props.event}
              leagueEvent={props.leagueEvent}
              participationLevels={props.participationLevels}
              participationLevelReasons={participationLevelReasons}
              isGameEventSelectionEnabled={isGameEventSelectionEnabled}
              onSaveParticipantsSuccess={({ selectedAthletes }) => {
                if (!checkIsMounted()) return;
                setReloadGameEventsTab(true);
                fetchEventSessionActivities();
                // Ensures that state in EditEventSidePanel is in sync with
                // athlete events changes
                props.onUpdateEvent({
                  ...props.event,
                  athlete_ids: selectedAthletes.map((id) => parseInt(id, 10)),
                });
              }}
              onUpdateEvent={props.onUpdateEvent}
              onUpdateLeagueEvent={props.onUpdateLeagueEvent}
              toastAction={toastDispatch}
            />
          ) : (
            displayFetchSessionStatus()
          ),
        tabHash: '#athlete_selection',
        visible:
          (isSessionEvent &&
            window.getFlag('selection-tab-displaying-in-session')) ||
          isGameEventSelectionEnabled,
      },
      {
        title: props.t('Staff selection'),
        content:
          requestStatus === 'SUCCESS'
            ? renderStaffSelectionTab()
            : displayFetchSessionStatus(),
        tabHash: '#staff_selection',
        visible:
          (window.getFlag('planning-selection-tab') && isSessionEvent) ||
          (window.getFlag('staff-selection-games') &&
            props.event.type === eventTypePermaIds.game.type),
      },
      {
        title:
          isMatchDayFlow && !preferences.league_game_match_report
            ? props.t('Starting lineup')
            : props.t('Game events'),
        content: window.getFlag('planning-game-events-tab-v-2') && (
          <GameEventsTab
            leagueEvent={props.leagueEvent}
            event={props.event}
            canEditEvent={props.canEditEvent}
            reloadData={reloadGameEventsTab}
            setReloadData={(value) => {
              if (!checkIsMounted()) return;
              setReloadGameEventsTab(value);
            }}
            onUpdateEvent={props.onUpdateEvent}
            onUpdateLeagueEvent={props.onUpdateLeagueEvent}
            setSaveProgressIsActive={(value) => {
              if (!checkIsMounted()) return;
              setSaveProgressIsActive(value);
            }}
            showPrompt={showPrompt}
            setShowPrompt={(value) => {
              if (!checkIsMounted()) return;
              setShowPrompt(value);
            }}
            setIsPromptConfirmed={(value) => {
              if (!checkIsMounted()) return;
              setIsPromptConfirmed(value);
            }}
            activeTabKey={activeTabKey}
            setMandatoryFieldsToast={setMandatoryFieldsToast}
            preventGameEvents={hasGameDetailsMissing}
          />
        ),
        tabHash: '#game_events',
        visible:
          window.getFlag('planning-game-events-tab-v-2') &&
          props.event.type === eventTypePermaIds.game.type &&
          props.orgSport === 'soccer',
      },
      {
        title: props.t('Session planning'),
        content:
          requestStatus === 'SUCCESS' ? (
            <SessionPlanningTab
              canEditEvent={props.canEditEvent}
              event={props.event}
              canViewAvailabilities={props.canViewAvailabilities}
              reloadData={reloadPlanningActivities}
              participationLevels={props.participationLevels}
              onPrintSummaryOpen={() => {
                if (!checkIsMounted()) return;
                setIsDownloadModalOpen(true);
              }}
              areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
              fetchEventSessionActivities={fetchEventSessionActivities}
              eventSessionActivities={eventSessionActivities}
              updateEventSessionActivities={(
                eventSession: Array<EventActivityV2>
              ) => {
                if (!checkIsMounted()) return;
                setEventSessionActivities(eventSession);
              }}
              withMetaInformation={isWithMetaInformation}
            />
          ) : (
            displayFetchSessionStatus()
          ),
        tabHash: '#session_planning',
        visible:
          window.getFlag('sessions-session-planning-tab') &&
          !window.getFlag('planning-tab-sessions') &&
          isSessionEvent,
      },
      {
        title: props.developmentGoalTerminology
          ? props.developmentGoalTerminology
          : props.t('Development goals'),
        content: (
          <DevelopmentGoalsTab
            event={props.event}
            reloadData={reloadDevelopmentGoals}
            areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
            developmentGoalTerminology={props.developmentGoalTerminology}
          />
        ),
        tabHash: '#development_goals',
        visible:
          props.hasDevelopmentGoalsModule &&
          props.canViewDevelopmentGoals &&
          !isCustomEvent,
      },
      {
        title: props.t('Collection'),
        content: (
          <CollectionTab
            canCreateAsssessment={props.canCreateAsssessment}
            canCreateAssessmentFromTemplate={
              props.canCreateAssessmentFromTemplate
            }
            canAnswerAssessment={props.canAnswerAssessment}
            canEditEvent={props.canEditEvent}
            canViewAsssessments={props.canViewAsssessments}
            canViewAvailabilities={props.canViewAvailabilities}
            canViewProtectedMetrics={props.canViewProtectedMetrics}
            deleteColumn={deleteColumn}
            event={props.event}
            onUpdateEvent={props.onUpdateEvent}
            orgTimezone={props.orgTimezone}
            participationLevels={props.participationLevels}
            reloadGrid={reloadCollectionGrid}
            saveAssessmentColumn={saveAssessmentColumn}
            saveColumn={saveColumn}
            statusVariables={props.statusVariables}
            toastAction={toastDispatch}
            turnaroundList={props.turnaroundList}
          />
        ),
        tabHash: '#collection',
        visible: !(
          isCustomEvent ||
          window.getFlag(
            'coaching-and-development-hide-collection-and-imported-data-tabs'
          )
        ),
      },
      {
        title: props.t('Imported data'),
        content: (
          <ImportedDataTab
            event={props.event}
            orgTimezone={props.orgTimezone}
            canEditEvent={props.canEditEvent}
          />
        ),
        tabHash: '#imported_data',
        visible: isLegacyImportedDataTabEnabled || isNewImportedDataTabEnabled,
      },
    ]
      .filter((tab) => tab.visible)
      .map((tab, index) => ({ ...tab, tabKey: index.toString() }))
  );

  const initialTabPane = tabPanes.find(
    (tabPane) => tabPane.tabHash === window.location.hash
  );
  // On first render, show the tab associated to the location hash
  const initialTab = useRef(initialTabPane?.tabKey || PLANNING_TAB_KEY);

  useEffect(() => {
    if (!checkIsMounted()) return;
    let initialTabIndex = tabPanes.findIndex(
      (tabPane) => tabPane.tabKey === initialTab.current
    );

    if (
      checkIsAthleteJerseyNumberUnassigned(tabPanes[initialTabIndex].tabHash)
    ) {
      window.location.hash = '';
      initialTabIndex = 0;
      displayUnassignedAthleteJerseyNumberWarningToast();
    }

    setActiveTabKey(String(initialTabIndex));
    setDocumentTitle(tabPanes[initialTabIndex].title);
    setPlanningTabDisplayed(initialTab.current === PLANNING_TAB_KEY);
    if (window.location.hash === DUPLICATED_EVENT_HASH) {
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname
      );
      toastDispatch({
        type: 'UPDATE_TOAST',
        toast: {
          id: 1,
          title: props.t('Session duplicated successfully'),
          status: 'SUCCESS',
        },
      });
    }

    // Defaults match day view to dmr if the league_game_information preference is not set
    if (
      !preferences?.league_game_information &&
      preferences?.league_game_team
    ) {
      dispatch(toggleMatchDayView(mailingList.Dmr));
    }
  }, []);

  const handleOnSetActiveTabKey = (tabKey: number) => {
    if (!checkIsMounted()) return;

    if (checkIsAthleteJerseyNumberUnassigned(tabPanes[tabKey].tabHash)) {
      displayUnassignedAthleteJerseyNumberWarningToast();
      return;
    }

    setActiveTabKey(tabKey.toString());
  };

  // Set the location hash when changing tab
  const onClickTab = (tabKey: string) => {
    if (!checkIsMounted()) return;

    if (!isImportedGame) handleOnSetActiveTabKey(Number.parseInt(tabKey, 10));

    const tab = tabPanes.find((tabPane) => tabPane.tabKey === tabKey);

    const tabHash = tab?.tabHash;

    if (tabHash) {
      if (checkIsAthleteJerseyNumberUnassigned(tabHash)) {
        return;
      }

      // We use location.replace so it does not push the page in the history.
      // This prevents the browser back button from redirecting the user to the
      // previous hash instead of the previous page
      window.location.replace(tabHash);
    }

    if (tabHash === '#collection') {
      setReloadCollectionGrid(true);
    } else {
      setReloadCollectionGrid(false);
    }

    setReloadPlanningActivities(tabHash === '#session_planning');

    setReloadDevelopmentGoals(tabHash === '#development_goals');

    setPlanningTabDisplayed(tabHash === PLANNING_TAB_HASH);

    const tabTitle = tab?.title;

    if (tabTitle) setDocumentTitle(tabTitle);
  };

  // this will trigger to game details side panel to open from toast link
  const handleEditGameToastLink = () => {
    if (!checkIsMounted()) return;
    setIsEditModalOpen(true);
    setMandatoryFieldsToast(false);
  };

  const renderHomeAwayTeamToggle = () => {
    const renderTeamToggleButton = (id: number, name?: string) => (
      <Button
        onClick={() => {
          props.setActiveTeamEventId(id);
        }}
        color={props.activeTeamEventId === id ? 'primary' : 'secondary'}
      >
        {name}
      </Button>
    );

    return (
      <ButtonGroup css={style.teamToggle}>
        {props.leagueEvent.type === eventTypePermaIds.game.type &&
          renderTeamToggleButton(
            +props.leagueEvent?.home_event_id,
            props.leagueEvent.squad.owner_name
          )}
        {props.leagueEvent.type === eventTypePermaIds.game.type &&
          renderTeamToggleButton(
            +props.leagueEvent?.away_event_id,
            props.leagueEvent.opponent_squad?.owner_name
          )}
      </ButtonGroup>
    );
  };

  const tab = tabPanes.find((tabPane) => tabPane.tabKey === activeTabKey);

  const tabHash = tab?.tabHash;

  const tabBarCustomStyles = `
    .rc-tabs-bar { padding: 0 24px; }
    .rc-tabs-tabpane {
      position: relative;
      ${
        tabHash === '#imported_data' &&
        window.getFlag('pac-calendar-events-imported-data-tab-in-mui')
          ? 'padding: 0'
          : ''
      }
    }
  `;

  const renderTabBar = () => (
    <PlanningEventContextProvider>
      <TabBar
        customStyles={tabBarCustomStyles}
        tabPanes={tabPanes.map((tabPane) => ({
          title: tabPane.title,
          content: tabPane.content,
        }))}
        onClickTab={onClickTab}
        initialTab={initialTab.current}
        activeTabIndex={activeTabKey}
        kitmanDesignSystem
      />
    </PlanningEventContextProvider>
  );

  const renderGameEventsTabBar = () => (
    <PlanningEventContextProvider>
      <PlanningTabBar
        customStyles={tabBarCustomStyles}
        tabPanes={tabPanes.map((tabPane) => ({
          title: tabPane.title,
          content: tabPane.content,
        }))}
        onClickTab={onClickTab}
        initialTab={initialTab.current}
        activeTabKey={activeTabKey}
        setActiveTabKey={handleOnSetActiveTabKey}
        selectedTab={selectedTab}
        setSelectedTab={(value) => {
          if (!checkIsMounted()) return;
          setSelectedTab(value);
        }}
        hasUnsavedChanges={saveProgressIsActive}
        setShowPrompt={(value) => {
          if (!checkIsMounted()) return;
          setShowPrompt(value);
        }}
        isPromptConfirmed={isPromptConfirmed}
        setIsPromptConfirmed={(value) => {
          if (!checkIsMounted()) return;
          setIsPromptConfirmed(value);
        }}
        kitmanDesignSystem
      />
    </PlanningEventContextProvider>
  );

  const renderTabContent = () =>
    window.getFlag('planning-game-events-tab-v-2')
      ? renderGameEventsTabBar()
      : renderTabBar();

  const renderLeagueUserMatchDayOperations = () => (
    <>
      {renderHomeAwayTeamToggle()}
      {renderTabContent()}
    </>
  );
  const renderPlanningEventContent = () => {
    /**
     * Determines if the user has permission to view game information.
     *
     * The permission is granted if:
     * - The user has league game information preferences enabled.
     * - The user is either part of a league or is the organization supervisor(admin).
     * - The match day view corresponds to the mailing list's Dmn value.
     * - And user has the permission to view league game information.
     *
     */
    const viewGameInformationPermission =
      preferences?.league_game_information &&
      (isLeagueStaffUser || isOrgSupervised) &&
      matchDayView === mailingList.Dmn &&
      permissions?.leagueGame.viewGameInformation;

    /**
     * Determines whether the match day notice should be viewed.
     * based on if user has league game information preferences enabled
     * and user has the permissions viewGameInformation.
     */
    const viewMatchDayNotice = isImportedGame && viewGameInformationPermission;

    /**
     * Determines if a league/association level or org supervised user can view
     * the match day operations (DMR) and access the team toggle allowing them to switch between home and away teams.
     */
    const viewLeagueMatchDayOperation =
      isMatchDayFlow &&
      isLeagueStaffUser &&
      permissions?.leagueGame.viewGameInformation;

    if (viewMatchDayNotice) {
      return <MatchDayNotice />;
    }

    if (viewLeagueMatchDayOperation) {
      return renderLeagueUserMatchDayOperations();
    }

    return renderTabContent();
  };

  return (
    <div
      css={[
        style.gridLayout,
        ...(isEventSwitcherOpen ? [style.shiftContent] : []),
      ]}
    >
      <div className="planningEvent" css={style.content}>
        <AppHeader
          event={props.event}
          leagueEvent={props.leagueEvent}
          orgTimezone={props.orgTimezone}
          eventConditions={props.eventConditions}
          onUpdateEvent={props.onUpdateEvent}
          canEditEvent={props.canEditEvent}
          canDeleteEvent={props.canDeleteEvent}
          canManageWorkload={props.canManageWorkload}
          canViewIssues={props.canViewIssues}
          canDownloadPlan={isPlanningTabDisplayed}
          withMetaInformation={isWithMetaInformation}
          onSaveParticipantsSuccess={() => {
            if (!checkIsMounted()) return;
            setReloadGameEventsTab(true);
          }}
          onDownloadPlan={() => {
            if (!checkIsMounted()) return;
            setIsDownloadModalOpen(true);
          }}
          onDuplicateEvent={() => {
            if (!checkIsMounted()) return;
            setDuplicateEventModalOpen(true);
          }}
          toastAction={toastDispatch}
          squadName={props.squad.name}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={(value) => {
            if (!checkIsMounted()) return;
            setIsEditModalOpen(value);
          }}
          hasGameDetailsMissing={hasGameDetailsMissing}
        />
        {renderPlanningEventContent()}
        <ToastDialog toasts={toasts} onCloseToast={closeToast} />
        <DownloadOptionsModal
          isOpen={isDownloadModalOpen}
          closeModal={() => {
            if (!checkIsMounted()) return;
            setIsDownloadModalOpen(false);
          }}
          event={props.event}
          orgTimezone={props.orgTimezone}
          orgLogoPath={props.orgLogoPath}
          orgName={props.orgName}
          orgSport={props.orgSport}
          squadName={props.squad.name}
          gameParticipationLevels={props.participationLevels}
          areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
          isPlanningTabDisplayed={isPlanningTabDisplayed}
        />
        <EventSidePanel
          isOpen={isDuplicateEventModalOpen}
          panelType="SLIDING"
          panelMode="DUPLICATE"
          planningEvent={props.event}
          canManageWorkload={props.canManageWorkload}
          redirectToEventOnClose
          onSaveEventSuccess={() => {
            if (!checkIsMounted()) return;
            setDuplicateEventModalOpen(false);
          }}
          onClose={() => {
            if (!checkIsMounted()) return;
            setDuplicateEventModalOpen(false);
          }}
          eventConditions={props.eventConditions}
        />
        {window.getFlag('event-attachments') && (
          <DeleteAttachmentModalContainer
            isOpen={isDeleteAttachmentModalOpen}
            titleToDelete={chosenAttachment?.attachment.name ?? ''}
            idToDelete={chosenAttachment?.attachment.id ?? 0}
            deleteType="attachment"
            event={props.event}
            onUpdateEventDetails={(update) =>
              props.onUpdateEvent((prev) => ({ ...prev, ...update }))
            }
            onClose={() => {
              if (!checkIsMounted()) return;
              setIsDeleteAttachmentModalOpen(false);
            }}
            onDeleteStart={(fileId, fileName) =>
              toastDispatch({
                type: 'CREATE_TOAST',
                toast: {
                  id: fileId,
                  title: props.t('Deleting {{filename}}...', {
                    filename: fileName,
                  }),
                  status: 'LOADING',
                },
              })
            }
            onDeleteSuccess={(fileId, fileName) =>
              toastDispatch({
                type: 'UPDATE_TOAST',
                toast: {
                  id: fileId,
                  title: props.t('{{filename}} deleted successfully', {
                    filename: fileName,
                  }),
                  status: 'SUCCESS',
                },
              })
            }
            onDeleteFailure={(fileId, fileName) =>
              toastDispatch({
                type: 'UPDATE_TOAST',
                toast: {
                  id: fileId,
                  title: props.t('{{filename}} deletion failed', {
                    filename: fileName,
                  }),
                  status: 'ERROR',
                },
              })
            }
          />
        )}
        <MandatoryFieldsToast
          isVisible={mandatoryFieldsToast}
          editGame={handleEditGameToastLink}
          close={() => setMandatoryFieldsToast(false)}
        />
      </div>
      <div css={style.slideout} id="planningEvent-Slideout" />
      {props.leagueEvent && (
        <MatchDayEmailPanel
          eventId={props.leagueEvent.id}
          leagueEvent={props.leagueEvent}
          homeTeam={props.leagueEvent.squad.owner_name}
          awayTeam={props.leagueEvent.opponent_squad?.owner_name}
          startDate={moment(props.leagueEvent?.start_date).format('MM-DD-YYYY')}
          mlsGameKey={props.leagueEvent?.mls_game_key}
          roundNumber={props.leagueEvent?.round_number}
          onUpdateLeagueEvent={props.onUpdateLeagueEvent}
        />
      )}
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
