// disclaimerUtils.test.js

import { getDisclaimerContent, DISCLAIMER_TYPE } from '../utils/index';

describe('getDisclaimerContent', () => {
  it('returns NFL player disclaimer content on load', () => {
    const disclaimerType = DISCLAIMER_TYPE.NFL_PLAYER_DISCLAIMER_ON_LOAD;
    const result = getDisclaimerContent(disclaimerType);

    expect(result).toEqual({
      title: 'Disclaimer',
      content: expect.any(Object),
      footerButtonText: 'I agree',
    });
  });

  it('returns NFL player disclaimer content on export', () => {
    const disclaimerType = DISCLAIMER_TYPE.NFL_PLAYER_DISCLAIMER_ON_EXPORT;
    const result = getDisclaimerContent(disclaimerType);

    expect(result).toEqual({
      title: 'Disclaimer',
      content: expect.any(Object),
      footerButtonText: 'I acknowledge',
    });
  });

  it('returns an empty object for unknown disclaimer types', () => {
    const unknownDisclaimerType = 'UNKNOWN_DISCLAIMER_TYPE';
    const result = getDisclaimerContent(unknownDisclaimerType);

    expect(result).toEqual({});
  });
});
