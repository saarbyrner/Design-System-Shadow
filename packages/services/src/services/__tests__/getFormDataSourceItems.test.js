import { axios } from '@kitman/common/src/utils/services';
import {
  countries,
  timezones,
  medicalDocumentCategories,
} from '@kitman/services/src/mocks/handlers/getFormDataSourceItems';
import getFormDataSourceItems from '../getFormDataSourceItems';

describe('getFormDataSourceItems', () => {
  let getFormDataSourceItemsRequest;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the correct values for countries', async () => {
    const returnedData = await getFormDataSourceItems('countries');
    expect(returnedData).toEqual(countries);
  });

  it('returns the correct values for timezones', async () => {
    const returnedData = await getFormDataSourceItems('timezones');
    expect(returnedData).toEqual(timezones);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      getFormDataSourceItemsRequest = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint for medical_document_categories and returns the correct value', async () => {
      const returnedData = await getFormDataSourceItems(
        'medical_document_categories'
      );
      expect(returnedData).toEqual(medicalDocumentCategories);

      expect(getFormDataSourceItemsRequest).toHaveBeenCalledTimes(1);
      expect(getFormDataSourceItemsRequest).toHaveBeenCalledWith(
        '/forms/form_elements/data_source_items?data_source=medical_document_categories'
      );
    });
  });
});
