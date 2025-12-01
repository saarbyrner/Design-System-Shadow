// @flow
import $ from 'jquery';

const searchProcedureTypes = (
  id: number,
  searchExpression: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      data: {
        location_id: id,
        search_expression: searchExpression,
      },
      url: '/ui/procedures/types_search',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default searchProcedureTypes;
