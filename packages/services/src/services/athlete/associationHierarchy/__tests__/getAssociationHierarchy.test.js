import { axios } from '@kitman/common/src/utils/services';
import getAssociationHierarchy from '../getAssociationHierarchy';
import { mock } from '../mock';

describe('getAssociationHierarchy', () => {
  describe('actual response', () => {
    it('returns the correct data', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mock });

      const result = await getAssociationHierarchy();

      expect(result).toEqual(mock);
    });
  });

  describe('axios call', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'get').mockResolvedValue({ data: mock });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      await getAssociationHierarchy();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenLastCalledWith(
        '/ui/organisation/athletes/association_hierarchy'
      );
    });
  });
});
