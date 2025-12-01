import { axios } from '@kitman/common/src/utils/services';
import saveMatchReportScores from '../saveMatchReportScores';

describe('saveMatchReportScores', () => {
  const scoresToSave = {
    eventId: 5,
    homeScore: 10,
    opponentScore: 9,
    homePenaltyScore: 12,
    opponentPenaltyScore: 3,
  };

  describe('success', () => {
    beforeEach(() => jest.spyOn(axios, 'post'));

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call to save the new/updated athlete play times', async () => {
      await saveMatchReportScores(scoresToSave);

      expect(axios.post).toHaveBeenCalledWith(
        '/planning_hub/events/5/set_scores',
        {
          opponent_penalty_shootout_score: 3,
          opponent_score: 9,
          penalty_shootout_score: 12,
          score: 10,
        }
      );
    });
  });
});
