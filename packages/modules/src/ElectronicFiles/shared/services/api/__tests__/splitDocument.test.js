// flow
import { axios } from '@kitman/common/src/utils/services';
import {
  data,
  response,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/splitDocument.mock';
import splitDocument, {
  generateEndpointUrl,
} from '@kitman/modules/src/ElectronicFiles/shared/services/api/splitDocument';

const mockSplitConfig = {
  allocations_attributes: [
    {
      range: data.efax_allocations?.range,
      athlete_id: data.efax_allocations?.athlete_id,
      category_ids: data.efax_allocations?.category_ids,
      document_date: data.efax_allocations?.document_date,
      file_name: data.efax_allocations?.file_name,
    },
  ],
};

describe('splitDocument', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await splitDocument({
      id: 1,
      splitConfig: mockSplitConfig,
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
      await splitDocument({ id: 1, splitConfig: mockSplitConfig });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(generateEndpointUrl(1), {
        allocations_attributes: mockSplitConfig,
      });
    });
  });
});
