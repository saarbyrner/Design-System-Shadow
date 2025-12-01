// @flow
import $ from 'jquery';
import type { EditPrincipleCategories } from '@kitman/common/src/types/Principles';

const saveCategories = async (categories: EditPrincipleCategories) =>
  new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/planning_hub/principle_categories/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ principle_categories: categories }),
    })
      .done(() => {
        resolve();
      })
      .fail(() => {
        reject();
      });
  });

export default saveCategories;
