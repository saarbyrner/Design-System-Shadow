// @flow
export type ExportType =
  | 'treatment_billing'
  | 'diagnostic_billing'
  | 'exposure_quality_check'
  | 'diagnostics_report'
  | 'null_data_report'
  | 'medication_records'
  | 'hap_authorization_status'
  | 'concussion_baseline_audit'
  | 'participant_exposure'
  | 'hap_covid_branch'
  | 'athlete_medical_export'
  | 'nfl_player_detail_report'
  | 'multi_document'
  | 'governance_export'
  | 'match_report_export'
  | 'match_monitor_report_export'
  | 'mls_athlete_cards_export'
  | 'mls_staff_cards_export'
  | 'injury_detail_export'
  | 'injury_medication_export'
  | 'time_loss_all_activity_export'
  | 'injury_report_export'
  | 'bulk_injury_medication_report_export'
  | 'registration_players_export'
  | 'registration_staff_export'
  | 'bulk_athlete_medical_export'
  | 'medications_report_export'
  | 'osha_report_export'
  | 'homegrown_plus_9'
  | 'homegrown_45'
  | 'homegrown_post_formation'
  | 'homegrown_export'
  | 'injuries_summary_export'
  | 'issue_summary'
  | 'red_cards_export'
  | 'yellow_cards_export'
  | 'scout_access_export'
  | 'scout_attendee_export'
  | 'payment_export';

export type ExportsItem = {
  id: number,
  name: string,
  status: 'pending' | 'running' | 'completed' | 'errored' | 'expired',
  export_type: ExportType,
  attachments: Array<{
    filename: string,
    filesize: number,
    filetype: string,
    id: number,
    url: string,
  }>,
  created_at: string,
};

export type ExportsResponse = {
  meta: {
    current_page: number,
    next_page: ?number,
    prev_page: ?number,
    total_count: number,
    total_pages: number,
  },
  data: Array<ExportsItem>,
};
