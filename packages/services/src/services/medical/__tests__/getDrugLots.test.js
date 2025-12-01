import { axios } from '@kitman/common/src/utils/services';
import { mockedDrugLots } from '@kitman/services/src/mocks/handlers/medical/stockManagement/data.mock';
import getDrugLots from '../getDrugLots';

describe('getDrugLots', () => {
  let getDrugLotsRequest;

  beforeEach(() => {
    getDrugLotsRequest = jest.spyOn(axios, 'post');
  });

  it('calls the correct endpoint with filters and returns the correct value', async () => {
    //  filters
    const filters = {
      search_expression: 'ibuprofen',
      expiration_date: { start: '2022-02-20', end: '2022-02-21' },
      stock_drug_id: '90',
    };

    const returnedData = await getDrugLots(filters);

    expect(returnedData).toEqual(mockedDrugLots);
    expect(getDrugLotsRequest).toHaveBeenCalledTimes(1);

    // filters are optional
    expect(getDrugLotsRequest).toHaveBeenCalledWith(
      '/medical/stocks/search_lots',
      { ...filters },
      {}
    );
  });

  it('calls the correct endpoint with filters and cancellation (abortSignal) and returns the correct value', async () => {
    //  filters
    const filters = {
      search_expression: 'ibuprofen',
      expiration_date: { start: '2022-02-20', end: '2022-02-21' },
      stock_drug_id: '90',
    };

    const controller = new AbortController();

    const returnedData = await getDrugLots(filters, null, controller.signal);

    expect(returnedData).toEqual(mockedDrugLots);
    expect(getDrugLotsRequest).toHaveBeenCalledTimes(1);

    // filters are optional
    expect(getDrugLotsRequest).toHaveBeenCalledWith(
      '/medical/stocks/search_lots',
      { ...filters },
      { signal: controller.signal }
    );
  });
});
