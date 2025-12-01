// flow
import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateViewed.mock';
import updateViewed from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateViewed';

const mockUpdateViewed = {
  viewed: true,
  inboundElectronicFileIds: [1],
};

describe('updateViewed', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateViewed(mockUpdateViewed);

    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await updateViewed(mockUpdateViewed);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/efax/inbound_faxes/update_viewed',
        { inbound_fax_ids: [1], viewed: true }
      );
    });
  });
});
