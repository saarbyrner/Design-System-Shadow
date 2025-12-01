// @flow
import $ from 'jquery';
import type { DiagnosticResultsBlockList } from '../types';

// retrieves results (lab or report) related to a diagnostic
const getDiagnosticResults = (
  diagnosticId: number
): Promise<DiagnosticResultsBlockList> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/medical/diagnostics/${diagnosticId}/redox-results`,
      data: { from_api: true },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getDiagnosticResults;
