import { axios } from '@kitman/common/src/utils/services';
import getArchiveReasons from '../getArchiveReasons';

describe('getArchiveReasons', () => {
  const archiveProcedureRequest = jest.spyOn(axios, 'get');

  it('calls the correct endpoint', async () => {
    await getArchiveReasons('procedures');

    expect(archiveProcedureRequest).toHaveBeenCalledTimes(1);
    expect(archiveProcedureRequest).toHaveBeenCalledWith(
      `/ui/archive_reasons`,
      {
        params: {
          entity: 'procedures',
        },
      }
    );
  });
});
