import { axios } from '@kitman/common/src/utils/services';
import data from '@kitman/services/src/mocks/handlers/allergies/data.mock';
import archiveAllergy from '../archiveAllergy';

const mockAllergy = data[0].allergies[0];

describe('archiveAllergy', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await archiveAllergy(mockAllergy, 2);

    expect(returnedData).toEqual({ id: mockAllergy.id, archived: true });
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await archiveAllergy(mockAllergy, 2);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/ui/medical/allergies/${mockAllergy.id}/archive`,
        {
          archive_reason_id: 2,
          archived: true,
        }
      );
    });
  });
});
