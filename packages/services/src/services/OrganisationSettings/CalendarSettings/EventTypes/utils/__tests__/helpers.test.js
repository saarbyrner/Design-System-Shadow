import { customEventTypesUrlBase } from '../consts';
import { createUpdateEventTypesUrl } from '../helpers';

describe('helpers', () => {
  describe('createUpdateEventTypesUrl', () => {
    it('should create the URL properly', () => {
      const id = 1;
      expect(createUpdateEventTypesUrl(id)).toEqual(
        `${customEventTypesUrlBase}/${id}`
      );
    });
  });
});
