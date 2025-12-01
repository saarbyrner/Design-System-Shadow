import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/documents/getDocuments';
import deleteDocument from '../deleteDocument';

describe('deleteDocument', () => {
  let deleteDocumentRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deleteDocumentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await deleteDocument(1);

    expect(deleteDocumentRequest).toHaveBeenCalledTimes(1);
    expect(deleteDocumentRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/documents/1',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
    });
  });
});
