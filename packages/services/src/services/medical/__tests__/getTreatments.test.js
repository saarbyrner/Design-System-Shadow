import { axios } from '@kitman/common/src/utils/services';
import { data as mockedTreatments } from '../../../mocks/handlers/medical/getTreatments';
import getTreatments from '../getTreatments';

describe('getTreatments', () => {
  let getTreatmentsRequest;
  const abortController = new AbortController();

  beforeEach(() => {
    getTreatmentsRequest = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: mockedTreatments });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const mockFilters = {
      athlete_id: null,
      page: null,
      scope_to_squad: false,
      search_expression: '',
      squads: [],
      time_range: null,
    };

    const returnedData = await getTreatments({
      filters: mockFilters,
      nextPage: null,
      scopeToSquad: false,
      abortSignal: abortController.signal,
    });

    expect(getTreatmentsRequest).toHaveBeenCalledTimes(1);
    expect(getTreatmentsRequest).toHaveBeenCalledWith(
      '/treatment_sessions/search',
      {
        ...mockFilters,
        scope_to_squad: false,
      },
      { signal: abortController.signal }
    );
    expect(returnedData).toEqual(mockedTreatments);
  });
});
