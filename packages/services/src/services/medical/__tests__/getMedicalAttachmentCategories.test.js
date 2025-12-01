import { axios } from '@kitman/common/src/utils/services';
import getMedicalAttachmentCategories from '../getMedicalAttachmentCategories';
import getMedicalAttachmentCategoriesResponse from '../../../mocks/handlers/medical/entityAttachments/mocks/getMedicalAttachmentCategories.mock';

describe('getMedicalAttachmentCategories', () => {
  let request;

  beforeEach(() => {
    request = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({ data: getMedicalAttachmentCategoriesResponse });
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getMedicalAttachmentCategories();
    expect(returnedData).toEqual(
      getMedicalAttachmentCategoriesResponse.medical_attachment_categories
    );

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(`/ui/medical_attachment_categories`);
  });
});
