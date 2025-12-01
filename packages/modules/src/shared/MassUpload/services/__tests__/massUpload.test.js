import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getTSOEvents';
import { axios } from '@kitman/common/src/utils/services';
import massUpload from '../massUpload';

describe('massUpload', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the correct endpoint, with the correct data', async () => {
    const response = await massUpload(1, 'test_import');

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith('/settings/mass_upload/create', {
      id: 1,
      import_type: 'test_import',
    });
  });
});
