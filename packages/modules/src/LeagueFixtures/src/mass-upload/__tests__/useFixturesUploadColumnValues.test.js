import { renderHook, act } from '@testing-library/react-hooks';
import moment from 'moment-timezone';

import { useGetSquadAthletesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetCompetitionsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { getVenueTypes } from '@kitman/services';
import getTvChannels from '@kitman/services/src/services/planning/tvChannels/getTvChannels';

import { useFixturesUploadColumnValues } from '../useFixturesUploadColumnValues';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi'
);
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi');
jest.mock('@kitman/services');
jest.mock('@kitman/services/src/services/planning/tvChannels/getTvChannels');
jest.mock('moment-timezone');

describe('useFixturesUploadColumnValues', () => {
  const mockApiData = {
    competitions: [{ id: 10, name: 'Champions League' }],
    clubs: [
      { id: 100, name: 'Real Madrid' },
      { id: 101, name: 'Barcelona' },
    ],
    venueTypes: [
      { id: 1, name: 'Stadium' },
      { id: 2, name: 'Training Ground' },
    ],
    tvChannels: [{ id: 5, name: 'ESPN' }],
    timezones: ['Europe/Dublin', 'America/New_York'],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useGetSquadAthletesQuery.mockReturnValue({
      data: { squads: mockApiData.squads },
    });
    useGetCompetitionsQuery.mockReturnValue({ data: mockApiData.competitions });
    useGetClubsQuery.mockReturnValue({ data: mockApiData.clubs });

    getVenueTypes.mockResolvedValue(mockApiData.venueTypes);
    getTvChannels.mockResolvedValue(mockApiData.tvChannels);

    moment.tz.names.mockReturnValue(mockApiData.timezones);
  });

  it('should return correctly formatted column values from all data sources', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFixturesUploadColumnValues()
    );

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.competitions).toEqual(['Champions League']);
    expect(result.current.clubs).toEqual(['Real Madrid', 'Barcelona']);
    expect(result.current.timezones).toEqual([
      'Europe/Dublin',
      'America/New_York',
    ]);
    expect(result.current.tvChannels).toEqual(['ESPN']);
  });

  it('should return empty arrays when API calls return no data', async () => {
    useGetSquadAthletesQuery.mockReturnValue({ data: undefined });
    useGetCompetitionsQuery.mockReturnValue({ data: [] });
    useGetClubsQuery.mockReturnValue({}); // Simulates a response with no 'data' key
    getVenueTypes.mockResolvedValue([]);
    getTvChannels.mockResolvedValue([]);
    moment.tz.names.mockReturnValue([]);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFixturesUploadColumnValues()
    );

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.competitions).toEqual([]);
    expect(result.current.clubs).toEqual([]);
    expect(result.current.timezones).toEqual([]);
    expect(result.current.tvChannels).toEqual([]);
  });

  it('should show initial empty state for TV channels before async fetch completes', () => {
    const { result } = renderHook(() => useFixturesUploadColumnValues());

    expect(result.current.tvChannels).toEqual([]);

    expect(result.current.timezones).toEqual([
      'Europe/Dublin',
      'America/New_York',
    ]);
  });
});
