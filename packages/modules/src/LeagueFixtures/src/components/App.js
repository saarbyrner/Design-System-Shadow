// @flow
import { useEffect, useState } from 'react';
import type { Event } from '@kitman/common/src/types/Event';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import MatchReport from '@kitman/modules/src/shared/MatchReport';
import { FixtureScheduleViewTranslated as FixtureScheduleView } from '@kitman/modules/src/shared/FixtureScheduleView';
import style from '@kitman/modules/src/PlanningEvent/src/components/style';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { LeagueMatchDayManagementScheduleTranslated as LeagueMatchDayManagementSchedule } from '@kitman/modules/src/shared/LeagueMatchDayManagementSchedule';
import { CreateFixturePanelTranslated as CreateFixturePanel } from '@kitman/modules/src/LeagueOperations/shared/components/CreateFixturePanel';
import { getFixtureReportType } from '@kitman/modules/src/shared/FixtureScheduleView/utils';
import MatchMonitorReport from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport';
import { MatchRequestsTranslated as MatchRequests } from '@kitman/modules/src/shared/MatchRequests';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getMatchMonitorTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getMatchMonitorData';

import { fixtureReports } from '@kitman/modules/src/shared/FixtureScheduleView/helpers';
import useAssignStaffPanel from '../shared/AssignStaffPanel/hooks/useAssignStaffPanel';
import AssignStaffPanel from '../shared/AssignStaffPanel';

export const pageNames = {
  SCHEDULE_VIEW: 'SCHEDULE_VIEW',
  MATCH_REPORT: 'MATCH_REPORT',
  MATCH_MONITOR_REPORT: 'MATCH_MONITOR_REPORT',
  MATCH_REQUESTS: 'MATCH_REQUESTS',
};

export const getUrlPathnameData = (
  length: number = 2
): {
  id?: number,
  path?: string,
} => {
  const splitPath = window.location.pathname
    .split('/')
    .filter((i) => i.length > 0);
  const id = +splitPath.slice(-1);
  const path = splitPath.slice(0, length).join('/');

  return {
    id,
    path,
  };
};

const LeaguesAndOfficialsApp = () => {
  const { isLeagueStaffUser } = useLeagueOperations();
  const { toasts, toastDispatch } = useToasts();
  const { permissions, permissionsRequestStatus } = usePermissions();
  const { preferences, isPreferencesSuccess } = usePreferences();
  const { path, id: pathId } = getUrlPathnameData();

  const [pageView, setPageView] = useState(pageNames.SCHEDULE_VIEW);
  const [scheduleViewId, setScheduleViewId] = useState(Math.random());
  const [isReload, setIsReload] = useState(false);
  const { handleOnToggle } = useAssignStaffPanel();
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    if (path === 'league-fixtures/reports' && typeof pathId === 'number') {
      setPageView(pageNames.MATCH_REPORT);
    } else if (path === 'match_monitor/report' && typeof pathId === 'number') {
      setPageView(pageNames.MATCH_MONITOR_REPORT);
    } else if (
      path === 'league-fixtures/requests' &&
      typeof pathId === 'number'
    ) {
      setPageView(pageNames.MATCH_REQUESTS);
    } else if (path === 'league-fixtures') {
      setPageView(pageNames.SCHEDULE_VIEW);
    }
  }, [path, pathId]);

  const renderView = () => {
    if (permissionsRequestStatus !== 'SUCCESS' || !isPreferencesSuccess) {
      return null;
    }

    if (pageView === pageNames.MATCH_REPORT) {
      return (
        <div data-testid="MatchReport">
          <MatchReport eventId={+pathId} toastDispatch={toastDispatch} />
        </div>
      );
    }

    if (pageView === pageNames.MATCH_MONITOR_REPORT) {
      return <MatchMonitorReport />;
    }

    if (pageView === pageNames.MATCH_REQUESTS) {
      return <MatchRequests eventId={+pathId} toastDispatch={toastDispatch} />;
    }

    const isMatchDayManagementSchedule = preferences?.league_game_schedule;

    const renderEventsScheduleGrid = () => {
      const renderMatchDayManagementSchedule =
        permissions?.leagueGame.viewGameSchedule;

      if (renderMatchDayManagementSchedule) {
        return <LeagueMatchDayManagementSchedule />;
      }
      return null;
    };

    return isLeagueStaffUser && isMatchDayManagementSchedule ? (
      renderEventsScheduleGrid()
    ) : (
      <FixtureScheduleView
        key={scheduleViewId}
        onToggleEvent={(event: Event) => handleOnToggle(event)}
        isReload={isReload}
        setIsReload={setIsReload}
        toastDispatch={toastDispatch}
      />
    );
  };

  return (
    <div data-testid="LeagueAndOfficials" css={style.leagueAndOfficialLayout}>
      <div className="planningEvent" css={style.content}>
        {renderView()}
        <AssignStaffPanel
          reportType={getFixtureReportType(preferences)}
          onSaveSuccess={() => {
            setIsReload(true);
            setScheduleViewId(Math.random());
            const reportType = getFixtureReportType(preferences);
            if (reportType === fixtureReports.matchMonitorReport) {
              trackEvent(
                leagueOperationsEventNames.matchMonitorAssigned,
                getMatchMonitorTrackingData({
                  product: 'league-ops',
                  productArea: 'schedule',
                  feature: 'match-monitor',
                })
              );
            }
          }}
        />
        <ToastDialog
          toasts={toasts}
          onCloseToast={(id) => {
            toastDispatch({
              type: 'REMOVE_TOAST_BY_ID',
              id,
            });
          }}
        />
        {window.getFlag('league-ops-create-fixture-panel') && (
          <CreateFixturePanel />
        )}
      </div>
      <div css={style.slideout} id="planningEvent-Slideout" />
    </div>
  );
};

export default LeaguesAndOfficialsApp;
