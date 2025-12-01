// @flow
import { rest } from 'msw';

const handler = rest.get('/ui/initial_data', (req, res, ctx) => {
  return res(
    ctx.json({
      available_squads: '[]',
      current_squad: '{}',
      current_user: {
        athlete: false,
        avatar_url: '',
        firstname: 'Test',
        id: 1,
        lastname: 'User',
        username: 'testuser',
      },
      ip_for_government: false,
      date_format: 'DD/MM/YYYY',
      datepicker_path: null,
      feature_flags: {
        'pm-player-detail-report': true,
      },
      limit_ts_end: '',
      locale_paths: '',
      logo_path_retina: '',
      moment_localization_path: null,
      fullcalendar_localization_path: null,
      organisation_sport: 'rugby',
      organisation_time_zone_offset: 0,
      profiler_static_data: '',
      timezone: 'UTC',
      ts_end: '',
      ts_start: '',
      ts_active: true,
      user_locale: 'en',
      logo_path: '',
      help_path: '',
      org_branding: {
        nickname: '',
        colors: {
          primary: '',
          primary_gradient_1: '',
          primary_gradient_2: '',
          primary_gradient_3: '',
          primary_gradient_4: '',
        },
      },
      organisation_modules: [],
      current_organisation: {
        id: 1,
        name: 'Test Org',
        sport: 'rugby',
        coding_system_key: 'CLINICAL_IMPRESSIONS',
      },
      ga: {
        include_ga: false,
        tracking_id: null,
      },
      sentry: {
        include_sentry: false,
        sentry_secret: '',
      },
      intercom: {
        is_intercom_enabled: false,
        excluded_user: true,
        app_id: '',
        company: {
          id: 1,
          name: 'Test Company',
          created_at: '',
          aws_region: '',
        },
      },
      admin_bar: {
        include_admin_bar: false,
        use_danger_style: false,
        organisation_list: [],
      },
      environment: 'development',
      request_id: '',
      revision: '',
      material_ui_license_key: '',
      launch_darkly_client_side_id: '',
      power_bi_reports: [],
      feature_flag_context: '',
      looker: {
        host: '',
      },
    })
  );
});

export { handler };
