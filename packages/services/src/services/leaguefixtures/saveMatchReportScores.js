// @flow
import { axios } from '@kitman/common/src/utils/services';

type Params = {
  eventId: number,
  homeScore: number,
  opponentScore: number,
  homePenaltyScore: number,
  opponentPenaltyScore: number,
};

export default async (params: Params) => {
  const { eventId } = params;

  await axios.post(`/planning_hub/events/${eventId}/set_scores`, {
    score: params.homeScore,
    opponent_score: params.opponentScore,
    penalty_shootout_score: params.homePenaltyScore,
    opponent_penalty_shootout_score: params.opponentPenaltyScore,
  });
};
