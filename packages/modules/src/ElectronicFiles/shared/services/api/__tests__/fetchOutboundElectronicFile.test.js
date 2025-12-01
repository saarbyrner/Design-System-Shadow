// flow
import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import fetchOutboundElectronicFile, {
  generateEndpointUrl,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchOutboundElectronicFile';

const filters = {
  query: '',
  status: null,
  start_date: null,
  end_date: null,
  archived: false,
  per_page: 30,
  page: 1,
};

describe('fetchOutboundElectronicFile', () => {
  it('calls the correct endpoint and returns the correct value when filters != null', async () => {
    const returnedData = await fetchOutboundElectronicFile({
      id: 1,
      filters,
    });

    expect(returnedData).toEqual(response.data);
  });

  it('calls the correct endpoint and returns the correct value when filters = null', async () => {
    const returnedData = await fetchOutboundElectronicFile({
      id: 1,
      filters: null,
    });

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let postRequest;
    let getRequest;
    beforeEach(() => {
      getRequest = jest.spyOn(axios, 'get');
      postRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request when filters != null', async () => {
      await fetchOutboundElectronicFile({ id: 1, filters });

      expect(postRequest).toHaveBeenCalledTimes(1);
      expect(postRequest).toHaveBeenCalledWith(generateEndpointUrl(1), {
        filters,
      });
    });

    it('calls the correct endpoint with correct body data in the request when filters = null', async () => {
      await fetchOutboundElectronicFile({ id: 1, filters: null });

      expect(getRequest).toHaveBeenCalledTimes(1);
      expect(getRequest).toHaveBeenCalledWith(generateEndpointUrl(1));
    });
  });
});
