import { axios } from '@kitman/common/src/utils/services';
import updateEventPeriods from '..';

describe('updateEventPeriods', () => {
  let updateEventPeriodsRequest;

  const response = [
    {
      id: 1,
      name: 'Period 1',
      duration: 40,
    },
  ];

  describe('update api call', () => {
    beforeEach(() => {
      updateEventPeriodsRequest = jest
        .spyOn(axios, 'post')

        .mockImplementation(() => {
          return { data: response };
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct patch endpoint with a existing event', async () => {
      const returnedData = await updateEventPeriods(
        [{ ...response[0], localId: 5 }],
        20
      );

      expect(returnedData).toEqual(response);
      expect(updateEventPeriodsRequest).toHaveBeenCalledWith(
        `/ui/planning_hub/events/20/game_periods/bulk_save`,
        { game_periods: [{ ...response[0], localId: 5 }] }
      );
    });
  });
});
