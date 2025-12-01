/* eslint-disable flowtype/require-valid-file-annotation */
import { matchPath } from 'react-router-dom';
import i18n from '@kitman/common/src/utils/i18n';
import { analysisMenuItemsArrayPositions } from '../consts';

export const metricDashboardMenuItems = (path, permissions = []) => {
  const items = [
    {
      id: 'metric_dashboard_view',
      title: i18n.t('Dashboard'),
      href: '/dashboards/show',
      matchPath: (() => {
        if (
          matchPath('/dashboards/templates/*', path) ||
          matchPath('/dashboards/:dashboardId/edit/*', path)
        ) {
          return null;
        }

        return matchPath('/dashboards/*', path);
      })(),
      allowed: permissions.canViewDashboard,
    },
    {
      id: 'metric_dashboard_templates',
      title: i18n.t('Dashboard Manager'),
      href: '/dashboards/templates',
      matchPath:
        matchPath('/dashboards/templates/*', path) ||
        matchPath('/dashboards/:dashboardId/edit/*', path),
      allowed: permissions.canManageDashboard,
    },
  ];
  return items;
};

export const settingsMenuItems = (
  path,
  permissions = {},
  modules = {},
  preferences = {}
) => {
  const items = [
    {
      id: 'manage_athletes',
      title: i18n.t('#sport_specific__Manage_Athletes'),
      href: window.featureFlags['side-nav-update']
        ? '/administration/athletes'
        : '/settings/athletes',
      matchPath: matchPath(
        window.featureFlags['side-nav-update']
          ? '/administration/athletes/*'
          : '/settings/athletes/*',
        path
      ),
      allowed: permissions.canManageAthletes,
    },
    {
      id: 'manage_squads',
      title: i18n.t('Manage Squads'),
      href: '/administration/squads',
      matchPath: matchPath('/administration/squads/*', path),
      allowed:
        window.featureFlags['league-ops-squad-management'] &&
        permissions.canEditSquad,
    },
    {
      id: 'manage_staff',
      title: i18n.t('Manage Staff Users'),
      href: '/users',
      matchPath: matchPath('/users/*', path),
      allowed:
        permissions.canManageGeneralSettings || permissions.canViewStaffUsers,
    },
    ...(window.featureFlags['league-ops-additional-users']
      ? [
          {
            id: 'manage_additional_users',
            title: i18n.t('Manage Additional Users'),
            href: '/administration/additional_users',
            matchPath: matchPath('/administration/additional_users/*', path),
            allowed:
              (permissions.canManageOfficials ||
                permissions.canManageScouts ||
                permissions.canManageMatchDirectors ||
                permissions.canManageMatchMonitors) &&
              window.getFlag('league-ops-additional-users'),
          },
        ]
      : [
          ...(window.featureFlags['league-ops-officials-user-type']
            ? [
                {
                  id: 'manage_officials',
                  title: i18n.t('Manage Officials'),
                  href: window.featureFlags['side-nav-update']
                    ? '/administration/officials'
                    : '/settings/officials',
                  matchPath: matchPath(
                    window.featureFlags['side-nav-update']
                      ? '/administration/officials/*'
                      : '/settings/officials/*',
                    path
                  ),
                  allowed: permissions.canManageOfficials,
                },
              ]
            : []),
          {
            id: 'manage_scouts',
            title: i18n.t('Manage Scouts'),
            href: '/administration/scouts',
            matchPath: matchPath('/administration/scouts/*', path),
            allowed:
              window.featureFlags['league-ops-scouts-user-type'] &&
              permissions.canManageScouts,
          },
        ]),
    {
      id: 'manage_fixtures',
      title: i18n.t('Manage Games'),
      href: '/fixtures',
      matchPath: matchPath('/fixtures/*', path),
      allowed:
        permissions.canManageWorkload &&
        window.featureFlags['admin-manage-fixtures-visibility'],
    },
    {
      id: 'manage_org',
      title: i18n.t('Organisation Settings'),
      href: window.featureFlags['side-nav-update']
        ? '/administration/organisation/edit'
        : '/settings/organisation/edit',
      matchPath: matchPath(
        window.featureFlags['side-nav-update']
          ? '/administration/organisation/edit/*'
          : '/settings/organisation/edit/*',
        path
      ),
      allowed: permissions.canManageOrgSettings,
    },
    {
      id: 'manage_metric',
      title: i18n.t('Analytics'),
      href: window.featureFlags['side-nav-update']
        ? '/administration/analytics'
        : '/settings/injury_risk_variables',
      matchPath: matchPath(
        window.featureFlags['side-nav-update']
          ? '/administration/analytics/*'
          : '/settings/injury_risk_variables/*',
        path
      ),
      allowed: modules.hasRiskAdvisor && permissions.canViewMetrics,
    },
    {
      id: 'emr_orders',
      title: i18n.t('Order Management'),
      href: window.featureFlags['side-nav-update']
        ? '/administration/order_management'
        : '/settings/order_management',
      matchPath: matchPath(
        window.featureFlags['side-nav-update']
          ? '/administration/order_management/*'
          : '/settings/order_management/*',
        path
      ),
      allowed: window.featureFlags['emr-orders'],
    },
    {
      id: 'exports',
      title: i18n.t('Exports'),
      href: window.featureFlags['side-nav-update']
        ? '/administration/exports'
        : '/settings/exports',
      matchPath: matchPath(
        window.featureFlags['side-nav-update']
          ? '/administration/exports/*'
          : '/settings/exports/*',
        path
      ),
      allowed: window.featureFlags['export-page'],
    },
    {
      id: 'imports',
      title: i18n.t('Imports'),
      href: window.featureFlags['side-nav-update']
        ? '/administration/imports'
        : '/settings/imports',
      icon: 'icon-upload',
      matchPath: matchPath(
        window.featureFlags['side-nav-update']
          ? '/administration/imports/*'
          : '/settings/imports/*',
        path
      ),
      allowed:
        window.featureFlags['league-ops-mass-create-athlete-staff'] &&
        permissions.canViewImports,
    },
    {
      id: 'stock_management',
      title: i18n.t('Stock Management'),
      href: '/stock_management',
      matchPath: matchPath('/stock_management/*', path),
      allowed:
        window.featureFlags['stock-management'] &&
        permissions.canViewStockManagement,
    },
    {
      id: 'fixture_management',
      title: i18n.t('Fixture Management'),
      href: '/fixture_management',
      matchPath: matchPath('/fixture_management/*', path),
      allowed:
        window.featureFlags['tso-league-fixture-management'] &&
        permissions.canViewTSOFixtureManagement,
    },
    {
      id: 'jtc_fixture_management',
      title: i18n.t('Pre-Academy Fixture Management'),
      href: '/pre_academy_fixture_management',
      matchPath: matchPath('/pre_academy_fixture_management/*', path),
      allowed:
        window.getFlag('tso-league-jtc-fixture-management') &&
        permissions.canViewTSOJtcFixtureRequests,
    },
    ...(window.featureFlags['conditional-fields-creation-in-ip'] &&
    (permissions.canAdminInjurySurveillance || permissions.canAdminLogicBuilder)
      ? [
          {
            id: 'conditional_fields',
            title: i18n.t('Logic Builder'),
            href: '/administration/conditional_fields',
            matchPath: matchPath('/administration/conditional_fields/*', path),
            allowed:
              window.featureFlags['conditional-fields-creation-in-ip'] &&
              (permissions.canAdminInjurySurveillance ||
                permissions.canAdminLogicBuilder),
          },
        ]
      : []),
    ...(window.getFlag('labels-and-groups')
      ? [
          {
            id: 'labels',
            title: i18n.t('Athlete Labels'),
            href: '/administration/labels/manage',
            matchPath: matchPath('/administration/labels/*', path),
            allowed:
              window.getFlag('labels-and-groups') && permissions.canViewLabels,
          },
          {
            id: 'groups',
            title: i18n.t('Athlete Groups'),
            href: '/administration/groups',
            matchPath: matchPath('/administration/groups/*', path),
            allowed:
              window.getFlag('labels-and-groups') &&
              permissions.canViewSegments,
          },
        ]
      : []),
    {
      id: 'kit_matrix',
      title: i18n.t('Kit Matrix'),
      href: '/settings/kit-matrix',
      matchPath: matchPath('/settings/kit-matrix/*', path),
      allowed: preferences?.league_game_kits && permissions.canViewKitMatrix,
    },
    {
      id: 'contacts',
      title: i18n.t('Contacts'),
      href: '/settings/contacts',
      matchPath: matchPath('/settings/contacts/*', path),
      allowed: preferences?.league_game_contacts && permissions.canViewContacts,
    },
    {
      id: 'email-log',
      title: i18n.t('Email Log'),
      href: '/settings/email-log',
      matchPath: matchPath('/settings/email-log/*', path),
      allowed: permissions.canViewEmails,
    },
  ];

  if (window.featureFlags['side-nav-update']) {
    items.splice(3, 0, {
      id: 'alerts',
      title: i18n.t('Manage Alerts'),
      href: '/alerts',
      icon: 'icon-alarm',
      matchPath: matchPath('/alerts/*', path),
      allowed: window.featureFlags['alerts-area'] && permissions.canViewAlerts,
    });
  }

  return items;
};

