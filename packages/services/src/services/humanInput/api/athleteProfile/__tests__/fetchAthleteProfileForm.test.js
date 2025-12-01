import { axios } from '@kitman/common/src/utils/services';

import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import fetchForm from '@kitman/services/src/services/humanInput/api/athleteProfile/fetchAthleteProfileForm';

describe('fetchForm', () => {
  let fetchFormRequest;

  beforeEach(() => {
    fetchFormRequest = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: humanInputFormMockData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const athleteId = 1;
    const returnedData = await fetchForm(athleteId);

    expect(returnedData).toEqual(humanInputFormMockData);
    expect(fetchFormRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormRequest).toHaveBeenCalledWith(
      `/athletes/${athleteId}/profile/edit`
    );
  });
});
