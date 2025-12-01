// @flow
import $ from 'jquery';

type ReconciledIssue = {
  id: string,
  type: string,
};
const saveReconciledDiagnostic = (
  athleteId: number,
  diagnosticId: number,
  reasonId?: number,
  issue?: ReconciledIssue
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      // $FlowFixMe diagnosticId cannot be null here as validation will have caught it
      url: `/athletes/${athleteId}/diagnostics/${diagnosticId}/reconcile`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        diagnostic: {
          diagnostic_reason_id: reasonId,
          issue,
        },
        scope_to_org: true,
      }),
    })
      .done((response) => resolve(response))
      .fail(reject);
  });
};

export default saveReconciledDiagnostic;