// Analysis sub-menu items that requires additional permissions checks
// will require validity in 2 different ways because `pageTitle.js`
// does not support `canView*` prefix but is dependent on `permissions.*.*.canView`.
// E.g. Coaching Summary, Staff Development and Medical Summary.
// This is required to evaluate the page title from the API.
export const analysisMenuItems = (
  path,
  permissions = [],
  powerBiReports = [],
  dashboardGroups
) => {
  const biReports = powerBiReports.map((report) => ({
    id: `powerBiEmbeddedReport${report.id}`,
    title: report.name,
    href: `power_bi_embedded_reports/${report.id}`,
    icon: 'icon-mail',
    matchPath: matchPath(`/power_bi_embedded_reports/${report.id}`, path),
    allowed: permissions.canViewPowerBiEmbeddedReports,
  }));

  const groupedDashboards = dashboardGroups?.dashboard_groups || [];
  const singleDashboard = dashboardGroups?.dashboards || [];

  const dashboardGroupItems = groupedDashboards.map((dashboardGroup) => {
    const { dashboards = [], id, name, slug } = dashboardGroup || {};
    const defaultDashboardId = dashboards[0]?.id;
    return {
      id: `dashboard_group_${id}`,
      title: name,
      href: `/report/${slug}/${defaultDashboardId}`,
      matchPath: matchPath(`/report/${slug}/${defaultDashboardId}`, path),
      allowed:
        permissions?.analysis?.lookerDashboardGroup?.canView ||
        permissions.canViewLookerDashboardGroup,
    };
  });

  const singleDashboardItems = singleDashboard.map((dashboard) => {
    const { id, name } = dashboard || {};
    return {
      id: `dashboard_${id}`,
      title: name,
      href: `/report/${id}`,
      matchPath: matchPath(`/report/${id}`, path),
      allowed:
        permissions?.analysis?.lookerDashboardGroup?.canView ||
        permissions.canViewLookerDashboardGroup,
    };
  });

  const items = [
    {
      id: 'analytic_dashboard',
      title: i18n.t('Dashboard'),
      href: '/analysis/dashboard',
      matchPath: matchPath('/analysis/dashboard/*', path),
      allowed: permissions.canViewAnalyticalDashboard,
    },
    {
      id: 'graph_builder',
      title: i18n.t('Graph Builder'),
      href: '/analysis/graph/builder',
      matchPath: matchPath('/analysis/graph/builder/*', path),
      allowed: permissions.canViewAnalyticalGraphs,
    },
    {
      id: 'squad_analysis',
      title: i18n.t('#sport_specific__Squad_Analysis'),
      href: '/analysis/squad',
      matchPath: matchPath('/analysis/squad/*', path),
      allowed: permissions.canViewSquadAnalysis,
    },
    {
      id: 'athlete_analysis',
      title: i18n.t('#sport_specific__Athlete_Analysis'),
      href: '/analysis/athletes',
      matchPath: matchPath('/analysis/athletes/*', path),
      allowed:
        permissions.canViewAthleteAnalysis &&
        !window.getFlag('athlete-sharing-hide-athlete-analysis-page'),
    },
    {
      id: 'athlete_reports',
      title: i18n.t('#sport_specific__Athlete_Reports'),
      href: '/athletes/reports',
      matchPath: matchPath('/athletes/reports/*', path),
      allowed:
        permissions.isQuestionnairesAdmin &&
        permissions.canViewAthletes &&
        !window.getFlag('athlete-sharing-hide-athlete-report-page'),
    },
    {
      id: 'injury_analysis',
      title: i18n.t('Injury Analysis'),
      href: '/analysis/injuries',
      matchPath: matchPath('/analysis/injuries/*', path),
      allowed: permissions.canViewInjuryAnalysis,
    },
    {
      id: 'biomech_analysis',
      title: i18n.t('Biomechanical Analysis'),
      href: '/analysis/biomechanical',
      matchPath: matchPath('/analysis/biomechanical/*', path),
      allowed: permissions.canViewBiomechanicalAnalysis,
    },
    {
      id: 'alarm_analysis',
      title: i18n.t('Alarm Analysis'),
      href: '/analysis/alarm',
      matchPath: matchPath('/analysis/alarm/*', path),
      allowed: window.getFlag('analysis-alarm-analysis'),
    },
    ...biReports,
    ...dashboardGroupItems,
    ...singleDashboardItems,
  ];

  if (
    window.getFlag('rep-show-coaching-summary') &&
    (permissions.canViewCoachingSummary ||
      permissions?.analysis?.coachingSummary?.canView)
  ) {
    items.splice(analysisMenuItemsArrayPositions.CoachingDashboard, 0, {
      id: 'coaching_dashboard',
      title: i18n.t('Coaching Summary'),
      href: '/analysis/template_dashboards/coaching_summary',
      matchPath: matchPath(
        '/analysis/template_dashboards/coaching_summary/*',
        path
      ),
      allowed:
        window.getFlag('rep-show-coaching-summary') &&
        (permissions.canViewCoachingSummary ||
          permissions?.analysis?.coachingSummary?.canView),
    });
  }

  if (
    window.getFlag('rep-show-development-journey') &&
    (permissions.canViewDevelopmentJourney ||
      permissions?.analysis?.developmentJourney?.canView)
  ) {
    items.splice(
      analysisMenuItemsArrayPositions.DevelopmentJourneyDashboard,
      0,
      {
        id: 'development_journey_dashboard',
        title: i18n.t('Development Journey'),
        href: '/analysis/template_dashboards/development_journey',
        matchPath: matchPath(
          '/analysis/template_dashboards/development_journey/*',
          path
        ),
        allowed:
          window.getFlag('rep-show-development-journey') &&
          (permissions.canViewDevelopmentJourney ||
            permissions?.analysis?.developmentJourney?.canView),
      }
    );
  }

  // Medical Summary is gated by 2 permissions.
  // medical.medical-graphing and analysis.view-medical-summary-dashboard.
  if (
    window.getFlag('rep-show-medical-summary') &&
    ((permissions.canViewMedicalGraphing &&
      permissions.canViewMedicalSummary) ||
      (permissions?.analysis?.medicalSummary?.canView &&
        permissions?.medical?.medicalGraphing?.canView))
  ) {
    items.splice(analysisMenuItemsArrayPositions.MedicalDashboard, 0, {
      id: 'medical_dashboard',
      title: i18n.t('Medical Summary'),
      href: '/analysis/template_dashboards/medical',
      matchPath: matchPath('/analysis/template_dashboards/medical/*', path),
      allowed:
        window.getFlag('rep-show-medical-summary') &&
        ((permissions.canViewMedicalGraphing &&
          permissions.canViewMedicalSummary) ||
          (permissions?.analysis?.medicalSummary?.canView &&
            permissions?.medical?.medicalGraphing?.canView)),
    });
  }

  if (window.getFlag('rep-show-growth-and-maturation-report')) {
    items.splice(
      analysisMenuItemsArrayPositions.GrowthAndMaturationDashboard,
      0,
      {
        id: 'growth_and_maturation_dashboard',
        title: i18n.t('Growth & Maturation Report'),
        href: '/analysis/template_dashboards/growth_and_maturation',
        matchPath: matchPath(
          '/analysis/template_dashboards/growth_and_maturation/*',
          path
        ),
        allowed:
          window.getFlag('rep-show-growth-and-maturation-report') &&
          (permissions?.canViewGrowthAndMaturationReportArea ||
            permissions?.analysis?.growthAndMaturationReportArea?.canView),
      }
    );
  }

  if (
    window.getFlag('rep-show-staff-development') &&
    (permissions.canViewStaffDevelopment ||
      permissions?.analysis?.staffDevelopment?.canView)
  ) {
    items.splice(analysisMenuItemsArrayPositions.StaffDevelopment, 0, {
      id: 'staff_development',
      title: i18n.t('Staff Development'),
      href: '/analysis/template_dashboards/staff_development',
      matchPath: matchPath(
        '/analysis/template_dashboards/staff_development/*',
        path
      ),
      allowed:
        window.getFlag('rep-show-staff-development') &&
        (permissions.canViewStaffDevelopment ||
          permissions?.analysis?.staffDevelopment?.canView),
    });
  }

  if (window.featureFlags['side-nav-update']) {
    items.splice(analysisMenuItemsArrayPositions.MetricsDashboard, 0, {
      id: 'metric_dashboard_view',
      title: i18n.t('Athlete Metrics'),
      href: '/dashboards/show',
      matchPath: (() => {
        if (
          matchPath('/dashboards/templates/*', path) ||
          matchPath('/dashboards/:dashboardId/edit/*', path)
        ) {
          return null;
        }

        return matchPath('/dashboards/*', path);
      })(),
      allowed: permissions.canViewDashboard,
    });
  }

  if (window.getFlag('rep-show-benchmark-reporting')) {
    items.splice(analysisMenuItemsArrayPositions.LeagueBenchmarkReporting, 0, {
      id: 'league_benchmark_reporting',
      title: i18n.t('League Benchmark Reporting'),
      href: '/analysis/benchmark_report',
      matchPath: matchPath('/analysis/benchmark_report/*', path),
      allowed:
        window.getFlag('rep-show-benchmark-reporting') &&
        permissions.canViewBenchmarkReport,
    });
  }

  return items;
};

