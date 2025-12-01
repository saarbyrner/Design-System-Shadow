// flow
import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/sendElectronicFile.mock';
import { data as mockContact } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/createContact.mock';
import sendElectronicFile, {
  endpoint,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/sendElectronicFile';

const mockElectronicFile = {
  subject: 'Just a test subject',
  message: 'just a test message',
  include_cover_page: true,
  contacts_attributes: [mockContact],
  attachment_ids: [],
  medical_document_ids: [931],
};

describe('sendElectronicFile', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await sendElectronicFile(mockElectronicFile);

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
      await sendElectronicFile(response.data);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(endpoint, response.data);
    });
  });
});
