// @flow
import $ from 'jquery';

export type DiagnosticStatus = {
  value:
    | 'incomplete'
    | 'pending'
    | 'missing reason'
    | 'ordered'
    | 'key result'
    | 'normal/abnormal'
    | 'complete'
    | 'error'
    | 'no_reason'
    | 'unreconciled'
    | 'canceled'
    | 'preliminary'
    | 'corrected'
    | 'final'
    | 'abnormal'
    | 'logged',
  text:
    | 'Incomplete'
    | 'Pending'
    | 'Missing Reason'
    | 'Ordered'
    | 'Key Result'
    | 'Normal/Abnormal'
    | 'Complete'
    | 'Error'
    | 'No reason'
    | 'Unreconciled'
    | 'Canceled'
    | 'Preliminary'
    | 'Corrected'
    | 'Final'
    | 'Abnormal'
    | 'Logged',
};
export type Statuses = Array<DiagnosticStatus>;

const getDiagnosticStatuses = (): Promise<Statuses> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/medical/diagnostics/statuses',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getDiagnosticStatuses;
