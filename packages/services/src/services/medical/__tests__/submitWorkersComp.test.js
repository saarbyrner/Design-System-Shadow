import { axios } from '@kitman/common/src/utils/services';
import { data as mockedWorkersCompResponse } from '../../../mocks/handlers/medical/submitWorkersComp';
import submitWorkersComp from '../submitWorkersComp';

describe('submitWorkersComp', () => {
  let submitWorkersCompRequest;

  beforeEach(() => {
    submitWorkersCompRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() =>
        Promise.resolve({ data: mockedWorkersCompResponse })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await submitWorkersComp(mockedWorkersCompResponse);
    expect(returnedData).toEqual(mockedWorkersCompResponse);

    expect(submitWorkersCompRequest).toHaveBeenCalledTimes(1);
    expect(submitWorkersCompRequest).toHaveBeenCalledWith(
      `/athletes/${mockedWorkersCompResponse.athlete_id}/workers_comps`,
      {
        ...mockedWorkersCompResponse,
      }
    );
  });
});
