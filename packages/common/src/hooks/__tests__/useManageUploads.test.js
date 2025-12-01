import { renderHook, act } from '@testing-library/react-hooks';
import { axios } from '@kitman/common/src/utils/services';
import { server, rest } from '@kitman/services/src/mocks/server';
import { mockPresignedPostUrl } from '@kitman/services/src/mocks/handlers/uploads/handlers';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import useManageUploads from '@kitman/common/src/hooks/useManageUploads';

const attachmentWithPresignedPostDetails = {
  id: 999, // number as comes from Medinah
  confirmed: false,
  filename: 'document.png',
  filetype: 'image/png',
  filesize: 1234,
  presigned_post: { fields: { key: 'test' }, url: mockPresignedPostUrl },
};

const testFile = new File(['document'], 'document.png', {
  type: 'image/png',
});
const filesToUpload = [
  {
    filename: 'document.png',
    fileType: 'image/png',
    fileSize: 1234,
    file: testFile,
    id: 'abc', // string as comes from filePond
    filenameWithoutExtension: 'document',
  },
];
let renderHookResult;
const actAndRenderHook = async () => {
  await act(async () => {
    renderHookResult = renderHook(() => useManageUploads()).result;
  });
};

describe('useManageUploads', () => {
  let uploadWithPresignedPostRequest;
  let confirmFileUploadRequest;

  beforeEach(() => {
    uploadWithPresignedPostRequest = jest.spyOn(axios, 'post');
    confirmFileUploadRequest = jest.spyOn(axios, 'patch');
  });

  it('returns initial data', async () => {
    await actAndRenderHook();

    expect(renderHookResult.current).toHaveProperty(
      'uploadAndConfirmAttachments'
    );
  });

  it('performs uploadAndConfirmAttachments with success result', async () => {
    await actAndRenderHook();

    const result = await renderHookResult.current.uploadAndConfirmAttachments(
      [attachmentWithPresignedPostDetails],
      filesToUpload
      // Note: We cannot use updateFileStatus with our current MSW version.
      // We need update to > 2.0.0 and that needs Node update
    );

    // [ { status: 'rejected', reason: undefined } ]
    expect(result[0].status).toEqual('fulfilled');
    expect(result[0].value.attachment).toEqual({ url: 'https://someurl.com' });
    expect(uploadWithPresignedPostRequest).toHaveBeenCalledTimes(1);
    expect(uploadWithPresignedPostRequest).toHaveBeenCalledWith(
      mockPresignedPostUrl,
      expect.anything(),
      { headers: { 'content-type': 'multipart/form-data' } }
    );

    expect(confirmFileUploadRequest).toHaveBeenCalledTimes(1);
    expect(confirmFileUploadRequest).toHaveBeenCalledWith(
      `/attachments/${attachmentWithPresignedPostDetails.id}/confirm`
    );
  });

  it('rejects uploadAndConfirmAttachments when Attachment already confirmed', async () => {
    await actAndRenderHook();

    const result = await renderHookResult.current.uploadAndConfirmAttachments(
      [{ ...attachmentWithPresignedPostDetails, confirmed: true }],
      filesToUpload
      // Note: We cannot use updateFileStatus with our current MSW version.
      // We need update to > 2.0.0 and that needs Node update
    );

    expect(result[0].status).toEqual('rejected');
    expect(uploadWithPresignedPostRequest).toHaveBeenCalledTimes(0);
    expect(confirmFileUploadRequest).toHaveBeenCalledTimes(0);
  });

  it('rejects when the upload fails', async () => {
    await actAndRenderHook();
    server.use(
      rest.post(mockPresignedPostUrl, (req, res, ctx) =>
        res(ctx.status(statusCodes.internalServerError))
      )
    );
    const result = await renderHookResult.current.uploadAndConfirmAttachments(
      [attachmentWithPresignedPostDetails],
      filesToUpload
      // Note: We cannot use updateFileStatus with our current MSW version.
      // We need update to > 2.0.0 and that needs Node update
    );

    expect(result[0].status).toEqual('rejected');
    expect(confirmFileUploadRequest).toHaveBeenCalledTimes(0);
  });

  it('rejects when the confirm file fails', async () => {
    await actAndRenderHook();
    server.use(
      rest.patch(
        `/attachments/${attachmentWithPresignedPostDetails.id}/confirm`,
        (req, res, ctx) => res(ctx.status(statusCodes.internalServerError))
      )
    );
    const result = await renderHookResult.current.uploadAndConfirmAttachments(
      [attachmentWithPresignedPostDetails],
      filesToUpload
      // Note: We cannot use updateFileStatus with our current MSW version.
      // We need update to > 2.0.0 and that needs Node update
    );

    expect(uploadWithPresignedPostRequest).toHaveBeenCalledTimes(1);
    expect(result[0].status).toEqual('rejected');
  });
});
