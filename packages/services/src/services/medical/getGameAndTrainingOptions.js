// @flow
import $ from 'jquery';
import type {
  GameEventOption,
  TrainingSessionEventOption,
  OtherEventOption,
} from '@kitman/modules/src/Medical/shared/types';

export type GameAndTrainingOptions = {
  games: Array<GameEventOption>,
  training_sessions: Array<TrainingSessionEventOption>,
  other_events?: Array<OtherEventOption>,
};

const getGameAndTrainingOptions = (
  athleteId: number,
  date: string,
  detailedView: boolean = false,
  strictDateMatch: boolean = false
): Promise<GameAndTrainingOptions> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/athletes/${athleteId}/injuries/game_and_training_options`,
      data: {
        date,
        scope_to_org: true,
        detailed_view: detailedView,
        strict_date_match: strictDateMatch,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getGameAndTrainingOptions;
