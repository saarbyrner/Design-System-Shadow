import { axios } from '@kitman/common/src/utils/services';

import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import updateAthleteProfile from '@kitman/services/src/services/humanInput/api/athleteProfile/updateAthleteProfile';
import { updateFormAnswersSetRequestBody } from '@kitman/services/src/services/humanInput/api/mocks/data/shared';

describe('updateAthleteProfile', () => {
  let updateFormRequest;

  beforeEach(() => {
    updateFormRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = {
      athleteId: 1,
      requestBody: updateFormAnswersSetRequestBody,
    };
    const returnedData = await updateAthleteProfile(props);

    expect(returnedData).toEqual(humanInputFormMockData);
    expect(updateFormRequest).toHaveBeenCalledTimes(1);
    expect(updateFormRequest).toHaveBeenCalledWith(
      `/athletes/${props.athleteId}/profile`,
      props.requestBody
    );
  });
});
