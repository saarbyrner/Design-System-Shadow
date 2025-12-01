import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/documents/getDocuments';
import getDocuments from '../getDocuments';

describe('getDocuments', () => {
  let getDocumentsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getDocumentsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDocuments();
    expect(returnedData).toEqual(serverResponse);

    expect(getDocumentsRequest).toHaveBeenCalledTimes(1);
    expect(getDocumentsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/initial_data_documents',
      contentType: 'application/json',
    });
  });
});
