/* eslint-disable flowtype/require-valid-file-annotation */
import { matchPath } from 'react-router-dom';
import i18n from '@kitman/common/src/utils/i18n';
import registrationRoutes from '@kitman/modules/src/Registration/shared/menu';
import leagueFixturesRoutes from '@kitman/modules/src/LeagueFixtures/src/shared/menu';
import compact from 'lodash/compact';

import {
  metricDashboardMenuItems,
  athletesMenuItems,
  analysisMenuItems,
  workloadsMenuItems,
  formsMenuItems,
  settingsMenuItems,
  mediaMenuItems,
} from './secondaryMenuItems';

export const getFirstSubmenuUrl = (submenuItems) => {
  const allowedSubmenuItems = submenuItems.filter((item) => item.allowed);
  return allowedSubmenuItems.length > 0 ? allowedSubmenuItems[0].href : '';
};

export const hasSubMenu = (submenuItems) => {
  const allowedSubmenuItems = submenuItems.filter((item) => item.allowed);
  return allowedSubmenuItems.length >= 2;
};

export default (
  path,
  permissions = {},
  includeHomepage = false,
  leagueOperations = {},
  currentUser = {},
  powerBiReports = [],
  dashboardGroups
) => {
  const derivedAnalysisMenuItems = analysisMenuItems(
    path,
    permissions,
    powerBiReports,
    dashboardGroups
  );

  const items = compact([
    {
      id: 'homepage',
      title: i18n.t('Homepage'),
      href: '/home_dashboards',
      icon: 'icon-home',
      matchPath: matchPath('/home_dashboards/*', path),
      allowed:
        includeHomepage &&
        permissions.canViewHomepage &&
        window.getFlag('web-home-page'),
      hasSubMenu: hasSubMenu([]),
    },
    // This item can be removed once side-nav-update is enabled
    // It has been moved to a submenu
    {
      id: 'metric_dashboard',
      title: window.featureFlags['side-nav-update']
        ? i18n.t('Athlete Metrics')
        : i18n.t('Metric Dashboard'),
      href: getFirstSubmenuUrl(metricDashboardMenuItems(path, permissions)),
      icon: 'icon-dashboard',
      matchPath: matchPath('/dashboards/*', path),
      allowed:
        !window.featureFlags['side-nav-update'] && permissions.canViewDashboard,
      hasSubMenu: hasSubMenu(metricDashboardMenuItems(path, permissions)),
    },
    {
      id: 'analysis',
      title: i18n.t('Analysis'),
      href: getFirstSubmenuUrl(derivedAnalysisMenuItems),
      icon: 'icon-column-graph',
      matchPath:
        (window.featureFlags['side-nav-update'] &&
          matchPath('/dashboards/*', path)) ||
        matchPath('/analysis/*', path) ||
        matchPath('/athletes/reports', path),

      // If the user has access to any analysis menu items, we show the Analysis menu
      // If not, we don't show it at all
      // This is to avoid showing an empty Analysis menu
      allowed: derivedAnalysisMenuItems.some((item) => item.allowed),
      hasSubMenu: hasSubMenu(derivedAnalysisMenuItems),
    },
    // This item can be removed once side-nav-update is enabled
    // It has been moved to a submenu
    {
      id: 'alerts',
      title: i18n.t('Alerts'),
      href: '/alerts',
      icon: 'icon-alarm',
      matchPath: matchPath('/alerts/*', path),
      allowed:
        !window.featureFlags['side-nav-update'] &&
        window.featureFlags['alerts-area'] &&
        permissions.canViewAlerts,
      hasSubMenu: hasSubMenu([]),
    },
    {
      id: 'athletes',
      title: i18n.t('#sport_specific__Athletes'),
      href: getFirstSubmenuUrl(athletesMenuItems(path, permissions)),
      icon: 'icon-athletes',
      matchPath: (() => {
        const matchAthleteAnalysisPath = matchPath('/athletes/reports/*', path);
        if (matchAthleteAnalysisPath) {
          return null;
        }

        return matchPath('/athletes/*', path);
      })(),
      allowed: permissions.canViewAthletes && permissions.canViewAthletesArea,
      hasSubMenu: hasSubMenu(athletesMenuItems(path, permissions)),
    },
    {
      id: 'medical',
      title: i18n.t('Medical'),
      href: '/medical/rosters',
      icon: 'icon-medical',
      matchPath:
        matchPath('/medical/rosters/*', path) ||
        matchPath('/medical/athletes/*', path),
      allowed:
        permissions.canViewMedical &&
        window.featureFlags['medical-module-parent'],
      hasSubMenu: hasSubMenu([]),
    },
    {
      id: 'workloads',
      title: window.getFlag('planning-session-planning')
        ? i18n.t('Planning')
        : i18n.t('Workloads'),
      href: getFirstSubmenuUrl(
        workloadsMenuItems(path, permissions, leagueOperations)
      ),
      icon: 'icon-workload',
      matchPath:
        matchPath('/workloads/*', path) ||
        matchPath('/planning_hub/events/*', path) ||
        matchPath('/planning_hub/settings/*', path) ||
        matchPath('/planning_hub/coaching_library', path) ||
        matchPath('/fixture_negotiation/*', path) ||
        matchPath('/jtc_fixture_negotiation/*', path) ||
        matchPath('/events-management/*', path) ||
        matchPath('/planning_hub/league-schedule/*', path) ||
        matchPath('/league-fixtures/discipline/*', path) ||
        matchPath('/scout-schedule/*', path),
      allowed:
        !(leagueOperations.isLeagueStaffUser || leagueOperations.isScout) &&
        (permissions.canViewWorkload ||
          (window.featureFlags['tso-club-fixture-negotiation'] &&
            permissions.canViewTSOFixtureNegotiation) ||
          (window.featureFlags['tso-club-jtc-fixture-negotiation'] &&
            permissions.canViewTSOJtcFixtureRequests) ||
          (window.featureFlags['tso-event-management'] &&
            permissions.canViewTSOEvent) ||
          window.featureFlags['league-schedule-club-view'] ||
          (window.featureFlags['league-ops-discipline-area'] &&
            permissions?.canViewDisciplineArea) ||
          window.featureFlags['scout-schedule-view']),
      hasSubMenu: hasSubMenu(
        workloadsMenuItems(path, permissions, leagueOperations)
      ),
    },
    {
      id: 'forms',
      title: i18n.t('Forms'),
      href: getFirstSubmenuUrl(
        formsMenuItems(path, !!currentUser?.is_athlete, permissions)
      ),
      icon: 'icon-questionnaire',
      matchPath: [
        matchPath('/questionnaires/*', path),
        matchPath('/select_athlete/*', path),
        matchPath('/assessments/*', path),
        window.featureFlags['side-nav-update'] &&
          matchPath('/administration/questionnaire_templates/*', path),
        !window.featureFlags['side-nav-update'] &&
          matchPath('/settings/questionnaire_templates/*', path),
        matchPath('/reviews/*', path),
        matchPath('/growth_and_maturation/*', path),
        matchPath('/benchmark/test_validation', path),
        matchPath('/benchmark/league_benchmarking', path),
        matchPath('/training_data_importer/*', path),
        matchPath('/forms/form_templates', path),
        matchPath('/forms/form_answers_sets', path),
        matchPath('/forms/my_forms', path),
      ].some(Boolean),
      allowed:
        [
          permissions.canViewQuestionnaires,
          permissions.canViewAssessments,
          window.featureFlags['tso-forms-reviews'],
          window.featureFlags['tso-document-management'],
          window.getFlag('growth-and-maturation-area'),
          window.getFlag('training-variables-importer'),
          window.getFlag('view-form-templates-page'),
          window.getFlag('view-completed-forms-page'),
          window.getFlag('cp-forms-athlete-forms-on-web'),
        ].some(Boolean) && !window.getFlag('cp-hide-forms-in-player-portal'),
      hasSubMenu: hasSubMenu(
        formsMenuItems(path, !!currentUser?.is_athlete, permissions)
      ),
    },
    {
      id: 'calendar',
      title: i18n.t('Calendar'),
      href: '/calendar',
      icon: 'icon-calendar',
      matchPath: matchPath('/calendar/*', path),
      allowed: permissions.canViewWorkload,
      hasSubMenu: hasSubMenu([]),
    },
    {
      id: 'documents',
      title: i18n.t('Documents'),
      href: '/documents',
      icon: 'icon-template',
      matchPath: matchPath('/documents/*', path),
      allowed: window.featureFlags['mls-emr-documents-area'],
      hasSubMenu: hasSubMenu([]),
    },
    {
      id: 'activity',
      title: i18n.t('Activity'),
      href: '/activity',
      icon: 'icon-nav-activity',
      matchPath: matchPath('/activity/*', path),
      allowed: permissions.canViewActivityLog,
      hasSubMenu: hasSubMenu([]),
    },
    {
      id: 'messaging',
      title: i18n.t('Messaging'),
      href: '/messaging',
      icon: 'icon-messaging',
      matchPath: matchPath('/messaging/*', path),
      allowed: permissions.canViewMessaging && window.featureFlags['chat-web'],
      hasSubMenu: hasSubMenu([]),
    },
    // TSO -> IP menu items
    {
      id: 'media',
      title: i18n.t('Media'),
      href: getFirstSubmenuUrl(mediaMenuItems(path, permissions)),
      icon: 'icon-media',
      matchPath:
        matchPath('/media/videos/*', path) ||
        matchPath('/media/documents/*', path),
      allowed: !!(
        (window.featureFlags['tso-video-analysis'] &&
          permissions.canViewTSOVideo) ||
        (window.featureFlags['tso-document-management'] &&
          permissions.canViewTSODocument)
      ),
      hasSubMenu: hasSubMenu(mediaMenuItems(path, permissions)),
    },
    {
      id: 'recruitment',
      title: i18n.t('Recruitment'),
      href: '/recruitment',
      icon: 'icon-person',
      matchPath: matchPath('/recruitment/*', path),
      allowed:
        window.getFlag('tso-recruitment') && permissions.canViewTSORecruitment,
      hasSubMenu: hasSubMenu([]),
    },
    ...registrationRoutes(
      matchPath('/registration/*', path),
      hasSubMenu([]),
      currentUser
    ),
    ...leagueFixturesRoutes(path, permissions, leagueOperations),
    {
      id: 'efile',
      title: i18n.t('eFile'),
      href: '/efile/inbox',
      icon: 'icon-mail',
      matchPath: matchPath('/efile/*', path),
      allowed:
        window.featureFlags['nfl-efile'] && permissions.canViewElectronicFiles,
    },
    {
      id: 'settings',
      title: window.featureFlags['side-nav-update']
        ? i18n.t('Administration')
        : i18n.t('Settings'),
      href: getFirstSubmenuUrl(settingsMenuItems(path, permissions)),
      icon: 'icon-settings',
      matchPath: (() => {
        const matchManageQuestionnairePath = matchPath(
          window.featureFlags['side-nav-update']
            ? '/administration/questionnaire_templates/*'
            : '/settings/questionnaire_templates/*',
          path
        );
        if (matchManageQuestionnairePath) {
          return null;
        }

        return (
          (window.featureFlags['side-nav-update'] &&
            matchPath('/alerts/*', path)) ||
          (window.featureFlags['side-nav-update'] &&
            matchPath('/administration/*', path)) ||
          (!window.featureFlags['side-nav-update'] &&
            matchPath('/settings/*', path)) ||
          matchPath('/fixtures/*', path) ||
          matchPath('/fixture-management/*', path) ||
          matchPath('/jtc_fixture_management/*', path)
        );
      })(),
      allowed:
        permissions.canManageAthletes ||
        permissions.canManageGeneralSettings ||
        permissions.canManageWorkload ||
        (window.featureFlags['tso-league-fixture-management'] &&
          permissions.canViewTSOFixtureManagement) ||
        (window.featureFlags['tso-league-jtc-fixture-management'] &&
          permissions.canViewTSOJtcFixtureRequests),
      hasSubMenu: hasSubMenu(settingsMenuItems(path, permissions)),
    },
    /**
     * This page is only available for an athlete login
     * and allows them to export their own data
     */
    {
      id: 'athlete_exports',
      title: i18n.t('Exports'),
      href: '/my_exports',
      icon: 'icon-export',
      matchPath: matchPath('/my_exports', path),
      allowed:
        leagueOperations.isLoginOrganisation ||
        (window.featureFlags['athlete-run-medical-export'] &&
          permissions.canViewAthleteOwnExport),
    },
  ]);

  return items;
};
