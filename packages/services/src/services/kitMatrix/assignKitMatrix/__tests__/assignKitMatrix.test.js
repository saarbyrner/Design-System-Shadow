import { axios } from '@kitman/common/src/utils/services';
import assignKitMatrix from '../assignKitMatrix';
import mockKitMatrix from '../../createKitMatrix/mock';

describe('assignKitMatrix', () => {
  const eventId = 0;
  const kitMatrix = {
    kit_matrix_id: 1,
    ...mockKitMatrix,
  };
  const response = {
    id: 567,
    kind: 'player',
    kit_matrix_id: 1,
    kit_matrix: {},
  };
  let assignKitMatrixRequest;

  describe('when the request succeeds', () => {
    beforeEach(() => {
      assignKitMatrixRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call endpoint with the correct payload', async () => {
      axios.post.mockResolvedValue({ data: response });
      const result = await assignKitMatrix(eventId, kitMatrix);
      expect(assignKitMatrixRequest).toHaveBeenCalledWith(
        `/planning_hub/events/${eventId}/game_kit_matrices`,
        {
          kit_matrix_id: 1,
          kind: 'player',
        }
      );
      expect(result).toEqual(response);
    });
  });
  describe('when the request fails', () => {
    beforeEach(() => {
      assignKitMatrixRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(assignKitMatrix(eventId, kitMatrix)).rejects.toThrow();
    });
  });
});
