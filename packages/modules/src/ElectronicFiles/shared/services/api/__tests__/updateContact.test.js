// flow
import { axios } from '@kitman/common/src/utils/services';
import {
  data,
  response,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateContact.mock';
import updateContact, {
  generateEndpointUrl,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateContact';

const mockContact = {
  id: data.id,
  first_name: data.first_name,
  last_name: data.last_name,
  company_name: data.company_name,
  fax_number: data.fax_number.number_international,
};

describe('createContact', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateContact(mockContact);

    expect(returnedData).toEqual(response.data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'put');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await updateContact(mockContact);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(generateEndpointUrl(1), mockContact);
    });
  });
});
