// @flow
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { compact } from 'lodash';
import type { GameFieldEvent } from './GameFieldsV2';

type extractDataBasedOnGameKeyType = {
  fasGameOpposition: any | null,
  fasGameVenue: any | null,
  hasGameKey: boolean,
  isMLS: boolean,
};

export const extractDataBasedOnGameKey = (
  event: GameFieldEvent
): extractDataBasedOnGameKeyType => {
  const hasGameKey = Boolean(event?.fas_game_key || event?.mls_game_key);
  const fasGameOpposition =
    event?.opponent_squad || event?.opponent_team
      ? defaultMapToOptions([event.opponent_squad || event.opponent_team])
      : null;
  const fasGameVenue = event?.venue_type
    ? defaultMapToOptions([event.venue_type])
    : null;

  return {
    hasGameKey,
    fasGameOpposition,
    fasGameVenue,
    isMLS: Boolean(event?.mls_game_key),
  };
};

export const setOpponentName = (opponent: Object = {}) => {
  const tmpOpponent = { ...opponent };

  tmpOpponent.name = compact([tmpOpponent.name, tmpOpponent.owner_name]).join(
    ' '
  );

  return tmpOpponent;
};

export const getFeedOppositionOptions = (
  event: GameFieldEvent,
  extractFasGameDataTypes: extractDataBasedOnGameKeyType
) => {
  const isGameKey = extractFasGameDataTypes?.hasGameKey;
  const hasOpponentSquad = event?.opponent_squad;
  const hasOpponentTeam = event?.opponent_team;

  let opponentData = isGameKey ? hasOpponentSquad || hasOpponentTeam : null;

  if (opponentData) {
    opponentData = setOpponentName(opponentData);
  }

  return opponentData ? defaultMapToOptions([opponentData]) : null;
};

export const getFormatValue = (formatName: string, formats: []) => {
  const requiredFormat = formats.find((format) => format.label === formatName);
  return requiredFormat ? requiredFormat.value : null;
};
