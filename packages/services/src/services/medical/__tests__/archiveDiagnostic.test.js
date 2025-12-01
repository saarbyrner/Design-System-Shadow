import $ from 'jquery';
import archiveDiagnostic from '../archiveDiagnostic';

describe('archiveDiagnostic', () => {
  let archiveDiagnosticRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    archiveDiagnosticRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await archiveDiagnostic(123321, 420024, 1);

    expect(archiveDiagnosticRequest).toHaveBeenCalledTimes(1);
    expect(archiveDiagnosticRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/athletes/123321/diagnostics/420024/archive',
      contentType: 'application/json',
      data: JSON.stringify({
        archived: true,
        archive_reason_id: 1,
      }),
    });
  });
});
