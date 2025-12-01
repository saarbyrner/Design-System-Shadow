// @flow
import { EVENT_TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import i18n from '@kitman/common/src/utils/i18n';

export const lastXEventsOptions = [
  EVENT_TIME_PERIODS.lastXGames,
  EVENT_TIME_PERIODS.lastXSessions,
  EVENT_TIME_PERIODS.lastXGamesAndSessions,
];

export const getLabelsMap = () => ({
  [EVENT_TIME_PERIODS.lastXEvents]: i18n.t('Events'),
  [EVENT_TIME_PERIODS.lastXGames]: i18n.t('Games'),
  [EVENT_TIME_PERIODS.lastXSessions]: i18n.t('Sessions'),
  [EVENT_TIME_PERIODS.lastXGamesAndSessions]: i18n.t('Games/Sessions'),
});

export const eventTypesMap = {
  [EVENT_TIME_PERIODS.lastXGamesAndSessions]: ['game', 'training_session'],
  [EVENT_TIME_PERIODS.lastXGames]: ['game'],
  [EVENT_TIME_PERIODS.lastXSessions]: ['training_session'],
};
