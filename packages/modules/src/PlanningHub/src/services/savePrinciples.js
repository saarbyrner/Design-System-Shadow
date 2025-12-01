// @flow
import $ from 'jquery';
import type { EditPrinciples } from '@kitman/common/src/types/Principles';

const savePrinciples = async (principles: EditPrinciples) =>
  new Promise<void>((resolve: (value: any) => void, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/planning_hub/principles/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        principles,
      }),
    })
      .done(() => resolve())
      .fail(() => reject());
  });

export default savePrinciples;
