// @flow
export const getFlagFrom2DigitCountryCode = (twoDigitCountryCode: string) => {
  // Decimal code: 127462 = REGIONAL INDICATOR SYMBOL LETTER A
  // Decimal code: 65	 = UPPERCASE LETTER A
  // regionalIndicatorOffset = 127462 - 65 = 127397.
  // When add the code for regular uppercase letter to regionalIndicatorOffset
  // we get the corresponding REGIONAL INDICATOR SYMBOL LETTER
  // 2 REGIONAL INDICATOR SYMBOL LETTERS make the flag emoji
  // https://en.wikipedia.org/wiki/Regional_indicator_symbol

  const regionalIndicatorOffset = 127397;
  const codePoints = twoDigitCountryCode
    .toUpperCase()
    .split('')
    .map((char) => regionalIndicatorOffset + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
