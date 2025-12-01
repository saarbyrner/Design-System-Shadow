// @flow
import moment from 'moment';
import type { TrainingSession, Game } from '@kitman/common/src/types/Workload';
import { getGameDayPlusMinusInfo } from '@kitman/common/src/utils/workload';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { DropdownItem } from '@kitman/components/src/types';

const formatTrainingSessionDate = (date: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({ date });
  }

  return date.format('MMM D, YYYY');
};

const formatGameDate = (date: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({ date });
  }

  return date.format('D MMM YYYY');
};

export const formatTrainingSessionName = (session: TrainingSession) =>
  `${session.session_type_name} - ${formatTrainingSessionDate(
    moment(session.date, DateFormatter.dateTransferFormat)
  )}`;

export const formatGameName = (game: Game) =>
  `${game.opponent_team_name} (${formatGameDate(
    moment(game.date, DateFormatter.dateTransferFormat)
  )})`;

export const getGamesDropdownItems = (
  games: Array<Game>
): Array<DropdownItem> =>
  games.map((game) => ({
    id: game.id,
    title: formatGameName(game),
  }));

export const getTraininsgSessionDropdownItems = (
  trainingSessions: Array<TrainingSession>
): Array<DropdownItem> =>
  trainingSessions.map((trainingSession) => ({
    id: trainingSession.id,
    title: formatTrainingSessionName(trainingSession),
    description: getGameDayPlusMinusInfo(trainingSession),
  }));

export const getDefaultDateRange = () => {
  const currentDate = moment().format(DateFormatter.dateTransferFormat);
  const oneWeeksAgo = moment()
    .subtract(7, 'days')
    .format(DateFormatter.dateTransferFormat);

  return {
    start_date: oneWeeksAgo,
    end_date: currentDate,
  };
};
