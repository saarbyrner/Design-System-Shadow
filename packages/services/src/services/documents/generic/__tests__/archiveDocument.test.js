import { axios } from '@kitman/common/src/utils/services';
import { archiveDocument } from '@kitman/services/src/services/documents/generic/redux/services/apis/archiveDocument';

describe('archiveDocument', () => {
  let archiveDocumentRequest;
  const documentId = 123;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    archiveDocumentRequest = jest.spyOn(axios, 'post');

    const returnedData = await archiveDocument(documentId);

    expect(returnedData).toEqual({});
    expect(archiveDocumentRequest).toHaveBeenCalledTimes(1);
    expect(archiveDocumentRequest).toHaveBeenCalledWith(
      `/generic_documents/${documentId}/archive`
    );
  });

  it('calls the new endpoint - error response', async () => {
    archiveDocumentRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await archiveDocument(documentId);
    }).rejects.toThrow();
  });
});
