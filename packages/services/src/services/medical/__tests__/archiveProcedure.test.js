import { axios } from '@kitman/common/src/utils/services';
import data from '../../../mocks/handlers/medical/procedures/data.mock';
import archiveProcedure from '../archiveProcedure';

describe('archiveProcedure', () => {
  const procedure = data.procedures[0];
  let archiveProcedureRequest;

  beforeEach(() => {
    archiveProcedureRequest = jest
      .spyOn(axios, 'patch')
      .mockImplementation(() => {
        return new Promise((resolve) => resolve({ data: procedure }));
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const archiveReasonId = 2;
    const returnedData = await archiveProcedure(procedure.id, archiveReasonId);

    expect(returnedData).toEqual(procedure);

    expect(archiveProcedureRequest).toHaveBeenCalledTimes(1);
    expect(archiveProcedureRequest).toHaveBeenCalledWith(
      `/medical/procedures/${procedure.id}/archive`,
      {
        archive_reason_id: 2,
      }
    );
  });
});
