import { axios } from '@kitman/common/src/utils/services';

import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';
import {
  createDocument,
  GENERIC_DOCUMENTS_CREATE_ENDPOINT,
} from '@kitman/services/src/services/documents/generic/redux/services/apis/createDocument';
import { data as genericDocumentCategories } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';

describe('createDocument', () => {
  let createDocumentRequest;
  const requestBody = {
    entity: { id: 1, type: 'User' },
    title: 'Test',
    organisation_document_categories: [genericDocumentCategories[0].id],
    attachments: {
      filesize: 123,
      filetype: 'application/pdf',
      original_filename: 'test_file.pdf',
    },
    document_date: '2024-04-07T08:00:00Z',
    expires_at: '2025-04-07T08:00:00Z',
    document_note: 'Note Taken',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    createDocumentRequest = jest.spyOn(axios, 'post');

    const returnedData = await createDocument(requestBody);

    expect(returnedData).toEqual(data.documents[0]);
    expect(createDocumentRequest).toHaveBeenCalledTimes(1);
    expect(createDocumentRequest).toHaveBeenCalledWith(
      GENERIC_DOCUMENTS_CREATE_ENDPOINT,
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    createDocumentRequest = jest.spyOn(axios, 'post').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await createDocument(requestBody);
    }).rejects.toThrow();
  });
});
