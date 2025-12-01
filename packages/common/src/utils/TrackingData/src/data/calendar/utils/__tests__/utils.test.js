import { parseRepeatEventFrequency } from '../index';

describe('utils', () => {
  describe('parseRepeatEventFrequency', () => {
    it('should return "custom" if custom rule', () => {
      const mockRule = 'FREQ=WEEKLY;UNTIL=20240516';

      expect(parseRepeatEventFrequency(mockRule)).toEqual('Custom');
    });

    it('should return "Daily" if daily rule', () => {
      const mockRule = 'FREQ=DAILY';

      expect(parseRepeatEventFrequency(mockRule)).toEqual('Daily');
    });

    it('should return "Weekly" if weekly rule', () => {
      const mockRule = 'FREQ=WEEKLY';

      expect(parseRepeatEventFrequency(mockRule)).toEqual('Weekly');
    });

    it('should return "Monthly" if monthly rule', () => {
      const mockRule = 'FREQ=MONTHLY';

      expect(parseRepeatEventFrequency(mockRule)).toEqual('Monthly');
    });

    it('should return "Yearly" if yearly rule', () => {
      const mockRule = 'FREQ=YEARLY';

      expect(parseRepeatEventFrequency(mockRule)).toEqual('Yearly');
    });

    it(`should return "Doesn't repeat" if no rule`, () => {
      const mockRule = null;

      expect(parseRepeatEventFrequency(mockRule)).toEqual(`Doesn't repeat`);
    });
  });
});
