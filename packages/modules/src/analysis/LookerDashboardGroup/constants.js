// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const BASE_URL = '/report';

export const EMPTY_GROUP = {
  dashboards: [],
};

export const STATUS = Object.freeze({
  LOADING: 'loading',
  DONE: 'done',
  CONNECTION_ERROR: 'connection_error',
  ERROR_LOADING_DASHBOARD: 'error_loading_dashboard',
});

export const EMPTY_DASHBOARD = i18n.t('There are no dashboards in this group');
export const CONNECTION_ERROR = i18n.t(
  'There was an error loading the dashboard'
);
