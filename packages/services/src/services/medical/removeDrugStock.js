// @flow
import $ from 'jquery';
import type { FormState } from '@kitman/modules/src/StockManagement/src/hooks/useStockManagementForm';

// Remove drug stock, empty
const removeDrugStock = (
  stockLotId: number,
  formState: FormState
): Promise<void> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/medical/stocks/remove',
      contentType: 'application/json',
      data: JSON.stringify({
        stock_lot_id: stockLotId,
        quantity: formState.quantity,
        reason: formState.removalReason,
        note: formState.noteContent,
      }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default removeDrugStock;
