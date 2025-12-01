// @flow
import { useState, useEffect, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, TextButton } from '@kitman/components';
import { useDispatch } from 'react-redux';
import capitalize from 'lodash/capitalize';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { resetMatchReport, getUserEventRequests } from '@kitman/services';
import useRedirectToMatchReport from '@kitman/common/src/hooks/useRedirectToMatchReport';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Event } from '@kitman/common/src/types/Event';
import type { ToastDispatch } from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { MassUploadTranslated as MassUpload } from '@kitman/modules/src/shared/MassUpload';
import type { UserEventRequest } from '@kitman/services/src/services/leaguefixtures/getUserEventRequests';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import unlockMatchReport from '@kitman/modules/src/PlanningEvent/src/services/unlockMatchReport';
import { ExportMenuTranslated as ExportMenu } from '@kitman/modules/src/Exports/ExportMenu';
import ExternalAccessSidePanel from '@kitman/modules/src/LeagueFixtures/src/shared/ExternalAccessPanel';
import { Button, DataGrid } from '@kitman/playbook/components';
import type { SetState } from '@kitman/common/src/types/react';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import updateMatchMonitorReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/api/updateMatchMonitorReport';
import deleteMatchMonitorReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/api/deleteMatchMonitorReport';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import {
  OFFICIAL_ASSIGNMENT,
  MATCH_MONITOR_ASSIGNMENT,
} from '@kitman/modules/src/shared/MassUpload/utils';
import {
  planningEventApi,
  TAGS as planningEventTags,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import {
  officialsApi,
  TAGS as officialsTags,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import NewLeagueFixtureDrawer from '@kitman/modules/src/MatchDay/components/NewLeagueFixtureDrawer';
import { useSquadScopedPersistentState } from '@kitman/common/src/hooks';
import { useSeamlessInfiniteScroll } from '@kitman/common/src/hooks/useSeamlessInfiniteScroll';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getMatchMonitorTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getMatchMonitorData';
import { getScoutAccessTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getScoutAccessManagementData';
import useFixturesSuccessToast from '@kitman/modules/src/LeagueFixtures/src/mass-upload/useFixturesSuccessToast';
import useGridConfig from '../../PlanningHub/src/components/EventsScheduleGrid/hooks/useGridConfig';
import { FixtureActionModalTranslated as FixtureActionModal } from './FixtureActionModal';
import { FiltersTranslated as Filters } from '../ScheduleFilters/LeagueFixtureFilters';
import { LeagueFixtureFiltersMUITranslated as FiltersMUI } from '../ScheduleFilters/LeagueFixtureFiltersMUI';
import { menuButtonTypes } from './helpers';
import type { MenuButtonModalInfo } from './types';

import styles from './styles';
import { getDefaultEventFilters } from '../../PlanningHub/src/utils';
import { add } from '../../Toasts/toastsSlice';
import { getReportTextType, getFixtureReportType } from './utils';
import useScoutRequestAccess from './hooks/useScoutRequestAccess';
import { IMPORT_TYPES } from '../MassUpload/New/utils/consts';

type Props = {
  onToggleEvent: (event: Event) => void,
  toastDispatch: ToastDispatch<ToastAction>,
  isReload: boolean,
  setIsReload: SetState<boolean>,
};

const FixtureScheduleView = (props: I18nProps<Props>) => {
  const isScoutAttendeesEnabled = window.getFlag(
    'league-ops-sam-enable-scout-atendees'
  );
  const useMuiFilters = window.getFlag('lops-grid-filter-enhancements');

  const dispatch = useDispatch();
  const { preferences } = usePreferences();
  const {
    isLeague,
    isLeagueStaffUser,
    isOfficial,
    isScout,
    isOrgSupervised,
    organisationId,
  } = useLeagueOperations();
  const { permissions } = usePermissions();
  const locationAssign = useLocationAssign();
  const redirectToMatchReport = useRedirectToMatchReport();
  const { trackEvent } = useEventTracking();
  const { toastDialog } = useFixturesSuccessToast();

  const { handleCancelUserEventRequestApi } = useScoutRequestAccess();

  const [menuButtonActionInfo, setMenuButtonActionInfo] =
    useState<MenuButtonModalInfo>({
      id: null,
      type: '',
    });
  const [isProcessingMenuButtonAction, setIsProcessingMenuButtonAction] =
    useState(false);
  const [userEventRequests, setUserEventRequests] = useState<
    Array<UserEventRequest>
  >([]);
  const initialFiltersRef = useRef(
    getDefaultEventFilters({
      preferences,
      isReportFilters: true,
      isSupervisorView: !isLeague && !isOfficial,
      isGameEvents: true,
      isLeague,
      isScoutAccess: !!preferences?.scout_access_management,
      canManageScoutAccess:
        permissions?.scoutAccessManagement?.canManageScoutAccess,
      organisationId,
      isScoutAttendeesEnabled,
    })
  );
  const { state: scheduleFilters, updateState: setScheduleFilters } =
    useSquadScopedPersistentState({
      initialState: initialFiltersRef.current,
      sessionKey: 'scheduleFilters',
    });
  const [reloadDataGrid, setReloadDataGrid] = useState(false);
  const [isGameDrawerOpen, setIsGameDrawerOpen] = useState(false);
  const [editableEvent, setEditableEvent] = useState<?Event>(null);

  const isScoutAccessManagementScoutUser =
    preferences?.scout_access_management &&
    permissions?.scoutAccessManagement?.canViewScoutFixtures;

  const isScoutAccessManagementManagerUser =
    preferences?.scout_access_management &&
    permissions?.scoutAccessManagement?.canManageScoutAccess;

  const showMassUploadFixturesButton =
    isLeague &&
    permissions?.leagueGame?.manageGameInformation &&
    permissions?.settings?.canCreateImports &&
    preferences.manage_league_game &&
    window.getFlag('league-game-mass-game-upload');

  const onClickEditEvent = (event) => {
    setEditableEvent(event);
    setIsGameDrawerOpen(true);
    trackEvent(
      leagueOperationsEventNames.editFixtureClicked,
      getScoutAccessTrackingData({
        product: 'league-ops',
        productArea: 'schedule',
      })
    );
  };

  const onCloseLeagueGameDrawer = () => {
    setIsGameDrawerOpen(false);
    setEditableEvent(null);
  };

  const handleFixtureScheduleViewRedirect = (
    eventId: number,
    type?: string
  ) => {
    // If the user is an official/scout but does not have permission to view the match report, don't allow the click functionality.
    if ((isOfficial || isScout) && !permissions.leagueGame?.viewMatchReport) {
      return;
    }

    if (isLeague && type === 'ROSTER') {
      locationAssign(`/planning_hub/events/${eventId}`);
      return;
    }

    if (
      isLeague &&
      type === 'REQUESTS' &&
      permissions.scoutAccessManagement.canManageScoutAccess
    ) {
      locationAssign(`/league-fixtures/requests/${eventId}`);
      trackEvent(
        leagueOperationsEventNames.viewScoutRequestsClicked,
        getScoutAccessTrackingData({
          product: 'league-ops',
          productArea: 'schedule',
          feature: 'scout-access-management',
        })
      );
      return;
    }

    // club level scout access management check flow
    if (!isLeagueStaffUser && preferences?.scout_access_management) {
      if (permissions.scoutAccessManagement.canManageScoutAccess)
        locationAssign(`/planning_hub/league-schedule/requests/${eventId}`);
      // league association level users flow
    } else {
      if (preferences?.match_monitor) {
        trackEvent(
          leagueOperationsEventNames.viewMatchMonitorReportClicked,
          getMatchMonitorTrackingData({
            product: 'league-ops',
            productArea: 'schedule',
            feature: 'match-monitor',
          })
        );
      }

      redirectToMatchReport(eventId);
    }
  };

  const handleSetMenuButtonAction = (id: number, type: string) => {
    setMenuButtonActionInfo({
      id,
      type,
    });

    switch (type) {
      case menuButtonTypes.withdraw:
        trackEvent(
          leagueOperationsEventNames.withdrawRequestClicked,
          getScoutAccessTrackingData({
            product: 'league-ops',
            productArea: 'schedule',
            feature: 'scout-access-management',
          })
        );
        break;
      case menuButtonTypes.unlock:
        if (preferences?.match_monitor) {
          trackEvent(
            leagueOperationsEventNames.unlockMatchMonitorReportClicked,
            getMatchMonitorTrackingData({
              product: 'league-ops',
              productArea: 'schedule',
              feature: 'match-monitor',
            })
          );
        }
        break;
      case menuButtonTypes.reset:
        if (preferences?.match_monitor) {
          trackEvent(
            leagueOperationsEventNames.resetMatchMonitorReportClicked,
            getMatchMonitorTrackingData({
              product: 'league-ops',
              productArea: 'schedule',
              feature: 'match-monitor',
            })
          );
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (
      !preferences?.league_game_notification_recipient ||
      !preferences?.league_game_hide_club_game
    )
      return;

    setScheduleFilters({
      ...scheduleFilters,
      include_association_contact:
        !!preferences.league_game_notification_recipient,
      include_visible: !!preferences.league_game_hide_club_game,
    });
  }, [
    preferences?.league_game_notification_recipient,
    preferences?.league_game_hide_club_game,
  ]);

  const {
    columns,
    rightPinnedColumns,
    rows,
    fixtures: scheduleFixtures,
    dataGridCustomStyle,
    muiDataGridProps,
    isError,
    isFetching,
    isFixturesFetchSuccess,
    nextId: nextPageId,
    refetchFixtures: refreshFixtures,
    getNextFixtures: getNextPageFixtures,
  } = useGridConfig({
    configSettings: {
      useScoutAccessManagement: !!preferences?.scout_access_management,
      useMatchMonitor: !!preferences?.match_monitor,
      canViewMatchRoster: !!preferences?.league_game_team,
      canManageLeagueGames: !!preferences?.manage_league_game,
      // temporary config until backend confirmed to be fully working so some functionality remains intact if not
      hasScoutAccessLimitations: !!preferences?.access_request_limitations,
      isScoutAttendeesEnabled,
    },
    filters: scheduleFilters,
    setFilters: setScheduleFilters,
    userEventRequests,
    setUserEventRequests,
    handleRedirect: handleFixtureScheduleViewRedirect,
    handleSetMenuButtonAction,
    onClickEditEvent,
  });

  const { watchRef } = useSeamlessInfiniteScroll({
    enabled: !!nextPageId,
    onEndReached: () => {
      if (nextPageId) {
        getNextPageFixtures();
      }
    },
  });

  const handleMuiDataGridRedirect = (rowId: number) => {
    if (isLeague) {
      const foundGame = scheduleFixtures.find(
        (fixture) => fixture.id === rowId
      );
      if (foundGame) props.onToggleEvent(foundGame);
    } else {
      handleFixtureScheduleViewRedirect(rowId);
    }
  };

  useEffect(() => {
    if (isScoutAccessManagementScoutUser) {
      getUserEventRequests({}).then((result) => {
        setUserEventRequests(result);
      });
    }
  }, [isFixturesFetchSuccess]);

  useEffect(() => {
    if (props.isReload) {
      refreshFixtures();
      props.setIsReload(false);
    }
  }, [props.isReload]);

  useEffect(() => {
    if (reloadDataGrid) {
      setReloadDataGrid(false);
    }
  }, [reloadDataGrid]);

  const getMassUploadType = () => {
    if (preferences?.match_monitor) {
      return MATCH_MONITOR_ASSIGNMENT;
    }

    return OFFICIAL_ASSIGNMENT;
  };

  const handleUnlockReport = async (eventId: number) => {
    if (preferences?.match_monitor) {
      await updateMatchMonitorReport(eventId, { submitted: false });
    } else {
      await unlockMatchReport(eventId);
    }
  };

  const handleResetReport = async (eventId: number) => {
    if (preferences?.match_monitor) {
      await deleteMatchMonitorReport(eventId);
    } else {
      await resetMatchReport(eventId);
    }
  };

  const handleUnlockResetReportActions = async () => {
    try {
      if (menuButtonActionInfo.type === menuButtonTypes.unlock) {
        await handleUnlockReport(+menuButtonActionInfo?.id);
        redirectToMatchReport(+menuButtonActionInfo?.id);
      } else {
        await handleResetReport(+menuButtonActionInfo?.id);
        dispatch(
          add({
            status: toastStatusEnumLike.Success,
            title: props.t(`{{reportType}} report reset.`, {
              reportType: capitalize(
                getReportTextType(preferences?.match_monitor)
              ),
            }),
          })
        );
        setMenuButtonActionInfo({
          id: null,
          type: '',
        });

        refreshFixtures();
      }
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: props.t(`{{reportType}} report reset failed.`, {
            reportType: capitalize(
              getReportTextType(preferences?.match_monitor)
            ),
          }),
        })
      );
    } finally {
      setIsProcessingMenuButtonAction(false);
    }
  };

  const onMatchReportMenuAction = async () => {
    if (menuButtonActionInfo.id === null) return;
    setIsProcessingMenuButtonAction(true);
    if (menuButtonTypes.withdraw === menuButtonActionInfo.type) {
      trackEvent(
        leagueOperationsEventNames.withdrawRequestSubmitted,
        getScoutAccessTrackingData({
          product: 'league-ops',
          productArea: 'schedule',
          feature: 'scout-access-management',
        })
      );
      await handleCancelUserEventRequestApi({
        userEventRequests,
        setUserEventRequests,
        userEventRequestId: +menuButtonActionInfo.id,
      });
      setMenuButtonActionInfo({
        id: null,
        type: '',
      });
      setIsProcessingMenuButtonAction(false);
    } else {
      await handleUnlockResetReportActions();
    }
  };

  const renderScheduleTable = () => (
    <div style={{ width: '100%' }}>
      <DataGrid
        {...muiDataGridProps}
        columns={columns}
        rows={rows}
        loading={isFetching}
        rightPinnedColumns={rightPinnedColumns}
        onRowClick={(row) => handleMuiDataGridRedirect(row.id)}
        noRowsMessage={props.t('No events scheduled')}
        sx={dataGridCustomStyle}
      />
      {!!nextPageId && <div ref={watchRef} />}
      {isError && <AppStatus status="error" />}
    </div>
  );

  const renderFixtureScheduleList = () => (
    <>
      {useMuiFilters ? (
        <FiltersMUI
          filters={scheduleFilters}
          initialFilters={initialFiltersRef.current}
          setFilters={setScheduleFilters}
          showAccessFilter={
            isScoutAccessManagementScoutUser ||
            isScoutAccessManagementManagerUser
          }
        />
      ) : (
        <Filters
          filters={scheduleFilters}
          setFilters={setScheduleFilters}
          showAccessFilter={
            isScoutAccessManagementScoutUser ||
            isScoutAccessManagementManagerUser
          }
        />
      )}
      {renderScheduleTable()}
    </>
  );

  const renderFixtureActionModal = () => (
    <FixtureActionModal
      actionId={menuButtonActionInfo.id}
      actionType={menuButtonActionInfo.type}
      reportType={getFixtureReportType(preferences)}
      clearActionInfo={() => setMenuButtonActionInfo({ id: null, type: '' })}
      onFixtureMenuActionSuccess={onMatchReportMenuAction}
      isLoading={isProcessingMenuButtonAction}
    />
  );

  const renderMatchRequestsExternalAccessPanel = () => (
    <ExternalAccessSidePanel fixtures={scheduleFixtures} />
  );

  const renderLeagueFixtureDetailsPanel = () => (
    <NewLeagueFixtureDrawer
      isOpen={isGameDrawerOpen}
      event={editableEvent}
      onClose={onCloseLeagueGameDrawer}
      onSubmitSuccess={() => {
        setReloadDataGrid(true);
        dispatch(
          planningEventApi.util.invalidateTags([
            planningEventTags.GAME_INFORMATION,
          ])
        );
        dispatch(
          officialsApi.util.invalidateTags([officialsTags.GAME_OFFICIALS])
        );
      }}
    />
  );

  const renderView = (content) => {
    return (
      <div data-testid="FixtureScheduleView" css={styles.wrapper}>
        <header>
          <h3>{props.t('Schedule')}</h3>
          <div css={styles.actions}>
            {isLeague &&
              preferences?.manage_league_game &&
              permissions.leagueGame?.manageGameInformation && (
                <TextButton
                  text={props.t('Create game')}
                  type="primary"
                  kitmanDesignSystem
                  testId="create-game"
                  onClick={() => {
                    setIsGameDrawerOpen(true);
                    trackEvent(
                      leagueOperationsEventNames.leagueGameCreationClicked,
                      getScoutAccessTrackingData({
                        product: 'league-ops',
                        productArea: 'schedule',
                      })
                    );
                  }}
                />
              )}
            {isLeague &&
              permissions?.settings?.canCreateImports &&
              !isOrgSupervised && (
                <MassUpload
                  userType={getMassUploadType()}
                  reloadGrid={() => refreshFixtures()}
                  onUploadSuccess={() => {
                    const userType = getMassUploadType();
                    if (userType === MATCH_MONITOR_ASSIGNMENT) {
                      trackEvent(
                        leagueOperationsEventNames.matchMonitorsUploaded,
                        getMatchMonitorTrackingData({
                          product: 'league-ops',
                          productArea: 'schedule',
                          feature: 'match-monitor',
                        })
                      );
                    }
                  }}
                />
              )}
            {showMassUploadFixturesButton && (
              <div>
                <Button
                  sx={{ padding: '4px 12px' }}
                  variant="contained"
                  color="secondary"
                  data-testid="mass-upload-games-btn"
                  onClick={() => {
                    locationAssign(`/mass_upload/${IMPORT_TYPES.LeagueGame}`);
                    trackEvent(
                      leagueOperationsEventNames.leagueGamesUploadClicked,
                      getScoutAccessTrackingData({
                        product: 'league-ops',
                        productArea: 'schedule',
                      })
                    );
                  }}
                >
                  {props.t('Upload games')}
                </Button>
              </div>
            )}
            <ExportMenu filters={scheduleFilters} />
          </div>
        </header>
        {content}
        {(isLeague ||
          isScoutAccessManagementManagerUser ||
          isScoutAccessManagementScoutUser) &&
          renderFixtureActionModal()}
        {renderMatchRequestsExternalAccessPanel()}
        {renderLeagueFixtureDetailsPanel()}
        {toastDialog}
      </div>
    );
  };

  return renderView(renderFixtureScheduleList());
};

export const FixtureScheduleViewTranslated =
  withNamespaces()(FixtureScheduleView);
export default FixtureScheduleView;
