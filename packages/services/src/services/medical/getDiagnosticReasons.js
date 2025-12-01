// @flow
import $ from 'jquery';

export type DiagnosticReasonType = {
  id: number,
  name: string,
  isInjuryIllness: boolean,
};

export type DiagnosticReasonsType = {
  diagnostic_reasons: Array<DiagnosticReasonType>,
};

const getDiagnosticReasons = (): Promise<DiagnosticReasonsType> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/medical/diagnostic-reasons',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getDiagnosticReasons;
