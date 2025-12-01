import { parseFromLocation } from '@kitman/modules/src/ElectronicFiles/shared/routes/utils';

describe('utils', () => {
  describe('parseIdFromLocation', () => {
    it('returns correct data when url is inbound', () => {
      const urlParts = parseFromLocation('/efile/inbox/123');
      expect(urlParts).toEqual({
        selectedMenuItem: 'inbox',
        id: '123',
      });
    });

    it('returns correct data when url is outbound', () => {
      const urlParts = parseFromLocation('/efile/sent/456');
      expect(urlParts).toEqual({
        selectedMenuItem: 'sent',
        id: '456',
      });
    });
  });
});
