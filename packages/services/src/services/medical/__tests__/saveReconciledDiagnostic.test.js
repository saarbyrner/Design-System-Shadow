import $ from 'jquery';
import { data as mockedReconciledDiagnostic } from '../../../mocks/handlers/medical/saveReconciledDiagnostic';
import saveReconciledDiagnostic from '../saveReconciledDiagnostic';

describe('getDiagnostics', () => {
  let saveReconciledDiagnosticRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deferred.resolveWith(null, [mockedReconciledDiagnostic]);

    saveReconciledDiagnosticRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedReconciledDiagnostic));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveReconciledDiagnostic(1, 2, 32, {
      id: 123,
      type: 'Injury',
    });
    expect(returnedData).toEqual(mockedReconciledDiagnostic);

    expect(saveReconciledDiagnosticRequest).toHaveBeenCalledTimes(1);
    expect(saveReconciledDiagnosticRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/athletes/1/diagnostics/2/reconcile',
      data: JSON.stringify({
        diagnostic: {
          diagnostic_reason_id: 32,
          issue: {
            id: 123,
            type: 'Injury',
          },
        },
        scope_to_org: true,
      }),
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
      contentType: 'application/json',
    });
  });
});
