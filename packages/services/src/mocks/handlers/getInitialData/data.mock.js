import { data as organisationData } from '../getOrganisation';

export default {
  user_locale: 'en-US',
  locale_paths:
    '{"en_translation":"/i18n/en/translation.json","en_rugby_union":null,"en-AU_translation":"/i18n/en-AU/translation.json","en-AU_rugby_union":null,"en-GB_translation":"/i18n/en-GB/translation.json","en-GB_rugby_union":null,"en-IE_translation":"/i18n/en-IE/translation.json","en-IE_rugby_union":null,"en-NZ_translation":"/i18n/en-NZ/translation.json","en-NZ_rugby_union":null,"en-US_translation":"/i18n/en-US/translation.json","en-US_rugby_union":null,"fr_translation":"/i18n/fr/translation.json","fr_rugby_union":null,"it_translation":"/i18n/it/translation.json","it_rugby_union":null,"de_translation":"/i18n/de/translation.json","de_rugby_union":null,"es_translation":"/i18n/es/translation.json","es_rugby_union":null,"zh-TW_translation":"/i18n/zh-TW/translation.json","zh-TW_rugby_union":null,"ja_translation":"/i18n/ja/translation.json","ja_rugby_union":null,"pt-BR_translation":"/i18n/pt-BR/translation.json","pt-BR_rugby_union":null,"pl_translation":"/i18n/pl/translation.json","pl_rugby_union":null,"nl_translation":"/i18n/nl/translation.json","nl_rugby_union":null}',
  feature_flags:
    '{"Chat-Channel-Creation":true,"absence-management":true,"acute-chronic-inidividual":true,"add-attachment-via-link":true,"add-diagnostics-from-availability-sheet":true,"add-new-events":true,"admin-manage-fixtures-visibility":true,"age-of-athlete-available-as-data-source":true,"alerts-add-edit-delete":true,"alerts-area":true,"alerts-numeric-metric":true,"all-squads-mean":true,"analysis-alarm-analysis":true,"apple-health-kit":true,"assessment-who-answered":true,"assessments-grid-view":true,"assessments-multiple-athletes":true,"athlete-analysis-rpe":true,"athlete-api-medinah-api":true,"athlete-app-calendar":true,"athlete-calendar-display-treatments-rehab":true,"athlete-forms-list":true,"athlete-insurance-details":true,"athlete-insurance-details-attachments":true,"athlete-name-display-settings":true,"athlete-report-section":true,"availability-performance-enhancement":true,"availability-status-filter":true,"background-screens-nfl-combine":true,"begin-screening-toggle":true,"best-worst-removal-for-athlete-kiosk":true,"calendar-duplicate-event":true,"calendar-hide-all-day-slot":true,"calendar-nfl-fields":true,"calendar-web-drag-n-drop":true,"chat-athlete":true,"chat-athlete-avatars":true,"chat-attachments":true,"chat-channel-management":true,"chat-channel-search":true,"chat-channel-settings":true,"chat-coach":true,"chat-conversations-api":true,"chat-dms":true,"chat-show-public-channels":true,"chat-web":true,"check-pwned-passwords":true,"clock-configuration-organisation-settings":true,"coach-app-calendar":true,"collections-side-panel":true,"concussion-add-on-parent":true,"concussion-assessment-kiosk":true,"concussion-incident-form-kiosk":true,"concussion-incident-form-web":true,"concussion-medical-area":true,"conditional-fields-parent":true,"conditional-fields-showing-in-ip":true,"console-medinah-api":true,"course-complete-date":true,"covid-19-medical-diagnostic":true,"custom-pathologies":true,"custom-privacy-policy":true,"datapoints-db-benchmark":true,"datapoints-db-reader":true,"datapoints-db-writer":true,"date-picker-tz-fix":true,"disable-google-drive-notifications":true,"display-top-influencing-factors-on-injury-risk-metric":true,"documentdb-datapoints-db":true,"dominant-foot-and-hand":true,"drill-integration-catapult":true,"drill-integration-statsports":true,"duplicate-across-squads":true,"duplicate-alerts":true,"duplicate-event":true,"duplicate-treatment":true,"elastic-search-chart-data":true,"elastic-search-event-query":true,"elastic-search-metrics":true,"elastic-search-movement-data":true,"elastic-search-sparkline":true,"elastic-search-statuses":true,"elastic-search-summarised-metric-cache":true,"elasticsearch-parallel-metrics-query":true,"email-updates":true,"emr-multiple-coding-systems":true,"emr-orders":true,"emr-orders-reconciliation":true,"enable-widgets":true,"evaluation-note":true,"event-collection-show-sports-specific-workload-units":true,"event-collections-sidekiq-synchronous-group-assessment-creating":true,"examination-date":true,"export-page": true,"export-insurance-details":true,"favourite-metrics":true,"favourite-treatments-rehab-sessions":true,"fenway-medinah-api":true,"fenway-performance-metric-dashboard":true,"fitbit-integration":true,"fitbit_integration_le_mans":true,"forms-coach-notification":true,"forms-scheduling":true,"full-participation-by-default-on-creation-of-sessions":true,"game-ts-assessment-area":true,"graph-pipeline-migration":true,"graph-pipeline-migration-pie":true,"graph-pipeline-migration-stack-bar":true,"graph-pipeline-migration-summary_bar":true,"graph-pipeline-migration-summary_donut":true,"graph-pipeline-migration-summary_stack_bar":true,"graph-pipeline-migration-value":true,"graph-pipeline-migration-value_visualisation":true,"graph-sorting":true,"graph-squad-selector":true,"graphing-diagnostics-interventions":true,"graphing-offset-calc":true,"hide-intercom":true,"hide-null-values":true,"hide-pivot-graphing-dashboard":true,"homepage-availability-sheet":true,"homepage-medical-area":true,"include-bamic-on-injury":true,"injury-game-period":true,"injury-illness-meatball":true,"injury-illness-name":true,"injury-risk-metrics-CF-page-date-athlete-selection":true,"injury-risk-metrics-contributing-factors":true,"injury-risk-metrics-including-athlete-medical-history-data":true,"injury-risk-metrics-including-combination-variable-data":true,"injury-risk-metrics-risk-advisor":true,"injury-risk-metrics-risk-advisor-risk-level-band-updates":true,"injury-upload-button":true,"integrations-area-on-athlete":true,"integrations-tab-organisation-settings":true,"intercom-bubble-show":true,"ip-login-branding":true,"issue-collapsable-reorder":true,"ivy-chronos":true,"ivy-training-session-importing":true,"kiosk-bluetooth-scales":true,"kiosk-custom-rpe-input":true,"kiosk-large-squad-selector":true,"last-x-events-enhancement":true,"le-mans-completed-questionnaire-workers":true,"legacy-alerts-callout-for-athlete-section":true,"manage-athletes-pagination":true,"manage-questionnaire-spa":true,"mass-import-athletes":true,"mass-input-of-questions-toggle":true,"mass-input-toggle-rpe":true,"medical-alerts-side-panel":true,"medical-diagnostics-iteration-2-reason":true,"medical-forms-tab-iteration-1":true,"medical-module-parent":true,"medical-notes-template-and-tab":true,"medical-notes-upgrade-parent":true,"medical-view-dashboards":true,"metric-activity-type-filter":true,"metric-dashboard-options":true,"metric-dashboard-summary-row":true,"metric-session-breakdown-filter":true,"metric-session-filter":true,"missing-games-ts-availability-report":true,"mls-emr-action-due-date":true,"mls-emr-action-reminders":true,"mls-emr-advanced-options":true,"mls-emr-documents-area":true,"mls-emr-froi-pdf":true,"mls-emr-injury-analysis":true,"mls-emr-psych-notes":true,"mls-emr-show-icd-code":true,"mobile-calendar":true,"mysql-datapoints-db":true,"neutral-colour-scales-kiosk":true,"nfl-player-movement-trade":true,"note-templates":true,"notes-react-refactor":true,"notes-widget-date-pivot":true,"org-level-treatments":true,"organisation-settings-terminology-updates":true,"percentage-alarms-metric-dashboards":true,"performance-athletes-serializer":true,"planning-dual-write":true,"planning-fenway-events-dual-reading":true,"planning-game-events-tab-v-2":true,"planning-library-templates":true,"planning-rpe-scheduled-notifications":true,"planning-session-planning":true,"planning-show-event-title-in-creation-and-edit":true,"planning-toggle-to-other-planning-views":true,"preferred-names":true,"preliminary-injury-illness":true,"primary-squad-selection":true,"print-mode":true,"print-treatment-rehab-modals":true,"quality-report-exports":true,"questionnaire-multi-rep":true,"questionnaire-template-custom-questions":true,"react-manage-staff-athlete":true,"react-web-calendar":true,"rehab-tracker":true,"repeat-reminders":true,"reporting-future-dates":true,"rich-text-editor":true,"risk-advisor-filter-sources-on-analytics-column":true,"risk-level-zones-on-top-influencing-factors":true,"rpe-0-12-w-fractions":true,"rpe-0-12-w-fractions-game":true,"scales-colours":true,"schedule-rehab":true,"schedule-treatments":true,"screening-pass":true,"session-planning-download-sharing":true,"session-planning-tab-adding-drills-to-activites":true,"sessions-session-planning-tab":true,"show-graphs-tab-on-sessions":true,"side-nav-update":true,"single-athlete-population-dropdown":true,"single-row-per-athlete-athlete-reports":true,"squad-numbers":true,"squad-selector-kiosk":true,"staff-avatars":true,"staff-phone-number":true,"staff-profile-react":true,"staff-review-area":true,"standard-date-formatting":true,"summary-multi-date-ranges":true,"table-column-widths":true,"table-export-csv":true,"table-updated-pivot":true,"table-widget":true,"table-widget-activity-source":true,"table-widget-availability-data-type":true,"table-widget-comparison-multiselect":true,"table-widget-complex-calculations":true,"table-widget-creation-sidepanel-ui":true,"table-widget-duplicate-column":true,"table-widget-last-x-events":true,"table-widget-medical-data-type":true,"table-widget-participation-data-type":true,"table-widget-ranking":true,"tb-parallelisation":true,"test":true,"timezone-form-scheduling":true,"training-efficiency-index":true,"treatment-and-rehab-templates":true,"treatment-on-view-issue":true,"treatment-tracker-iteration-two":true,"treatment-view-modal":true,"treatments-billing":true,"treatments-multi-modality":true,"tso-athlete-id":true,"tso-emr-sync":true,"two-factor-authentication":true,"update-manage-forms":true,"update-time-picker":true,"updated-count-calculation":true,"updated-spider-z-score-formula":true,"use_alarms_from_fenway":true,"view-modality-notes":true,"warning-answer":true,"web-calendar-athlete-filter":true,"web-calendar-corrected-date-headings":true,"web-home-page":true}',
  organisation_time_zone_offset: 60,
  organisation_sport: 'rugby_union',
  logo_path:
    'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?ixlib=rails-4.2.0\u0026fit=fill\u0026trim=off\u0026bg=00FFFFFF\u0026w=32\u0026h=32',
  logo_path_retina:
    'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?ixlib=rails-4.2.0\u0026fit=fill\u0026trim=off\u0026bg=00FFFFFF\u0026w=100\u0026h=100',
  current_user: {
    id: 45232125,
    username: 'jDoe',
    firstname: 'John',
    lastname: 'Doe',
    athlete: false,
    avatar_url: null,
  },
  available_squads:
    '[{"id":2731,"name":"1st team","duration":null,"is_default":null,"created_by":null,"created":"2022-03-21T17:19:56.000+00:00","updated":"2022-03-21T17:19:56.000+00:00","sport_id":null},{"id":73,"name":"Academy Squad","duration":80,"is_default":null,"created_by":null,"created":"2015-09-07T13:29:54.000+01:00","updated":"2015-09-07T13:29:54.000+01:00","sport_id":null},{"id":2732,"name":"Academy team","duration":null,"is_default":null,"created_by":null,"created":"2022-03-21T17:19:56.000+00:00","updated":"2022-03-21T17:19:56.000+00:00","sport_id":null},{"id":8,"name":"International Squad","duration":80,"is_default":null,"created_by":null,"created":"2013-10-17T16:10:14.000+01:00","updated":null,"sport_id":null},{"id":1374,"name":"Player view","duration":null,"is_default":null,"created_by":null,"created":"2019-10-17T13:23:51.000+01:00","updated":"2019-10-17T13:23:51.000+01:00","sport_id":null},{"id":2431,"name":"team_1","duration":null,"is_default":null,"created_by":null,"created":"2021-12-07T11:41:45.000+00:00","updated":"2021-12-07T11:41:45.000+00:00","sport_id":null},{"id":2432,"name":"team_2","duration":null,"is_default":null,"created_by":null,"created":"2021-12-07T11:41:45.000+00:00","updated":"2021-12-07T11:41:45.000+00:00","sport_id":null},{"id":1038,"name":"Technical Director","duration":null,"is_default":null,"created_by":null,"created":"2018-10-16T10:16:12.000+01:00","updated":"2022-03-25T15:41:46.000+00:00","sport_id":null},{"id":262,"name":"Test","duration":null,"is_default":null,"created_by":null,"created":"2016-04-22T21:56:44.000+01:00","updated":"2019-07-03T12:06:18.000+01:00","sport_id":null}]',
  current_squad:
    '{"id":8,"name":"International Squad","duration":80,"is_default":null,"created_by":null,"created":"2013-10-17T16:10:14.000+01:00","updated":null,"sport_id":null}',
  ts_start: '2022-07-17T23:00:00Z',
  ts_end: '2022-08-29T22:59:59Z',
  ts_active: true,
  limit_ts_end: '2014-06-14',
  date_format: 'dd-mm-yyyy',
  timezone: 'Europe/Dublin',
  moment_localization_path: null,
  fullcalendar_localization_path: null,
  datepicker_path: null,
  help_path:
    '/help?url=http%3A%2F%2Fadmin.injuryprofiler.test%3A8081%2Fui%2Finitial_data',
  organisation_modules: [
    'alerts',
    'analysis',
    'assessments',
    'athlete-app',
    'athlete-screening',
    'capture',
    'coach',
    'concussion',
    'development-goals',
    'general',
    'homepage',
    'kiosk',
    'medical',
    'messaging',
    'notes',
    'risk-advisor',
    'settings',
    'super-admin',
    'workloads',
  ],
  org_branding: null,
  current_organisation: organisationData,
  ga: {
    include_ga: false,
    tracking_id: null,
  },
  sentry: {
    include_sentry: false,
    sentry_secret: null,
  },
  intercom: {
    is_intercom_enabled: false,
    excluded_user: false,
    app_id: '111',
    company: {
      id: 1,
      name: 'Kitman Rugby Club',
      created_at: '2022-08-29T22:59:59Z',
      aws_region: 'EU',
    },
  },
  admin_bar: {
    include_admin_bar: true,
    use_danger_style: false,
    organisation_list: [
      {
        label: 'Demo Accounts',
        options: [],
      },
      {
        label: 'Internal Accounts',
        options: [
          {
            value: 1,
            label: 'Kitman Rugby Club',
          },
          {
            value: 116,
            label: 'KL Earthquakes',
          },
        ],
      },
    ],
  },
  environment: 'development',
  request_id: '1234',
  revision: '5678',
  material_ui_license_key: '1234567890',
};
