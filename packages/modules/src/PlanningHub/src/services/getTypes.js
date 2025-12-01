// @flow
import $ from 'jquery';
import type { PrincipleTypes } from '@kitman/common/src/types/Principles';

const getTypes = (): Promise<PrincipleTypes> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/planning_hub/principle_types',
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getTypes;