export const athletesMenuItems = (path, permissions = []) => {
  const items = [
    {
      id: 'athletes',
      title: i18n.t('#sport_specific__Athletes'),
      href: '/athletes',
      matchPath: (() => {
        if (
          matchPath('/athletes/reports/*', path) ||
          matchPath('/athletes/screenings/*', path) ||
          matchPath('/athletes/availability/*', path) ||
          matchPath('/athletes/availability_report/*', path) ||
          matchPath('/athletes/availability_history/*', path)
        ) {
          return null;
        }

        return matchPath('/athletes/*', path);
      })(),
      allowed: permissions.canViewAthletes,
    },
    {
      id: 'availability',
      title: i18n.t('Availability'),
      href: '/athletes/availability',
      matchPath: matchPath('/athletes/availability/*', path),
      allowed: permissions.isAvailabilityAdmin,
    },
    {
      id: 'availability_report',
      title: window.getFlag('athlete-report-section')
        ? i18n.t('Availability Report')
        : i18n.t('Availability History'),
      href: window.getFlag('athlete-report-section')
        ? '/athletes/availability_report'
        : '/athletes/availability_history',
      matchPath:
        matchPath('/athletes/availability_report/*', path) ||
        matchPath('/athletes/availability_history/*', path),
      allowed: window.getFlag('athlete-report-section')
        ? permissions.canViewAvailabilityReport && permissions.canViewAthletes
        : permissions.isAvailabilityAdmin || permissions.canViewAvailability,
    },
    {
      id: 'screenings',
      title: i18n.t('Screenings'),
      href: '/athletes/screenings',
      matchPath: matchPath('/athletes/screenings/*', path),
      allowed: permissions.isQuestionnairesAdmin,
    },
  ];

  return items;
};

