import $ from 'jquery';
import { mockDrugs } from '../../../../../modules/src/Medical/shared/components/AddMedicationSidePanel/mocks/mockData';
import getStockMedications from '../getStockMedications';

describe('getStockMedications', () => {
  let getStockMedicationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getStockMedicationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockDrugs));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getStockMedications('ibuprofen');
    expect(returnedData).toEqual(mockDrugs);

    expect(getStockMedicationsRequest).toHaveBeenCalledTimes(1);
    expect(getStockMedicationsRequest).toHaveBeenCalledWith({
      contentType: 'application/json',
      method: 'POST',
      url: '/medical/stocks/search_stock_drugs',
    });
  });
});
