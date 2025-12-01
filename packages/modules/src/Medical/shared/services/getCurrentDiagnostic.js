// @flow
import $ from 'jquery';
import type { Diagnostic } from '../types';

// retrieves single diagnostic for current athlete

const getCurrentDiagnostic = (
  athleteId: number,
  diagnosticId: number
): Promise<Diagnostic> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/medical/athletes/${athleteId}/diagnostics/${diagnosticId}`,
      data: { from_api: true },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getCurrentDiagnostic;
