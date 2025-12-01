import { axios } from '@kitman/common/src/utils/services';
import saveEvent from '../saveEvent';

describe('saveEvent', () => {
  let saveGameEventRequest;

  const response = {
    event: {
      id: 1,
      type: 'game event',
      score: 2,
      opponent_score: 4,
      skip_automatic_game_team_email: true,
    },
  };

  describe('patch event', () => {
    beforeEach(() => {
      saveGameEventRequest = jest
        .spyOn(axios, 'patch')

        .mockImplementation(() => {
          return { data: response };
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct patch endpoint with a existing event', async () => {
      const returnedData = await saveEvent({ event: response.event });

      expect(returnedData).toEqual(response.event);
      expect(saveGameEventRequest).toHaveBeenCalledWith(
        '/planning_hub/events/1',
        {
          id: 1,
          opponent_score: 4,
          skip_automatic_game_team_email: true,
          score: 2,
          type: 'game event',
        },
        { params: {} }
      );
    });

    it('calls the correct patch endpoint with a urls params passed in', async () => {
      const returnedData = await saveEvent({
        event: response.event,
        urlFilterParams: { includeDmrLockedTime: true },
      });

      expect(returnedData).toEqual(response.event);
      expect(saveGameEventRequest).toHaveBeenCalledWith(
        '/planning_hub/events/1',
        {
          id: 1,
          opponent_score: 4,
          skip_automatic_game_team_email: true,
          score: 2,
          type: 'game event',
        },
        { params: { include_game_participants_lock_time: true } }
      );
    });
  });

  describe('post event', () => {
    beforeEach(() => {
      saveGameEventRequest = jest
        .spyOn(axios, 'post')

        .mockImplementation(() => {
          return { data: response };
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct post endpoint with a new event', async () => {
      const returnedData = await saveEvent({
        event: {
          type: 'game event',
          score: 2,
          opponent_score: 4,
        },
      });

      expect(returnedData).toEqual(response.event);
      expect(saveGameEventRequest).toHaveBeenCalledWith(
        '/planning_hub/events',
        {
          opponent_score: 4,
          score: 2,
          type: 'game event',
        },
        { params: {} }
      );
    });

    it('calls the correct post endpoint skipping the period creation', async () => {
      const returnedData = await saveEvent({
        event: {
          type: 'game event',
          score: 2,
          opponent_score: 4,
        },
        skipCreatePeriod: true,
      });

      expect(returnedData).toEqual(response.event);
      expect(saveGameEventRequest).toHaveBeenCalledWith(
        '/planning_hub/events?no_period=1',
        { opponent_score: 4, score: 2, type: 'game event' },
        { params: {} }
      );
    });
  });
});
