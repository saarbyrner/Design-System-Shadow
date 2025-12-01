// flow
import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import fetchInboundElectronicFile, {
  generateEndpointUrl,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchInboundElectronicFile';

const filters = {
  query: '',
  status: null,
  start_date: null,
  end_date: null,
  archived: false,
  per_page: 30,
  page: 1,
};

describe('fetchInboundElectronicFile', () => {
  it('calls the correct endpoint and returns the correct value when filters != null', async () => {
    const returnedData = await fetchInboundElectronicFile({
      id: 1,
      filters,
    });

    expect(returnedData).toEqual(response.data);
  });

  it('calls the correct endpoint and returns the correct value when filters = null', async () => {
    const returnedData = await fetchInboundElectronicFile({
      id: 1,
      filters: null,
    });

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let postRequest;
    let getRequest;
    beforeEach(() => {
      postRequest = jest.spyOn(axios, 'post');
      getRequest = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request when filters != null', async () => {
      await fetchInboundElectronicFile({ id: 1, filters });

      expect(postRequest).toHaveBeenCalledTimes(1);
      expect(postRequest).toHaveBeenCalledWith(generateEndpointUrl(1), {
        filters,
      });
    });

    it('calls the correct endpoint with correct body data in the request when filters = null', async () => {
      await fetchInboundElectronicFile({ id: 1, filters: null });

      expect(getRequest).toHaveBeenCalledTimes(1);
      expect(getRequest).toHaveBeenCalledWith(generateEndpointUrl(1));
    });
  });
});
