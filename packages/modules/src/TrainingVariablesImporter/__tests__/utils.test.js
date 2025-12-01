import { getTitle } from '../utils';

describe('utils', () => {
  describe('getTitle()', () => {
    it('returns a correct title', () => {
      expect(getTitle()).toEqual('Import a training data CSV file');
    });
  });
});
