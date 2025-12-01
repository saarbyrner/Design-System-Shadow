import { axios } from '@kitman/common/src/utils/services';

import { deleteEventImports } from '../delete';

describe('deleteEventImports', () => {
  beforeAll(() => jest.spyOn(axios, 'delete').mockResolvedValue({}));

  it('calls the correct endpoint with no payload/config', async () => {
    await deleteEventImports(42);

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      '/planning_hub/events/42/imports/clear_data'
    );
  });

  it('resolves to void', async () => {
    await expect(deleteEventImports(1)).resolves.toBeUndefined();
  });

  it('propagates errors from axios', async () => {
    axios.delete.mockRejectedValueOnce(new Error('boom'));
    await expect(deleteEventImports(99)).rejects.toThrow('boom');
  });
});
