// flow
import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateContactsArchived.mock';
import updateContactsArchived from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateContactsArchived';

const mockUpdateContactsArchived = {
  archived: true,
  contactIds: [1],
};

describe('updateContactsArchived', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateContactsArchived(
      mockUpdateContactsArchived
    );

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
      await updateContactsArchived(mockUpdateContactsArchived);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/efax/contacts/archive', {
        contact_ids: [1],
        archived: true,
      });
    });
  });
});
