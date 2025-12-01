import $ from 'jquery';
import deleteDiagnosticAttachment from '../deleteDiagnosticAttachment';

describe('deleteDiagnosticAttachment', () => {
  let deleteDiagnosticRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deleteDiagnosticRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await deleteDiagnosticAttachment(123321, 420021);

    expect(deleteDiagnosticRequest).toHaveBeenCalledTimes(1);
    expect(deleteDiagnosticRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/medical/diagnostics/123321/attachments/420021',
      contentType: 'application/json',
    });
  });
});
