import $ from 'jquery';
import { data as mockedDiagnosticLink } from '../../../mocks/handlers/medical/saveDiagnosticLink';
import saveDiagnosticLinks from '../saveDiagnosticLinks';

describe('getDiagnostics', () => {
  let saveDiagnosticLinkRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deferred.resolveWith(null, [mockedDiagnosticLink]);

    saveDiagnosticLinkRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedDiagnosticLink));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveDiagnosticLinks(1, 2, [32]);
    expect(returnedData).toEqual(mockedDiagnosticLink);

    expect(saveDiagnosticLinkRequest).toHaveBeenCalledTimes(1);
    expect(saveDiagnosticLinkRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/athletes/1/diagnostics/2/attach_links',
      data: JSON.stringify({ diagnostic: { attached_links: [32] } }),
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
      contentType: 'application/json',
    });
  });
});
