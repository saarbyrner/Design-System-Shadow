// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Validation } from '@kitman/common/src/types';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';

export const isUniqueName = (
  name: string,
  variables: Array<InjuryVariable>
): Validation => {
  const variablesWithSameName = variables.filter(
    (variable) => variable.name.toLowerCase() === name.toLowerCase()
  );
  const isValid = variablesWithSameName.length === 0;

  return {
    isValid,
    errorType: 'unique',
    message: i18n.t('Name already in use'),
  };
};

export const buildSummaryData = (responseData: Object) => {
  return {
    ...responseData,
    decorators: {
      data_labels: false,
    },
    graphType: 'column',
    metrics: [
      {
        ...responseData.metrics[0],
        athlete_ids: [],
        filter_names: null,
        filters: null,
        linked_dashboard_id: null,
        order: 0,
        overlays: [],
        squad_selection: {
          all_squads: false,
          applies_to_squad: true,
          athletes: [],
          position_groups: [],
          positions: [],
          squads: [],
        },
        status: {
          aggregation_method: '',
          event_breakdown: null,
          event_type_time_period: '',
          grouped_with: [],
          localised_unit: '',
          max: null,
          min: null,
          name: i18n.t('Total number of filtered injuries'),
          operator: null,
          period_length: null,
          period_scope: '',
          raw_name: '',
          second_period_all_time: null,
          second_period_length: null,
          selected_games: [],
          selected_training_sessions: [],
          settings: {},
          source_key: '',
          summary: '',
          time_period_length: null,
          type: '',
          variables: [],
        },
        time_period_length: null,
      },
    ],
    time_period: '',
  };
};

export const buildValueData = (responseData: Object) => {
  return {
    ...responseData,
    metrics: [
      {
        ...responseData.metrics[0],
        athlete_ids: [],
        filter_names: {
          event_types: [],
          training_session_types: [],
        },
        filters: {
          event_types: [],
          training_session_types: [],
        },
        linked_dashboard_id: null,
        order: 0,
        overlays: [],
        squad_selection: {
          all_squads: false,
          applies_to_squad: true,
          athletes: [],
          position_groups: [],
          positions: [],
          squads: [],
        },
        status: {
          aggregation_method: '',
          event_breakdown: null,
          event_type_time_period: '',
          localised_unit: '',
          name: '',
          operator: null,
          period_length: null,
          period_scope: '',
          raw_name: '',
          second_period_all_time: null,
          second_period_length: null,
          selected_games: [],
          selected_training_sessions: [],
          source_key: '',
          summary: '',
          time_period_length: null,
          type: '',
          variables: [],
        },
        time_period_length: null,
      },
    ],
    time_period: '',
  };
};
