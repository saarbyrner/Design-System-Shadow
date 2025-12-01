import { axios } from '@kitman/common/src/utils/services';
import { data as mockedWorkersCompResponse } from '../../../mocks/handlers/medical/saveDraftWorkersComp';
import saveDraftWorkersComp from '../saveDraftWorkersComp';

describe('saveDraftWorkersComp', () => {
  let saveDraftWorkersCompRequest;

  beforeEach(() => {
    saveDraftWorkersCompRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() =>
        Promise.resolve({ data: mockedWorkersCompResponse })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveDraftWorkersComp(mockedWorkersCompResponse);
    expect(returnedData).toEqual(mockedWorkersCompResponse);

    expect(saveDraftWorkersCompRequest).toHaveBeenCalledTimes(1);
    expect(saveDraftWorkersCompRequest).toHaveBeenCalledWith(
      `/athletes/${mockedWorkersCompResponse.athlete_id}/workers_comps/save_draft`,
      {
        ...mockedWorkersCompResponse,
      }
    );
  });
});
