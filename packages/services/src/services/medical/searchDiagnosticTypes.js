// @flow
import $ from 'jquery';

export type DiagnosticType = {
  id: number,
  name: string,
  laterality_required: boolean,
  cpt_code: number,
};
export type DiagnosticTypes = Array<DiagnosticType>;

const searchDiagnosticTypes = (
  id: number,
  searchExpression: string
): Promise<DiagnosticTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/diagnostics/search',
      data: {
        location_id: id,
        search_expression: searchExpression,
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default searchDiagnosticTypes;
