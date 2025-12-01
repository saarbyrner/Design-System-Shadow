import { axios } from '@kitman/common/src/utils/services';
import getEventsUpdates from '../getEventsUpdates';

describe('getEventsUpdates service', () => {
  let postMock;

  beforeEach(() => {
    postMock = jest.spyOn(axios, 'post').mockResolvedValue({
      data: [
        {
          event_id: 1,
          home_dmr_status: ['available'],
          away_dmr_status: ['unavailable'],
        },
        {
          event_id: 2,
          home_dmr_status: ['unavailable'],
          away_dmr_status: ['available'],
        },
      ],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls axios.post with correct payload and returns data', async () => {
    const params = {
      eventIds: [1, 2],
    };

    const result = await getEventsUpdates(params);

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith(
      '/planning_hub/events/fetch_event_updates',
      {
        event_ids: [1, 2],
      }
    );

    expect(result).toEqual([
      {
        event_id: 1,
        home_dmr_status: ['available'],
        away_dmr_status: ['unavailable'],
      },
      {
        event_id: 2,
        home_dmr_status: ['unavailable'],
        away_dmr_status: ['available'],
      },
    ]);
  });

  it('returns an empty array if response data is empty', async () => {
    postMock.mockResolvedValueOnce({ data: [] });

    const result = await getEventsUpdates({ eventIds: [] });

    expect(postMock).toHaveBeenCalledWith(
      '/planning_hub/events/fetch_event_updates',
      { event_ids: [] }
    );
    expect(result).toEqual([]);
  });
});
