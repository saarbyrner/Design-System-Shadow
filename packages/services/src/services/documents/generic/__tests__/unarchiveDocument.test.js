import { axios } from '@kitman/common/src/utils/services';
import { unarchiveDocument } from '@kitman/services/src/services/documents/generic/redux/services/apis/unarchiveDocument';

describe('unarchiveDocument', () => {
  let unarchiveDocumentRequest;
  const documentId = 123;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    unarchiveDocumentRequest = jest.spyOn(axios, 'post');

    const returnedData = await unarchiveDocument(documentId);

    expect(returnedData).toEqual({});
    expect(unarchiveDocumentRequest).toHaveBeenCalledTimes(1);
    expect(unarchiveDocumentRequest).toHaveBeenCalledWith(
      `/generic_documents/${documentId}/unarchive`
    );
  });

  it('calls the new endpoint - error response', async () => {
    unarchiveDocumentRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await unarchiveDocument(documentId);
    }).rejects.toThrow();
  });
});
