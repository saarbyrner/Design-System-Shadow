// flow
import { axios } from '@kitman/common/src/utils/services';
import {
  data,
  response,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/createContact.mock';
import createContact, {
  endpoint,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/createContact';

const mockContact = {
  first_name: data.first_name,
  last_name: data.last_name,
  company_name: data.company_name,
  fax_number: data.fax_number.number_international,
};

describe('createContact', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createContact(mockContact);

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
      await createContact(mockContact);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint, mockContact);
    });
  });
});
