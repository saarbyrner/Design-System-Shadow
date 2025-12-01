import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getTSOEvents';
import { axios } from '@kitman/common/src/utils/services';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import deleteMassUpload from '../deleteMassUpload';

describe('massUpload', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'delete')
      .mockResolvedValue({ data: 'G&M import deletion in progress' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the correct endpoint, with the correct data', async () => {
    const params = {
      attachmentId: 1,
      importType: IMPORT_TYPES.GrowthAndMaturation,
    };

    const response = await deleteMassUpload(params);

    expect(response).toEqual(serverResponse);
    expect(request).toHaveBeenCalledWith(
      `/settings/mass_upload/${params.attachmentId}/${params.importType}_import`
    );
  });
});
