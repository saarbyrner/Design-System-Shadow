import { axios } from '@kitman/common/src/utils/services';
import bulkUpdateKitMatrix from '..';

describe('bulkUpdateKitMatrix', () => {
  it('calls the correct endpoint with kit_matrix_ids and archived status', async () => {
    jest.spyOn(axios, 'patch');

    const result = await bulkUpdateKitMatrix({
      kit_matrix_ids: [12, 13, 14],
      archived: true,
    });

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices/bulk_update',
      {
        kit_matrix_ids: [12, 13, 14],
        archived: true,
      }
    );
    expect(result).toBeDefined();
  });

  it('handles archiving multiple kit matrices', async () => {
    jest.spyOn(axios, 'patch');

    await bulkUpdateKitMatrix({
      kit_matrix_ids: [1, 2, 3],
      archived: true,
    });

    expect(axios.patch).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices/bulk_update',
      {
        kit_matrix_ids: [1, 2, 3],
        archived: true,
      }
    );
  });

  it('handles unarchiving multiple kit matrices', async () => {
    jest.spyOn(axios, 'patch');

    await bulkUpdateKitMatrix({
      kit_matrix_ids: [5, 6],
      archived: false,
    });

    expect(axios.patch).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices/bulk_update',
      {
        kit_matrix_ids: [5, 6],
        archived: false,
      }
    );
  });
});
