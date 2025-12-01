import { axios } from '@kitman/common/src/utils/services';
import exportScoutAttendees from '../exportScoutAttendees';

describe('exportScoutAttendees', () => {
  let mockAxiosPost;

  const mockFilters = {
    competitions: ['Premier League', 'La Liga'],
    organisations: ['Man United', 'Barcelona'],
    squad_names: ['First Team', 'U21'],
    statuses: ['Active'],
    dateRange: { from: '2025-01-01', to: '2025-12-31' },
    search_expression: 'Midfielder',
  };

  const mockResponse = {
    id: 'export-123',
    type: 'scout_attendee_export',
    status: 'pending',
    createdAt: '2025-10-14T12:00:00Z',
  };

  beforeEach(() => {
    mockAxiosPost = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: mockResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the correct response when successful', async () => {
    const result = await exportScoutAttendees(mockFilters);

    expect(result).toEqual(mockResponse);
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    expect(mockAxiosPost).toHaveBeenCalledWith(
      '/export_jobs/scout_attendee_export',
      {
        filter: {
          competitions: mockFilters.competitions,
          organisations: mockFilters.organisations,
          squad_names: mockFilters.squad_names,
          statuses: mockFilters.statuses,
          date_range: mockFilters.dateRange,
          search_expression: mockFilters.search_expression,
        },
      }
    );
  });

  it('should throw an error for rejected request (generic error)', async () => {
    const error = new Error('Network Error');
    mockAxiosPost.mockRejectedValueOnce(error);

    await expect(exportScoutAttendees(mockFilters)).rejects.toThrow(
      'Network Error'
    );
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
  });
});
