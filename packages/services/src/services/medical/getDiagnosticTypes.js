// @flow
import $ from 'jquery';

export type DiagnosticType = {
  id: number,
  name: string,
  laterality_required: boolean,
  cpt_code: number,
};
export type DiagnosticTypes = Array<DiagnosticType>;

const getDiagnosticTypes = (id?: number): Promise<DiagnosticTypes> => {
  const payloadUrl = `/ui/medical/diagnostics/types${
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

export default getDiagnosticTypes;
