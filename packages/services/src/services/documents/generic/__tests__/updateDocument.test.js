import { axios } from '@kitman/common/src/utils/services';

import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';
import {
  updateDocument,
  buildGenericDocumentsUpdateEndpoint,
} from '@kitman/services/src/services/documents/generic/redux/services/apis/updateDocument';
import { data as genericDocumentCategories } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';

describe('updateDocument', () => {
  let updateDocumentRequest;

  const requestBody = {
    entity: { id: 1, type: 'User' },
    title: 'Test',
    organisation_document_categories: [genericDocumentCategories[0].id],
    document_date: '2024-04-07T08:00:00Z',
    expires_at: '2025-04-07T08:00:00Z',
    document_note: 'Note Taken',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    updateDocumentRequest = jest.spyOn(axios, 'put');

    const returnedData = await updateDocument(requestBody);
    expect(returnedData).toEqual(data.documents[0]);
    expect(updateDocumentRequest).toHaveBeenCalledTimes(1);
    expect(updateDocumentRequest).toHaveBeenCalledWith(
      buildGenericDocumentsUpdateEndpoint(requestBody.id),
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    updateDocumentRequest = jest.spyOn(axios, 'put').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await updateDocument(requestBody);
    }).rejects.toThrow();
  });
});
