// flow
import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateArchived.mock';
import updateArchived from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateArchived';

const mockUpdateArchived = {
  archived: true,
  inboundElectronicFileIds: [1],
};

describe('updateArchived', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateArchived(mockUpdateArchived);

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
      await updateArchived(mockUpdateArchived);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/efax/inbound_faxes/archive', {
        inbound_fax_ids: [1],
        archived: true,
      });
    });
  });
});
