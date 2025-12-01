import { axios } from '@kitman/common/src/utils/services';

import uploadAttachment from '../uploadAttachment';

describe('uploadAttachment', () => {
  let uploadAttachmentRequest;
  const file = new File(['document'], 'document.png', { type: 'image/png' });

  beforeEach(() => {
    uploadAttachmentRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with correct params and payload', async () => {
    const config = { headers: { 'content-type': 'multipart/form-data' } };

    const formData = new FormData();
    formData.append('attachment', file);

    const returnedData = await uploadAttachment(file);

    expect(returnedData).toEqual({ attachment_id: 123, success: true });
    expect(uploadAttachmentRequest).toHaveBeenCalledTimes(1);
    expect(uploadAttachmentRequest).toHaveBeenCalledWith(
      '/attachments',
      formData,
      config
    );
  });

  it('calls the correct endpoint with correct params and payload with organistaion_id', async () => {
    const config = { headers: { 'content-type': 'multipart/form-data' } };

    const formData = new FormData();
    formData.append('attachment', file);

    const orgId = 123;
    const returnedData = await uploadAttachment(file, null, orgId);

    expect(returnedData).toEqual({ attachment_id: 123, success: true });
    expect(uploadAttachmentRequest).toHaveBeenCalledTimes(1);
    expect(uploadAttachmentRequest).toHaveBeenCalledWith(
      `/attachments?organisation_id=${orgId}`,
      formData,
      config
    );
  });

  it('calls the correct endpoint with correct params and payload with null organistaion_id', async () => {
    const config = { headers: { 'content-type': 'multipart/form-data' } };

    const formData = new FormData();
    formData.append('attachment', file);

    const returnedData = await uploadAttachment(file, null);

    expect(returnedData).toEqual({ attachment_id: 123, success: true });
    expect(uploadAttachmentRequest).toHaveBeenCalledTimes(1);
    expect(uploadAttachmentRequest).toHaveBeenCalledWith(
      '/attachments',
      formData,
      config
    );
  });

  it('calls the endpoint - error response', async () => {
    uploadAttachmentRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await uploadAttachment(file);
    }).rejects.toThrow();
  });
});
