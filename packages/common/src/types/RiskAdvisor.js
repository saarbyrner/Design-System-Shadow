// @flow

/**
 * InjuryVariable started in the riskAdvisor bundle. Moved here as its used in other
 * modules/bundles.
 */
export type InjuryVariable = {
  id: ?string,
  variable_uuid?: string,
  name: string,
  date_range: {
    start_date: string,
    end_date: string,
  },
  filter: {
    position_group_ids: Array<number>,
    exposure_types: Array<'game' | 'training_session'>,
    mechanisms: Array<'contact' | 'non_contact' | 'all'>,
    osics_body_area_ids: Array<string>,
    severity: Array<string>,
  },
  excluded_sources: Array<string>,
  excluded_variables: Array<string>,
  snapshot?: {
    summary: ?Object,
    value: ?Object,
    totalInjuries: ?number,
  },
  enabled_for_prediction: boolean,
  created_by: {
    id: ?number,
    fullname: ?string,
  },
  created_at: ?string,
  archived: boolean,
  alarm_threshold?: number,
  status: 'in_progress' | 'completed' | 'failed' | null,
  last_prediction_status: 'in_progress' | 'triggered' | null,
  is_hidden: boolean,
  pipeline_arn: ?string,
  medical_data_redacted?: boolean,
};
