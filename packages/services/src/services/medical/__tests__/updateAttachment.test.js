import { axios } from '@kitman/common/src/utils/services';
import updateAttachmentResponse from '../../../mocks/handlers/medical/entityAttachments/mocks/attachments.mock';
import updateAttachment from '../updateAttachment';

describe('updateAttachment', () => {
  let request;

  beforeEach(() => {
    request = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({ data: updateAttachmentResponse });
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const attachmentId = 5;
    const updateData = {
      name: 'test',
      medical_attachment_category_ids: [1, 2],
    };
    const returnedData = await updateAttachment(attachmentId, updateData);

    expect(returnedData).toEqual(updateAttachmentResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(`/attachments/5`, updateData);
  });
});
