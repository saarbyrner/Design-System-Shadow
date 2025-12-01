// @flow
import $ from 'jquery';
import type { Principles } from '@kitman/common/src/types/Principles';

const getPrinciples = (
  {
    onlyForCurrentSquad = false,
  }: {
    onlyForCurrentSquad: boolean,
  } = { onlyForCurrentSquad: false }
): Promise<Principles> =>
  new Promise((resolve, reject) => {
    $.ajax({
      url: '/ui/planning_hub/principles/search',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        current_squad: onlyForCurrentSquad,
      }),
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getPrinciples;
