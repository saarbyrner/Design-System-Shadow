// @flow

import _range from 'lodash/range';
import type { MultiSelectDropdownItems } from '@kitman/components/src/types';
import type { TrainingSession } from '@kitman/common/src/types/Workload';
import type { Event, Game } from '@kitman/common/src/types/Event';
import i18n from '@kitman/common/src/utils/i18n';
import _isNull from 'lodash/isNull';
import moment from 'moment';

export const getGameDayPlusMinusInfo = (session: TrainingSession) => {
  if (session?.game_day_plus || session?.game_day_minus) {
    let gameDayPlusMinusInfo = '(';
    if (session.game_day_plus) {
      gameDayPlusMinusInfo += `+${session.game_day_plus}`;
    }
    if (session.game_day_plus && session.game_day_minus) {
      gameDayPlusMinusInfo += `, `;
    }
    if (session.game_day_minus) {
      gameDayPlusMinusInfo += `-${session.game_day_minus}`;
    }
    gameDayPlusMinusInfo += `)`;
    return gameDayPlusMinusInfo;
  }

  return '';
};

export const gameDaysOptions = (): MultiSelectDropdownItems =>
  _range(7, -8).map((gameDay) => ({
    id: gameDay > 0 ? `+${gameDay}` : `${gameDay}`,
    name: gameDay > 0 ? `+${gameDay}` : `${gameDay}`,
  }));

export const getOrgTeamName = ({
  squadName,
  organisationTeamName,
  organisationOwnerName,
  isLeague,
}: {
  squadName: string,
  organisationTeamName: string,
  organisationOwnerName: string,
  isLeague: boolean,
}): string => {
  if (isLeague) {
    return squadName
      ? `${squadName} ${organisationOwnerName}`
      : organisationTeamName;
  }
  return organisationTeamName || squadName;
};

export const getOpponentName = ({
  opponent_squad: opponentSquad,
  opponent_team: opponentTeam,
}: Game): string => {
  return opponentSquad?.name
    ? `${opponentSquad?.name} ${opponentSquad?.owner_name}`
    : // opponent_team and opponent_squad are mutually exclusive, but one must
      // exist, therefore ?? '' is just for Flow
      opponentTeam?.name ?? '';
};

export const getEventName = (event: Event): string => {
  switch (event.type) {
    case 'session_event': {
      const eventStartDate = `(${moment(event.start_date).format(
        'MMM D, YYYY'
      )})`;
      let name = event.theme?.name;
      if (event.name) name = event.name;
      const typeAndDate = `${event.session_type.name ?? ''} ${eventStartDate}`;
      return name ? `${name} — ${typeAndDate}` : typeAndDate;
    }
    case 'game_event': {
      const opponentName = getOpponentName(event);
      const gameName = `${opponentName} (${event.venue_type.name}), ${event.competition.name}`;
      const gameScore =
        !_isNull(event.score) && !_isNull(event.opponent_score)
          ? `(${event.score}-${event.opponent_score})`
          : '';
      return `${gameName} ${gameScore}`;
    }
    default:
      return event.name ?? '';
  }
};

export const formatGameDayPlusMinus = (event: Event) => {
  if (event.type !== 'session_event') {
    return null;
  }

  if (event.game_day_plus && event.game_day_minus) {
    return `+${event.game_day_plus}, -${event.game_day_minus}`;
  }

  if (event.game_day_plus) {
    return `+${event.game_day_plus}`;
  }

  if (event.game_day_minus) {
    return `-${event.game_day_minus}`;
  }

  return null;
};

export const getAvailabilityList = () => [
  { id: 'available', name: i18n.t('Available') },
  { id: 'injured', name: i18n.t('Available (Injured/Ill)') },
  {
    id: 'returning',
    name: i18n.t('Available (Returning from injury/illness)'),
  },
  { id: 'unavailable', name: i18n.t('Unavailable') },
];

export const getIssueList = () => [
  { id: 'open_issues', name: i18n.t('Open injury/illness') },
  { id: 'no_open_issues', name: i18n.t('No Open Injury/illness') },
];
