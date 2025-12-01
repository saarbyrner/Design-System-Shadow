import { axios } from '@kitman/common/src/utils/services';
import uploadWithPresignedPost from '@kitman/services/src/services/uploads/uploadWithPresignedPost';

describe('uploadWithPresignedPost', () => {
  const url = 'https://storageService:9000';
  const presignedPost = {
    url,
    fields: {
      key: 'kitman/test.pdf',
      success_action_status: '201',
      'Content-Type': 'application/pdf',
      policy: 'somePolicy',
      'x-amz-credential': 'someCredential',
      'x-amz-algorithm': 'AWS4-HMAC-SHA256',
      'x-amz-date': '20240404T120137Z',
      'x-amz-signature': 'someSignature',
    },
  };
  const config = { headers: { 'content-type': 'multipart/form-data' } };
  const formData = new FormData();
  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  const file = new File(['document'], 'document.png', {
    type: 'image/png',
  });
  formData.append('file', file);

  const params = {
    file,
    attachmentId: 1,
    fileId: 'some id',
    presignedPost,
    // TODO: For progress support in MSW we need to update to MSW >= 2.0.0 once node update to v20 happens.
    // progressCallback: jest.fn(),
  };

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await uploadWithPresignedPost(params);

    expect(returnedData).toEqual({});
  });

  describe('Mock axios', () => {
    let uploadWithPresignedPostRequest;

    beforeEach(() => {
      uploadWithPresignedPostRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct params and payload', async () => {
      const returnedData = await uploadWithPresignedPost(params);

      expect(returnedData).toEqual({});
      expect(uploadWithPresignedPostRequest).toHaveBeenCalledTimes(1);
      expect(uploadWithPresignedPostRequest).toHaveBeenCalledWith(
        url,
        formData,
        config
      );
    });
  });
});
