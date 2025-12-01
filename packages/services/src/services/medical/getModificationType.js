// @flow
import $ from 'jquery';

export type ModificationType = {
  id: number,
  name: string,
};

const getModificationType = (): Promise<ModificationType> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/annotations/modification_type',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getModificationType;