export const workloadsMenuItems = (
  path,
  permissions = [],
  leagueOperations = {}
) => {
  const items = [
    {
      id: 'planning',
      title: window.getFlag('planning-session-planning')
        ? i18n.t('Schedule')
        : i18n.t('Planning'),
      href: '/planning_hub/events',
      matchPath: matchPath('/planning_hub/events/*', path),
      allowed:
        window.getFlag('planning-session-planning') &&
        permissions.canViewWorkload,
    },
    {
      id: 'discipline',
      title: i18n.t('Discipline'),
      href: '/league-fixtures/discipline',
      matchPath: matchPath('/league-fixtures/discipline/*', path),
      allowed:
        window.featureFlags['league-ops-discipline-area'] &&
        permissions?.canViewDisciplineArea,
      hasSubMenu: false,
    },
    {
      id: 'squad',
      title: i18n.t('#sport_specific__Squad'),
      href: '/workloads/squad',
      matchPath: matchPath('/workloads/squad/*', path),
      allowed:
        permissions.canViewWorkload &&
        !window.getFlag(
          'cd-athlete-sharing-hide-athlete-and-squad-planning-options'
        ),
    },
    {
      id: 'athlete',
      title: i18n.t('#sport_specific__Athlete'),
      href: '/workloads/athletes',
      matchPath: matchPath('/workloads/athletes/*', path),
      allowed:
        permissions.canViewWorkload &&
        !window.getFlag(
          'cd-athlete-sharing-hide-athlete-and-squad-planning-options'
        ),
    },
    {
      id: 'planningSettings',
      title: i18n.t('Library'),
      href: '/planning_hub/settings',
      matchPath: matchPath('/planning_hub/settings/*', path),
      allowed:
        window.getFlag('planning-session-planning') &&
        window.getFlag('collections-side-panel') &&
        permissions.canViewWorkload &&
        permissions.isPlanningAdmin,
    },
    {
      id: 'coachingLibrary',
      title: i18n.t('Coaching library'),
      href: '/planning_hub/coaching_library',
      matchPath: matchPath('/planning_hub/coaching_library', path),
      allowed:
        window.getFlag('planning-tab-sessions') &&
        window.getFlag('coaching-library') &&
        permissions.isPlanningAdmin,
    },
    {
      id: 'fixture_negotiation',
      title: i18n.t('Fixture Negotiation'),
      href: '/fixture_negotiation',
      matchPath: matchPath('/fixture_negotiation/*', path),
      allowed:
        window.featureFlags['tso-club-fixture-negotiation'] &&
        permissions.canViewTSOFixtureNegotiation,
    },
    {
      id: 'jtc_fixture_negotiation',
      title: i18n.t('Pre-Academy Fixture Negotiation'),
      href: '/pre_academy_fixture_negotiation',
      matchPath: matchPath('/pre_academy_fixture_negotiation/*', path),
      allowed:
        window.getFlag('tso-club-jtc-fixture-negotiation') &&
        permissions.canViewTSOJtcFixtureRequests,
    },
    {
      id: 'fixture_finder',
      title: i18n.t('Fixture Finder'),
      href: '/fixture_finder',
      matchPath: matchPath('/fixture-finder/*', path),
      allowed: window.featureFlags['tso-fixture-finder'],
    },
    {
      id: 'events_management',
      title: i18n.t('Events Management'),
      href: '/events_management',
      matchPath: matchPath('/events_management/*', path),
      allowed:
        window.featureFlags['tso-event-management'] &&
        permissions.canViewTSOEvent,
    },
    {
      id: 'leagueSchedule',
      title: i18n.t('League Schedule'),
      href: '/planning_hub/league-schedule',
      matchPath: matchPath('/planning_hub/league-schedule/*', path),
      allowed:
        window.featureFlags['league-schedule-club-view'] &&
        !leagueOperations.isAssociationAdmin &&
        leagueOperations.isOrgSupervised,
    },
    {
      id: 'scoutSchedule',
      title: path.includes('/reports')
        ? i18n.t('Match Report')
        : i18n.t('Scout Schedule'),
      href: '/scout-schedule',
      matchPath: matchPath('/scout-schedule/*', path),
      allowed:
        window.featureFlags['scout-schedule-view'] &&
        permissions.canViewScoutSchedule,
    },
  ];

  return items;
};

