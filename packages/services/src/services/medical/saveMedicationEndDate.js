// @flow
import $ from 'jquery';
import type { FormState } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';
import type { Diagnostic } from '@kitman/modules/src/Medical/shared/types';

export type DiagnosticResponse = {
  diagnostic: Diagnostic,
};
const saveMedicationEndDate = (
  athleteId: number,
  diagnosticId: number,
  startDate: string,
  diagnosticDate: string,
  formState: FormState
): Promise<DiagnosticResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/athletes/${athleteId}/diagnostics/${diagnosticId}/medication_complete`,
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        Accept: 'application/json',
      },
      data: JSON.stringify({
        diagnostic: {
          diag_date: diagnosticDate,
          medication_completed: formState.medicationCourseCompleted,
          medication_started_at: startDate,
          medication_completed_at: formState.medicationCourseCompletedAt,
        },
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveMedicationEndDate;
