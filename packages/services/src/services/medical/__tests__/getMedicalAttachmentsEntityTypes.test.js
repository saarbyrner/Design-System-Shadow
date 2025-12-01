import { axios } from '@kitman/common/src/utils/services';
import getMedicalAttachmentsEntityTypes from '../getMedicalAttachmentsEntityTypes';
import medicalAttachmentsEntityTypes from '../../../mocks/handlers/medical/entityAttachments/mocks/getMedicalAttachmentsEntityTypes.mock';

describe('getMedicalAttachmentsFileTypes', () => {
  describe('Handler response', () => {
    it('returns an array of options', async () => {
      const returnedData = await getMedicalAttachmentsEntityTypes();
      expect(returnedData).toEqual(medicalAttachmentsEntityTypes);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'get').mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({
            data: { entity_types: medicalAttachmentsEntityTypes },
          });
        });
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await getMedicalAttachmentsEntityTypes();

      expect(returnedData).toEqual(medicalAttachmentsEntityTypes);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/ui/medical/entity_attachments/entity_types'
      );
    });
  });
});
