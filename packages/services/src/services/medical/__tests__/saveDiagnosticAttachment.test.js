import $ from 'jquery';
import { data as mockedDiagnosticAttachment } from '../../../mocks/handlers/medical/saveDiagnosticAttachment';
import saveDiagnosticAttachment from '../saveDiagnosticAttachment';

describe('getDiagnostics', () => {
  let saveDiagnosticAttachmentRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    saveDiagnosticAttachmentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedDiagnosticAttachment));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveDiagnosticAttachment(1, 2, [32]);
    expect(returnedData).toEqual(mockedDiagnosticAttachment);

    expect(saveDiagnosticAttachmentRequest).toHaveBeenCalledTimes(1);
    expect(saveDiagnosticAttachmentRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/medical/diagnostics/2/attach',
      contentType: 'application/json',
      data: JSON.stringify({ attachment_ids: [32], athlete_id: 1 }),
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
    });
  });
});
