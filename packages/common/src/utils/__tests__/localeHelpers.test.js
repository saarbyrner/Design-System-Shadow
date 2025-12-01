/* eslint-disable no-useless-concat */
import { getFlagFrom2DigitCountryCode } from '../localeHelpers';

describe('localeHelpers', () => {
  describe('getFlagFrom2DigitCountryCode', () => {
    it('converts ISO country code to flag emoji', () => {
      expect(getFlagFrom2DigitCountryCode('IE')).toEqual(
        '\uD83C\uDDEE' + '\uD83C\uDDEA' // 🇮🇪
      );
      expect(getFlagFrom2DigitCountryCode('IE')).toEqual(
        String.fromCodePoint(127470, 127466) // 🇮🇪
      );

      expect(getFlagFrom2DigitCountryCode('US')).toEqual(
        '\ud83c\uddfa' + '\ud83c\uddf8' // 🇺🇸
      );
      expect(getFlagFrom2DigitCountryCode('US')).toEqual(
        String.fromCodePoint(127482, 127480) // 🇺🇸
      );

      expect(getFlagFrom2DigitCountryCode('GB')).toEqual(
        '\ud83c\uddec' + '\ud83c\udde7' // 🇬🇧
      );
      expect(getFlagFrom2DigitCountryCode('GB')).toEqual(
        String.fromCodePoint(127468, 127463) // 🇬🇧
      );
    });
  });
});
