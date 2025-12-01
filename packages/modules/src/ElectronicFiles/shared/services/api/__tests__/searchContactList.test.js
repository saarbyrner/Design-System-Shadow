// flow
import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchContactList.mock';
import {
  defaultFilters,
  defaultPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';
import searchContactList, {
  endpoint,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchContactList';

describe('searchContactList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchContactList({
      filters: defaultFilters,
      pagination: defaultPagination,
    });

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await searchContactList({
        filters: defaultFilters,
        pagination: defaultPagination,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint, {
        filters: defaultFilters,
        pagination: defaultPagination,
      });
    });
  });
});
