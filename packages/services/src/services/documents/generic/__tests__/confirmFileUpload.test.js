import { axios } from '@kitman/common/src/utils/services';
import confirmFileUpload from '@kitman/services/src/services/documents/generic/redux/services/apis/confirmFileUpload';
import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/handlers/confirmFileUpload';

describe('confirmFileUpload', () => {
  let confirmFileUploadRequest;
  const fileId = 123;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    confirmFileUploadRequest = jest.spyOn(axios, 'patch');

    const returnedData = await confirmFileUpload(fileId);

    expect(returnedData).toEqual(data);
    expect(confirmFileUploadRequest).toHaveBeenCalledTimes(1);
    expect(confirmFileUploadRequest).toHaveBeenCalledWith(
      `/attachments/${fileId}/confirm`
    );
  });

  it('calls the endpoint with prefix', async () => {
    confirmFileUploadRequest = jest.spyOn(axios, 'patch');

    const returnedData = await confirmFileUpload(fileId, '/medical/scanning');

    expect(returnedData).toEqual(data);
    expect(confirmFileUploadRequest).toHaveBeenCalledTimes(1);
    expect(confirmFileUploadRequest).toHaveBeenCalledWith(
      `/medical/scanning/attachments/${fileId}/confirm`
    );
  });

  it('calls the new endpoint - error response', async () => {
    confirmFileUploadRequest = jest
      .spyOn(axios, 'patch')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await confirmFileUpload(fileId);
    }).rejects.toThrow();
  });
});
