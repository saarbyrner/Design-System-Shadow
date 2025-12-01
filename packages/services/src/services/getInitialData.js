// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Options } from '@kitman/components/src/Select';
import type {
  RegistrationDetails,
  UserType,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/types';
import type { Organisation } from './getOrganisation';

export type InitialData = {
  available_squads: string,
  current_squad: string,
  current_user: {
    athlete: boolean,
    avatar_url: string,
    firstname: string,
    id: number,
    lastname: string,
    username: string,
    registration?: {
      user_type: UserType,
    },
    type?: 'Official',
  },
  ip_for_government: boolean,
  date_format: string,
  datepicker_path: ?string,
  feature_flags: any,
  limit_ts_end: string,
  locale_paths: string,
  logo_path_retina: string,
  moment_localization_path: ?string,
  fullcalendar_localization_path: ?string,
  organisation_sport: string,
  organisation_time_zone_offset: number,
  profiler_static_data: string,
  timezone: string,
  ts_end: string,
  ts_start: string,
  ts_active: boolean,
  user_locale: string,
  logo_path: string,
  help_path: string,
  org_branding: {
    nickname: string,
    colors: {
      primary: string,
      primary_gradient_1: string,
      primary_gradient_2: string,
      primary_gradient_3: string,
      primary_gradient_4: string,
    },
  },
  organisation_modules: Array<string>,
  current_organisation: Organisation,
  ga: {
    include_ga: boolean,
    tracking_id: ?string,
  },
  sentry: {
    include_sentry: boolean,
    sentry_secret: string,
  },
  intercom: {
    is_intercom_enabled: boolean,
    excluded_user: boolean,
    app_id: string,
    company: {
      id: number,
      name: string,
      created_at: string,
      aws_region: string,
    },
  },
  admin_bar: {
    include_admin_bar: boolean,
    use_danger_style: boolean,
    organisation_list: Options,
  },
  environment: string,
  request_id: string,
  revision: string,
  registration?: RegistrationDetails,
  material_ui_license_key: string,
  launch_darkly_client_side_id: string,
  power_bi_reports: Array<{ id: number, name: string }>,
  /**
   * feature_flag_context
   * {
   *   key: number,
   *   name: string,
   *   anonymous: boolean,
   *   custom: {
   *     organisation: string,
   *     organisation_created_date: string,
   *     sport: string,
   *     locale: string,
   *     user_type: string,
   *     internal_organisation: boolean,
   *     demo_organisation: boolean,
   *     template_organisation: boolean,
   *     timezone: string,
   *     region: string,
   *   },
   * }
   */
  feature_flag_context: string,
  looker: {
    host: string,
  },
};

export const INITIAL_DATA_URL = '/ui/initial_data';

/*
 * Warning: Do not add data to this endpoint. We are planning to remove it once the application is an SPA.
 * We do not have direct access to the global variables in the single page application, we need to use this endpoint to request them instead.
 * We plan to revisit the way we are getting the initial data once the transition to an SPA is complete.
 */
const getInitialData = async (): Promise<InitialData> => {
  const { data } = await axios.get(INITIAL_DATA_URL);
  return data;
};

export default getInitialData;
