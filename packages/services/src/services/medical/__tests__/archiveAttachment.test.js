import { axios } from '@kitman/common/src/utils/services';
import archiveAttachmentResponse from '../../../mocks/handlers/medical/entityAttachments/mocks/attachments.mock';
import archiveAttachment from '../archiveAttachment';

describe('archiveAttachment', () => {
  let request;

  beforeEach(() => {
    request = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({ data: archiveAttachmentResponse });
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const attachmentId = 5;
    const archiveReasonId = 2;
    const returnedData = await archiveAttachment(attachmentId, archiveReasonId);

    expect(returnedData).toEqual(archiveAttachmentResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(`/attachments/5/archive`, {
      archive_reason_id: 2,
    });
  });
});
