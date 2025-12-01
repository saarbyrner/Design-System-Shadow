import { axios } from '@kitman/common/src/utils/services';
import getMedicalAttachmentsFileTypes from '../getMedicalAttachmentsFileTypes';
import medicalAttachmentFileTypes from '../../../mocks/handlers/medical/entityAttachments/mocks/getMedicalAttachmentFileTypes.mock';

describe('getMedicalAttachmentsFileTypes', () => {
  describe('Handler response', () => {
    it('returns an array of options', async () => {
      const returnedData = await getMedicalAttachmentsFileTypes();
      expect(returnedData).toEqual(medicalAttachmentFileTypes);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'get').mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: { file_types: medicalAttachmentFileTypes } });
        });
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await getMedicalAttachmentsFileTypes();

      expect(returnedData).toEqual(medicalAttachmentFileTypes);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/ui/file_types');
    });
  });
});
