import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { createSquadsText } from '../table-helpers';

describe('table-helpers', () => {
  const t = i18nextTranslateStub();
  describe('createSquadsText', () => {
    it('should interpolate the squads properly', () => {
      const firstName = 'Name1';
      const secondName = 'Name2';
      const squads = [firstName, secondName];
      expect(createSquadsText(squads, t)).toEqual(
        `2 - ${firstName}, ${secondName}`
      );
    });
    it('should return the empty squads message', () => {
      const squads = [];
      expect(createSquadsText(squads, t)).toEqual('No squads selected.');
    });
  });
});
