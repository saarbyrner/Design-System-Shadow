// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Permissions } from '@kitman/common/src/types/Permissions';
import type { Modules } from '@kitman/common/src/types/Modules';
import type { LeagueOperations } from '@kitman/common/src/hooks/useLeagueOperations';
import { leagueFixturesMenuItems } from '@kitman/modules/src/LeagueFixtures/src/shared/menu';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';
import { type DashboardGroupResponse } from '@kitman/modules/src/analysis/LookerDashboardGroup/types';
import {
  metricDashboardMenuItems,
  athletesMenuItems,
  analysisMenuItems,
  workloadsMenuItems,
  formsMenuItems,
  settingsMenuItems,
  mediaMenuItems,
} from './secondaryMenuItems';

export const getSecondaryMenuItems = (
  activeSecondaryMenu: ?string,
  permissions: Permissions,
  modules: Modules,
  leagueOperations: LeagueOperations,
  preferences: PreferenceType,
  isAthlete: boolean,
  powerBiReports: Array<{ id: number, name: string }>,
  dashboardGroups: DashboardGroupResponse
) => {
  let secondaryItems = null;
  switch (activeSecondaryMenu) {
    case 'metric_dashboard':
      secondaryItems = metricDashboardMenuItems(
        window.location.pathname,
        permissions
      );
      break;
    case 'analysis':
      secondaryItems = analysisMenuItems(
        window.location.pathname,
        permissions,
        powerBiReports,
        dashboardGroups
      );
      break;
    case 'athletes':
      secondaryItems = athletesMenuItems(window.location.pathname, permissions);
      break;
    case 'workloads':
      secondaryItems = workloadsMenuItems(
        window.location.pathname,
        permissions,
        leagueOperations
      );
      break;
    case 'forms':
      secondaryItems = formsMenuItems(
        window.location.pathname,
        isAthlete,
        permissions
      );
      break;
    case 'settings':
      secondaryItems = settingsMenuItems(
        window.location.pathname,
        permissions,
        modules,
        preferences
      );
      break;
    case 'media':
      secondaryItems = mediaMenuItems(window.location.pathname, permissions);
      break;
    case 'league-fixtures':
      secondaryItems = leagueFixturesMenuItems({
        path: window.location.pathname,
        permissions,
        leagueOperations,
      });
      break;
    default:
      secondaryItems = [];
  }
  return secondaryItems;
};

export const getSecondaryMenuTitle = (activeSecondaryMenu: ?string) => {
  let title = '';
  switch (activeSecondaryMenu) {
    case 'metric_dashboard':
      title = i18n.t('Dashboard');
      break;
    case 'analysis':
      title = i18n.t('Analysis');
      break;
    case 'athletes':
      title = i18n.t('#sport_specific__Athletes');
      break;
    case 'workloads':
      title = window.getFlag('planning-session-planning')
        ? i18n.t('Planning')
        : i18n.t('Workloads');
      break;
    case 'forms':
      title = i18n.t('Forms');
      break;
    case 'settings':
      title = window.featureFlags['side-nav-update']
        ? i18n.t('Administration')
        : i18n.t('Settings');
      break;
    case 'media':
      title = i18n.t('Media');
      break;
    case 'league-fixtures':
      title = i18n.t('Schedule');
      break;
    default:
      title = '';
  }
  return title;
};
