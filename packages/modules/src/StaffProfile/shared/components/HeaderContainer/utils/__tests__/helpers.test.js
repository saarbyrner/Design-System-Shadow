import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';

import { getTitle } from '../helpers';

describe('helpers', () => {
  describe('getTitle', () => {
    const user = { fullname: 'Ash Ketchum' };
    const t = i18nextTranslateStub();
    it('should return the title for CREATE', () => {
      expect(getTitle({ mode: MODES.CREATE, user, t })).toEqual('Create staff');
    });

    describe('EDIT', () => {
      it('should return the title for a user', () => {
        expect(getTitle({ mode: MODES.EDIT, user, t })).toEqual(user.fullname);
      });

      it('should return the title for an undefined user', () => {
        expect(getTitle({ mode: MODES.EDIT, t })).toEqual('Edit staff');
      });
    });

    describe('VIEW', () => {
      it('should return the title for a user', () => {
        expect(getTitle({ mode: MODES.VIEW, user, t })).toEqual(user.fullname);
      });

      it('should return the title for an undefined user', () => {
        expect(getTitle({ mode: MODES.VIEW, t })).toEqual('View staff');
      });
    });
  });
});
