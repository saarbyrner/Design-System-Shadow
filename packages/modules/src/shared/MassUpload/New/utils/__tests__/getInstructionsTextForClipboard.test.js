import { IMPORT_TYPES } from '../consts';
import getInstructionsTextForClipboard from '../getInstructionsTextForClipboard';

describe('getInstructionsTextForClipboard', () => {
  it.each(Object.values(IMPORT_TYPES))(
    `should return the correct instructions text for %s`,
    (importType) =>
      expect(getInstructionsTextForClipboard(importType)).toMatchSnapshot()
  );
});
