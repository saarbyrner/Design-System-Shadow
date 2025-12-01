// @flow
import { useEffect, useState } from 'react';
import {
  getUrlPathnameData,
  pageNames,
} from '@kitman/modules/src/LeagueFixtures/src/components/App';
import MatchReport from '@kitman/modules/src/shared/MatchReport';
import { FixtureScheduleViewTranslated as FixtureScheduleView } from '@kitman/modules/src/shared/FixtureScheduleView';
import { MatchRequestsTranslated as MatchRequests } from '@kitman/modules/src/shared/MatchRequests';
import style from '@kitman/modules/src/PlanningEvent/src/components/style';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

const LeagueScheduleApp = () => {
  const { permissionsRequestStatus } = usePermissions();
  const { isPreferencesSuccess } = usePreferences();
  const { toasts, toastDispatch } = useToasts();
  const [pageView, setPageView] = useState('');
  const { path, id: pathId } = getUrlPathnameData(3);

  useEffect(() => {
    if (
      path === 'planning_hub/league-schedule/reports' &&
      typeof pathId === 'number'
    ) {
      setPageView(pageNames.MATCH_REPORT);
    } else if (
      path === 'planning_hub/league-schedule/requests' &&
      typeof pathId === 'number'
    ) {
      setPageView(pageNames.MATCH_REQUESTS);
    } else {
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

    if (pageView === pageNames.MATCH_REQUESTS) {
      return <MatchRequests eventId={+pathId} toastDispatch={toastDispatch} />;
    }

    return <FixtureScheduleView toastDispatch={toastDispatch} />;
  };

  return (
    <div data-testid="LeagueScheduleApp" css={style.leagueAndOfficialLayout}>
      <div className="planningEvent" css={style.content}>
        {pageView && renderView()}
      </div>
      <ToastDialog
        toasts={toasts}
        onCloseToast={(id) => {
          toastDispatch({
            type: 'REMOVE_TOAST_BY_ID',
            id,
          });
        }}
      />
    </div>
  );
};

export default LeagueScheduleApp;
