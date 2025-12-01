// @flow
import $ from 'jquery';
import type { DiagnosticType } from './getDiagnosticTypes';

export type DiagnosticTypeGroupSet = {
  id: number,
  name: string,
  diagnostic_types: Array<DiagnosticType>,
};

export type DiagnosticTypeGroupSets = Array<DiagnosticTypeGroupSet>;

const getDiagnosticTypeGroupSets = (
  id?: number
): Promise<DiagnosticTypeGroupSets> => {
  const payloadUrl = `/ui/medical/diagnostics/type_groups${
    id ? `?location_id=${id}` : ''
  }`;

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: payloadUrl,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getDiagnosticTypeGroupSets;
