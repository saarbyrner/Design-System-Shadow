// @flow
import $ from 'jquery';
import type { PrinciplePhases } from '@kitman/common/src/types/Principles';

const getPhases = (): Promise<PrinciplePhases> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/planning_hub/phases',
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getPhases;
