import { axios } from '@kitman/common/src/utils/services';
import { medStrengthUnitsMock as data } from '@kitman/services/src/mocks/handlers/medical/medications';
import getMedStrengthUnits, {
  url,
} from '@kitman/services/src/services/medical/medications/getMedStrengthUnits';

describe('getMedStrengthUnits', () => {
  let request;

  it('returns the expected data', async () => {
    const returnedData = await getMedStrengthUnits();
    expect(returnedData).toEqual(data.med_strength_units);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      await getMedStrengthUnits();

      expect(request).toHaveBeenCalledWith(url);
    });
  });
});
