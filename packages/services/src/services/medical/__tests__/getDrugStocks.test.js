import $ from 'jquery';
import { mockedDrugStocks } from '@kitman/services/src/mocks/handlers/medical/stockManagement/data.mock';
import getDrugStocks from '../getDrugStocks';

describe('getDrugStocks', () => {
  let getDrugStocksRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getDrugStocksRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedDrugStocks));
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDrugStocks('ibuprofen');
    expect(returnedData).toEqual(mockedDrugStocks);
    expect(getDrugStocksRequest).toHaveBeenCalledTimes(1);

    expect(getDrugStocksRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/fdb/dispensable_drugs',
      data: {
        search_expression: 'ibuprofen',
      },
    });
  });
});
