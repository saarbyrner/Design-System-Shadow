// @flow
import $ from 'jquery';

export type FieldCondition = {
  id: number,
  name: string,
};
export type FieldConditions = Array<FieldCondition>;

const getFieldConditions = (): Promise<FieldConditions> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/field_conditions',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getFieldConditions;
