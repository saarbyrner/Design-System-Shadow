import { axios } from '@kitman/common/src/utils/services';
import { data as allergyResponse } from '../../../mocks/handlers/medical/getCurrentAllergy';
import getCurrentAllergy from '../getCurrentAllergy';

describe('getCurrentAllergy', () => {
  const getCurrentAllergyRequest = jest.spyOn(axios, 'get');

  it('calls the correct endpoint', async () => {
    const response = await getCurrentAllergy(1);

    expect(getCurrentAllergyRequest).toHaveBeenCalledTimes(1);
    expect(getCurrentAllergyRequest).toHaveBeenCalledWith(
      '/ui/medical/allergies/1'
    );
    expect(response).toEqual(allergyResponse);
  });
});
