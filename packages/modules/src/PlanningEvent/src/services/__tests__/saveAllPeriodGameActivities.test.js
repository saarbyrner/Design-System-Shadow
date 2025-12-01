import { axios } from '@kitman/common/src/utils/services';
import saveAllPeriodGameActivities from '../saveAllPeriodGameActivities';

describe('saveAllPeriodGameActivities', () => {
  let saveRequest;

  const response = [
    { id: 1, absolute_min: 1, kind: 'formation_change' },
    { id: 2, absolute_min: 2, kind: 'yellow_card' },
  ];

  describe('saving the periods activities', () => {
    beforeEach(() => {
      saveRequest = jest
        .spyOn(axios, 'post')

        .mockImplementation(() => {
          return { data: response };
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with the respective periods activities', async () => {
      const returnedData = await saveAllPeriodGameActivities(1, 1, [
        { absolute_min: 1, kind: 'formation_change' },
        { absolute_min: 2, kind: 'yellow_card' },
      ]);
      expect(returnedData).toEqual(response);
      expect(saveRequest).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
        {
          game_activities: [
            { absolute_min: 1, kind: 'formation_change' },
            { absolute_min: 2, kind: 'yellow_card' },
          ],
        }
      );
    });
  });
});
