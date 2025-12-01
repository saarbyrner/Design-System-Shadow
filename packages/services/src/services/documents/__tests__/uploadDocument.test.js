import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/documents/uploadDocument';
import uploadDocument from '../uploadDocument';

describe('uploadDocument', () => {
  let uploadDocumentRequest;

  const formDataMocked = new FormData();
  formDataMocked.append(
    'file',
    new File(['fake_document'], 'fake_document.doc', {
      type: 'document/doc',
    })
  );

  beforeEach(() => {
    const deferred = $.Deferred();
    uploadDocumentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await uploadDocument(formDataMocked);
    expect(returnedData).toEqual(serverResponse);

    expect(uploadDocumentRequest).toHaveBeenCalledTimes(1);
    expect(uploadDocumentRequest).toHaveBeenCalledWith({
      contentType: false,
      data: formDataMocked,
      enctype: 'multipart/form-data',
      headers: { 'X-CSRF-Token': undefined },
      method: 'POST',
      processData: false,
      url: '/documents',
    });
  });
});
