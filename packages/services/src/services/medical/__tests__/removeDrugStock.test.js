import $ from 'jquery';
import removeDrugStock from '../removeDrugStock';

describe('removeDrugStock', () => {
  let removeDrugStockRequest;

  const formState = {
    removalReason: 'expired',
    quantity: 14,
    noteContent: 'Doctor lost the supply',
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    removeDrugStockRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve());
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    await removeDrugStock(99, formState);

    expect(removeDrugStockRequest).toHaveBeenCalledTimes(1);

    expect(removeDrugStockRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      url: '/medical/stocks/remove',
      data: JSON.stringify({
        stock_lot_id: 99,
        quantity: formState.quantity,
        reason: formState.removalReason,
        note: formState.noteContent,
      }),
    });
  });
});
