import $ from 'jquery';
import { data as exportMultiDocResponse } from '@kitman/services/src/mocks/handlers/exports/exportMultiDocument';
import exportMultiDocument from '../exportMultiDocument';

describe('exportMultiDocument', () => {
  let exportMultiDocumentRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportMultiDocumentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(exportMultiDocResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportMultiDocument({
      attachmentIds: [1234, 3756, 2984],
    });
    expect(returnedData).toEqual(exportMultiDocResponse);

    expect(exportMultiDocumentRequest).toHaveBeenCalledTimes(1);
    expect(exportMultiDocumentRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/multi_document',
      data: {
        attachment_ids: [1234, 3756, 2984],
      },
    });
  });
});
