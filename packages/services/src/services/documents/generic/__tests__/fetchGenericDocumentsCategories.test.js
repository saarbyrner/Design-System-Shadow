import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';
import { axios } from '@kitman/common/src/utils/services';
import fetchGenericDocumentsCategories, {
  GENERIC_CATEGORIES_SEARCH_ENDPOINT,
  requestHeader,
} from '@kitman/services/src/services/documents/generic/redux/services/apis/fetchGenericDocumentsCategories';
import { ProductAreaValues } from '@kitman/services/src/services/documents/generic/redux/services/consts';

describe('fetchGenericDocumentsCategories', () => {
  let fetchGenericDocumentsCategoriesRequest;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    fetchGenericDocumentsCategoriesRequest = jest.spyOn(axios, 'get');

    const returnedData = await fetchGenericDocumentsCategories(
      ProductAreaValues.STAFF_PROFILE
    );

    expect(returnedData).toEqual(data);
    expect(fetchGenericDocumentsCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(fetchGenericDocumentsCategoriesRequest).toHaveBeenCalledWith(
      GENERIC_CATEGORIES_SEARCH_ENDPOINT,
      {
        params: {
          product_area: 'staff_profile',
        },
        headers: requestHeader,
      }
    );
  });

  it('calls the new endpoint - error response', async () => {
    fetchGenericDocumentsCategoriesRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await fetchGenericDocumentsCategories(ProductAreaValues.STAFF_PROFILE);
    }).rejects.toThrow();
  });
});
