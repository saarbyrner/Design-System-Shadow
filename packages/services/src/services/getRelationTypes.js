// @flow
import $ from 'jquery';

const getRelationTypes = (context: string): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/relationships?context=${context}`,
    })
      .done((data) => {
        resolve(data?.relations);
      })
      .fail(reject);
  });
};

export default getRelationTypes;
