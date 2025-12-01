// @flow
import type { PreferenceKey } from './types';

const NUMERIC_PREFERENCES: Array<PreferenceKey> = [
  'schedule_page_refresh_interval_seconds',
];

const BOOLEAN_PREFERENCES: Array<PreferenceKey> = [
  'coaching_principles',
  'custom_privacy_policy',
  'enable_activity_type_category',
  'hide_athlete_create_button',
  'moved_players_in_organisation_at_event',
  'use_custom_terms_of_use_policy',
  'optional_workers_comp_claim_policy_number',
  'automatically_redirect_rehab_copy',
  'display_duplication_main_event_page',
  'osha_300_report',
  'league_game_contacts',
  'league_game_team',
  'league_game_team_lock_minutes',
  'league_game_match_report',
  'league_game_schedule',
  'league_game_information',
  'league_game_team_notifications',
  'league_game_communications',
  'league_game_kits',
  'match_monitor',
  'viewer_page',
  'registration_payments_display',
  'manage_athlete_game_status',
  'registration_edit_profile',
  'registration_expire_enabled',
  'homegrown',
  'division_squad_selector_enabled',
  'manage_league_game',
  'league_game_officials',
  'league_game_match_director',
  'league_game_tv',
  'league_game_game_time',
  'league_game_match_id',
  'league_game_notification_recipient',
  'league_game_hide_club_game',
  'access_request_limitations',
  'scout_access_management',
  'enable_reserve_ar',
  'league_game_match_day',
  'league_schedule_hide_inactive_competitions',
  'league_match_report_pitch_view',
  'league_match_report_penalty_shootout',
  'league_game_forms_tab',
];

const ALL_PREFERENCES = [...BOOLEAN_PREFERENCES, ...NUMERIC_PREFERENCES];

export default ALL_PREFERENCES;
export { NUMERIC_PREFERENCES, BOOLEAN_PREFERENCES };
