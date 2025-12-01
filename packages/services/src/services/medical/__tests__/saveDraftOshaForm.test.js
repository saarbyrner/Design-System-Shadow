import { axios } from '@kitman/common/src/utils/services';
import { data as mockedOshaResponse } from '../../../mocks/handlers/medical/saveDraftOshaForm';
import { saveDraftOshaForm } from '../saveDraftOshaForm';

describe('saveDraftOshaForm', () => {
  let saveDraftWorkersCompRequest;

  beforeEach(() => {
    saveDraftWorkersCompRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => Promise.resolve({ data: mockedOshaResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveDraftOshaForm(mockedOshaResponse);
    expect(returnedData).toEqual(mockedOshaResponse);

    expect(saveDraftWorkersCompRequest).toHaveBeenCalledTimes(1);
    expect(saveDraftWorkersCompRequest).toHaveBeenCalledWith(
      `/athletes/${mockedOshaResponse.athlete_id}/oshas/save_draft`,
      {
        ...mockedOshaResponse,
      }
    );
  });
});
