import { axios } from '@kitman/common/src/utils/services';
import uploadFileToS3 from '@kitman/services/src/services/documents/generic/redux/services/apis/uploadFileToS3';

describe('uploadFileToS3', () => {
  let uploadFileToS3Request;

  beforeEach(() => {
    uploadFileToS3Request = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with correct params and payload', async () => {
    const file = new File(['document'], 'document.png', { type: 'image/png' });
    const fileId = 'some id';
    const presignedPost = {
      url: 'https://s3:9000',
      fields: {
        key: 'kitman/12677a9257d28e08d2b41d7bfe94f774.pdf',
        success_action_status: '201',
        'Content-Type': 'application/pdf',
        policy:
          'eyJleHBpcmF0aW9uIjoiMjAyNC0wNC0wNFQxMjowNjozN1oiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJpbmpwcm8tdGVzdCJ9LHsia2V5Ijoia2l0bWFuLzEyNjc3YTkyNTdkMjhlMDhkMmI0MWQ3YmZlOTRmNzc0LnBkZiJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsNTI0Mjg4MDAwXSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LHsiQ29udGVudC1UeXBlIjoiYXBwbGljYXRpb24vcGRmIn0seyJ4LWFtei1jcmVkZW50aWFsIjoic3R1YmJlZC1ha2lkLzIwMjQwNDA0L2V1LXdlc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifSx7IngtYW16LWRhdGUiOiIyMDI0MDQwNFQxMjAxMzdaIn1dfQ==',
        'x-amz-credential': 'stubbed-akid/20240404/eu-west-1/s3/aws4_request',
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-date': '20240404T120137Z',
        'x-amz-signature':
          'b988b9b0b7f2269590b8865cb29dd5c5db8856172c1e9abbfc4c0500fa7c93d2',
      },
    };
    const config = { headers: { 'content-type': 'multipart/form-data' } };

    const formData = new FormData();

    Object.entries(presignedPost.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('file', file);

    const returnedData = await uploadFileToS3(file, fileId, presignedPost);

    expect(returnedData).toEqual({});
    expect(uploadFileToS3Request).toHaveBeenCalledTimes(1);
    expect(uploadFileToS3Request).toHaveBeenCalledWith(
      'https://s3:9000',
      formData,
      config
    );
  });
});
