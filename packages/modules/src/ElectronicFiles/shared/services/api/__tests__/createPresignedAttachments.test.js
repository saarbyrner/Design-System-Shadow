// flow
import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/createPresignedAttachments.mock';
import createPresignedAttachments, {
  endpoint,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/createPresignedAttachments';

const mockAttachments = {
  attachments: [
    {
      filetype: 'text/plain',
      original_filename: 'File5.txt',
      filesize: 236235411,
    },
    {
      filetype: 'text/plain',
      original_filename: 'File6.txt',
      filesize: 234511,
    },
  ],
};

describe('createPresignedAttachments', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createPresignedAttachments(mockAttachments);

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await createPresignedAttachments(mockAttachments);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint, mockAttachments);
    });
  });
});
