// @flow
import moment from 'moment-timezone';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Game } from '@kitman/common/src/types/Event';
import i18n from '@kitman/common/src/utils/i18n';
import styles from './styles';

export const teamLogoPathFallback =
  'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_285993?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=100&h=100';

export const getFormattedScore = (game: Game) => {
  if (game.score === null && game.opponent_score === null) {
    return '-';
  }
  return `${game.score || 0} : ${game.opponent_score || 0}`;
};

export const getAwayTeam = (opponent: Object) => {
  return {
    id: opponent?.id || '',
    name: opponent?.name || '',
    logo_full_path: opponent?.logo_full_path,
  };
};

export const formatDate = (date: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({ date });
  }

  return date.format('D MMM, ddd');
};

export const formatTime = (date: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatJustTime(date);
  }

  return date.format('h:mm a');
};

export const getFormattedStartDate = (game: Game) => {
  const localTimezoneStartDate = formatDate(
    moment.tz(game.start_date, game.local_timezone)
  );
  return localTimezoneStartDate;
};

export const getFormattedStartTime = (game: Game) => {
  const localTimezoneStartTime = formatTime(
    moment.tz(game.start_date, game.local_timezone)
  );
  return `${localTimezoneStartTime} (${game.local_timezone})`;
};

export const getDefaultDateRange = () => ({
  start_date: moment()
    .subtract(10, 'days')
    .format(DateFormatter.dateTransferFormat),
  end_date: moment()
    .endOf('day')
    .add(10, 'days')
    .format(DateFormatter.dateTransferFormat),
});

export const menuButtonTypes = {
  unlock: 'UNLOCK',
  reset: 'RESET',
  withdraw: 'WITHDRAW',
};

export const status = {
  LOADED: 'LOADED',
  FULLY_LOADED: 'FULLY_LOADED',
  LOADING: 'LOADING',
  FAILURE: 'FAILURE',
};

export const fixtureReports = {
  matchReport: 'MATCH_REPORT',
  matchMonitorReport: 'MATCH_MONITOR_REPORT',
  scoutAccessManagement: 'SCOUT_ACCESS_MANAGEMENT',
};
export const gameStatuses = {
  awaiting_officials: {
    value: 'awaiting_officials',
    label: i18n.t('Awaiting officials'),
    style: styles.yellow,
  },
  awaiting_rosters: {
    value: 'awaiting_rosters',
    label: i18n.t('Awaiting rosters'),
    style: styles.yellow,
  },
  match_report_submitted_by_id: {
    value: 'match_report_submitted_by_id',
    label: i18n.t('Report submitted'),
    style: styles.green,
  },
  roster_available: {
    value: 'roster_available',
    label: i18n.t('Rosters available'),
    style: styles.green,
  },
  awaiting_report: {
    value: 'awaiting_report',
    label: i18n.t('Awaiting report'),
    style: styles.yellow,
  },
  disciplinary_issue: {
    value: 'disciplinary_issue',
    label: i18n.t('Disciplinary issue'),
    style: styles.red,
  },
  report_available: {
    value: 'report_available',
    label: i18n.t('Report available'),
    style: styles.green,
  },
  awaiting_monitor_report: {
    value: 'awaiting_monitor_report',
    label: i18n.t('Awaiting monitor report'),
    style: styles.blue,
  },
  awaiting_monitors: {
    value: 'awaiting_monitors',
    label: i18n.t('Awaiting monitors'),
    style: styles.yellow,
  },
  monitor_issue: {
    value: 'monitor_issue',
    label: i18n.t('Monitor issue'),
    style: styles.red,
  },
  monitor_report_available: {
    value: 'monitor_report_available',
    label: i18n.t('Monitor report available'),
    style: styles.green,
  },
};

export const getGameStatusData = (gameStatus?: string) => {
  switch (gameStatus) {
    case gameStatuses.awaiting_officials.value:
      return {
        name: gameStatuses.awaiting_officials.label,
        style: gameStatuses.awaiting_officials.style,
      };
    case gameStatuses.awaiting_rosters.value:
      return {
        name: gameStatuses.awaiting_rosters.label,
        style: gameStatuses.awaiting_rosters.style,
      };
    case gameStatuses.match_report_submitted_by_id.value:
      return {
        name: gameStatuses.match_report_submitted_by_id.label,
        style: gameStatuses.match_report_submitted_by_id.style,
      };
    case gameStatuses.roster_available.value:
      return {
        name: gameStatuses.roster_available.label,
        style: gameStatuses.roster_available.style,
      };
    case gameStatuses.awaiting_report.value:
      return {
        name: gameStatuses.awaiting_report.label,
        style: gameStatuses.awaiting_report.style,
      };
    case gameStatuses.disciplinary_issue.value:
      return {
        name: gameStatuses.disciplinary_issue.label,
        style: gameStatuses.disciplinary_issue.style,
      };
    case gameStatuses.report_available.value:
      return {
        name: gameStatuses.report_available.label,
        style: gameStatuses.report_available.style,
      };
    case gameStatuses.awaiting_monitors.value:
      return {
        name: gameStatuses.awaiting_monitors.label,
        style: gameStatuses.awaiting_monitors.style,
      };
    case gameStatuses.awaiting_monitor_report.value:
      return {
        name: gameStatuses.awaiting_monitor_report.label,
        style: gameStatuses.awaiting_monitor_report.style,
      };
    case gameStatuses.monitor_issue.value:
      return {
        name: gameStatuses.monitor_issue.label,
        style: gameStatuses.monitor_issue.style,
      };
    case gameStatuses.monitor_report_available.value:
      return {
        name: gameStatuses.monitor_report_available.label,
        style: gameStatuses.monitor_report_available.style,
      };
    default:
      return null;
  }
};
