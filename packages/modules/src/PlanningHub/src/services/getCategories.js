// @flow
import $ from 'jquery';
import type { PrincipleCategories } from '@kitman/common/src/types/Principles';

const getCategories = (): Promise<PrincipleCategories> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/planning_hub/principle_categories`,
    })
      .done((response) => resolve(response))
      .fail(() => reject());
  });

export default getCategories;
