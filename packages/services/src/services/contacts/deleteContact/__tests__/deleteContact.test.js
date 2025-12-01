import { axios } from '@kitman/common/src/utils/services';
import { GAME_CONTACTS } from '../../updateContact';

import deleteContact from '..';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    patch: jest.fn(),
  },
}));

describe('deleteContact', () => {
  const id = 1;
  const archived = true;
  const mockResponse = { success: true };

  beforeEach(() => {
    axios.patch.mockResolvedValue({ data: mockResponse });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the correct URL with the payload', async () => {
    await deleteContact({ id, archived });
    expect(axios.patch).toHaveBeenCalledWith(`${GAME_CONTACTS}/${id}`, {
      archived,
    });
  });

  it('should return the response data', async () => {
    const result = await deleteContact({ id, archived });
    expect(result).toEqual(mockResponse);
  });
});
