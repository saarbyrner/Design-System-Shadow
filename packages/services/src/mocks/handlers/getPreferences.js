// @flow
import { rest } from 'msw';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';

const data: PreferenceType = {
  enable_activity_type_category: false,
  coaching_principles: false,
  custom_privacy_policy: false,
  hide_athlete_create_button: false,
  use_custom_terms_of_use_policy: false,
  moved_players_in_organisation_at_event: false,
  optional_workers_comp_claim_policy_number: false,
  automatically_redirect_rehab_copy: false,
  display_duplication_main_event_page: false,
  osha_300_report: false,
  league_game_contacts: false,
  league_game_team: false,
  league_game_team_lock_minutes: false,
  league_game_match_report: false,
  league_game_schedule: false,
  league_game_information: false,
  league_game_team_notifications: false,
  league_game_communications: false,
  league_game_kits: false,
  registration_payments_display: false,
  manage_athlete_game_status: false,
  match_monitor: false,
  viewer_page: false,
  registration_edit_profile: false,
  registration_expire_enabled: false,
  homegrown: false,
  division_squad_selector_enabled: false,
  manage_league_game: false,
  league_game_officials: false,
  league_game_match_director: false,
  league_game_tv: false,
  league_game_game_time: false,
  league_game_match_id: false,
  access_request_limitations: false,
  schedule_page_refresh_interval_seconds: 0,
};

const handler = rest.post('/organisation_preferences/fetch', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
