import { axios } from '@kitman/common/src/utils/services';

import { deleteEventImport } from '../delete';

describe('deleteEventImport', () => {
  beforeAll(() => jest.spyOn(axios, 'delete').mockResolvedValue({}));

  it('calls the correct endpoint with the correct payload and headers', async () => {
    await deleteEventImport(42, 'random-data-generator');

    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      '/planning_hub/events/42/imports/clear_data_by_source',
      {
        data: { source: 'random-data-generator' },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  });

  it('resolves to void', async () => {
    await expect(deleteEventImport(1, 'abc')).resolves.toBeUndefined();
  });

  it('propagates errors from axios', async () => {
    axios.delete.mockRejectedValueOnce(new Error('boom'));
    await expect(deleteEventImport(99, 'xyz')).rejects.toThrow('boom');
  });
});
