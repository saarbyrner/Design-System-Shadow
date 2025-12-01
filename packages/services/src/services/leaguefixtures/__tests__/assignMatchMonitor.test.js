import { axios } from '@kitman/common/src/utils/services';
import assignMatchMonitor from '../assignMatchMonitor';

describe('assignMatchMonitor', () => {
  const assignParams = { eventId: 1, matchMonitorIds: [2222, 3333] };

  describe('success', () => {
    beforeEach(() => jest.spyOn(axios, 'post'));

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call to assign the match monitors from the ids', async () => {
      await assignMatchMonitor(assignParams);

      expect(axios.post).toHaveBeenCalledWith(
        `/planning_hub/events/${assignParams.eventId}/game_match_monitors`,
        {
          match_monitor_ids: assignParams.matchMonitorIds,
        }
      );
    });
  });
});