export const formsMenuItems = (path, isAthlete, permissions = {}) => {
  const items = [
    {
      id: 'kiosk',
      title: i18n.t('Kiosk'),
      href: window.featureFlags['athlete-forms-list']
        ? '/questionnaires/selection'
        : '/select_athlete',
      matchPath: matchPath(
        window.featureFlags['athlete-forms-list']
          ? '/questionnaires/selection/*'
          : '/select_athlete/*',
        path
      ),
      allowed:
        !window.featureFlags['athlete-forms-list'] &&
        permissions.canViewQuestionnaires,
    },
    {
      id: 'manage_forms',
      title: i18n.t('Manage Forms'),
      href: window.featureFlags['side-nav-update']
        ? '/administration/questionnaire_templates'
        : '/settings/questionnaire_templates',
      matchPath: matchPath(
        window.featureFlags['side-nav-update']
          ? '/administration/questionnaire_templates/*'
          : '/settings/questionnaire_templates/*',
        path
      ),
      allowed: permissions.canManageQuestionnaires,
    },
    {
      id: 'assessments',
      title: i18n.t('Assessments'),
      href: '/assessments',
      matchPath: matchPath('/assessments/*', path),
      allowed:
        window.featureFlags['staff-review-area'] &&
        permissions.canViewAssessments,
    },
    {
      id: 'reviews',
      title: i18n.t('Reviews'),
      href: '/reviews',
      matchPath: matchPath('reviews/*', path),
      allowed:
        window.featureFlags['tso-forms-reviews'] &&
        permissions.canViewTSOReviews,
    },
    {
      id: 'growth_and_maturation',
      title: i18n.t('Growth and maturation'),
      href: '/growth_and_maturation',
      matchPath: matchPath('growth_and_maturation/*', path),
      allowed:
        window.getFlag('growth-and-maturation-area') &&
        window.getFlag('performance-optimisation-imports') &&
        (permissions.canViewGrowthAndMaturationImportArea ||
          permissions?.analysis?.growthAndMaturationImportArea?.canView),
    },
    {
      id: 'benchmark_test_validation',
      title: i18n.t('Benchmark validation'),
      href: '/benchmark/test_validation',
      matchPath: matchPath('benchmark/test_validation', path),
      allowed:
        window.getFlag('benchmark-testing-area') &&
        permissions.canViewBenchmarkValidation,
    },
    {
      id: 'league_benchmarking',
      title: i18n.t('League benchmarking'),
      href: '/benchmark/league_benchmarking',
      matchPath: matchPath('benchmark/league_benchmarking', path),
      allowed:
        window.getFlag('benchmark-testing') &&
        window.getFlag('performance-optimisation-imports') &&
        permissions.canViewBenchmarkingTestingImportArea,
    },
    {
      id: 'private_forms',
      title: i18n.t('Private forms'),
      href: '/private_forms',
      icon: 'icon-questionnaire',
      matchPath: matchPath('/private_form/*', path),
      allowed:
        window.featureFlags['tso-private-forms'] &&
        permissions.canViewTSOPrivateForms,
    },
    {
      id: 'data_importer',
      title: i18n.t('Data importer'),
      href: '/data_importer',
      matchPath: matchPath('/data_importer/*', path),
      allowed:
        window.getFlag('training-variables-importer') &&
        permissions.canCreateImports,
    },
    {
      id: 'form_templates',
      title: i18n.t('Form Templates'),
      href: '/forms/form_templates',
      matchPath: matchPath('forms/form_templates', path),
      allowed:
        window.getFlag('view-form-templates-page') &&
        permissions.canManageFormTemplates,
    },
    {
      id: 'completed_form_answer_sets',
      title: i18n.t('Form Responses'),
      href: '/forms/form_answers_sets',
      matchPath: matchPath('forms/form_answers_sets', path),
      allowed:
        window.getFlag('view-completed-forms-page') &&
        permissions.canViewEforms,
    },
    {
      id: 'assigned_athlete_forms',
      title: i18n.t('Assigned Forms'),
      href: '/forms/my_forms',
      matchPath: matchPath('forms/my_forms', path),
      allowed: window.getFlag('cp-forms-athlete-forms-on-web') && isAthlete,
    },
  ];

  return items;
};

export const mediaMenuItems = (path, permissions = []) => {
  const items = [
    {
      id: 'videos',
      title: i18n.t('Videos'),
      href: '/media/videos',
      matchPath: matchPath('/media/videos/*', path),
      allowed:
        window.featureFlags['tso-video-analysis'] &&
        permissions.canViewTSOVideo,
    },
    {
      id: 'documents',
      title: i18n.t('Documents'),
      href: '/media/documents',
      matchPath: matchPath('/media/documents/*', path),
      allowed:
        window.getFlag('tso-document-management') &&
        permissions.canViewTSODocument,
    },
  ];

  return items;
};
