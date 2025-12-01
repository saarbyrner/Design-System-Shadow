import { axios } from '@kitman/common/src/utils/services';
import { data as mockedSavedDrugStock } from '@kitman/services/src/mocks/handlers/medical/stockManagement/saveDrugStock';
import saveDrugStock from '../saveDrugStock';

describe('saveDrugStock', () => {
  const stockDetails = {
    drug: {
      label: 'Ibuprofen 400mg',
      value: '21',
      id: 21,
      drug_type: 'FdbDispensableDrug',
    },
    lotNumber: 90210,
    expirationDate: '2023-02-26',
    quantity: 865,
  };

  describe('Handler response', () => {
    it('returns an object of the favorite details', async () => {
      const returnedData = await saveDrugStock(
        stockDetails,
        'FdbDispensableDrug'
      );
      expect(returnedData).toEqual(mockedSavedDrugStock);
    });
  });

  describe('Axios mocked', () => {
    let saveDrugStockRequest;

    beforeEach(() => {
      saveDrugStockRequest = jest
        .spyOn(axios, 'post')
        .mockResolvedValue({ data: mockedSavedDrugStock });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await saveDrugStock(stockDetails);
      expect(returnedData).toEqual(mockedSavedDrugStock);
      expect(saveDrugStockRequest).toHaveBeenCalledTimes(1);

      expect(saveDrugStockRequest).toHaveBeenCalledWith('/medical/stocks/add', {
        drug: {
          type: 'FdbDispensableDrug',
          id: '21',
        },
        lot_number: 90210,
        expiration_date: '2023-02-26',
        quantity: 865,
      });
    });

    it('calls the correct endpoint with drugType if supplied', async () => {
      const returnedData = await saveDrugStock(
        stockDetails,
        'Emr::Private::Models::NhsDmdDrug'
      );
      expect(returnedData).toEqual(mockedSavedDrugStock);
      expect(saveDrugStockRequest).toHaveBeenCalledTimes(1);

      expect(saveDrugStockRequest).toHaveBeenCalledWith('/medical/stocks/add', {
        drug: {
          type: 'Emr::Private::Models::NhsDmdDrug',
          id: '21',
        },
        lot_number: 90210,
        expiration_date: '2023-02-26',
        quantity: 865,
      });
    });
  });
});
