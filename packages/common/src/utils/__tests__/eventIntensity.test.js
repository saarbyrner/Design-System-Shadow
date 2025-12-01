import { intensities } from '@kitman/common/src/types/Event';
import { getIntensityTranslation } from '../eventIntensity';

const intensityNotAvailable = 'N/A';
const tests = [
  { argument: intensities.Light, returnValue: 'Light' },
  { argument: intensities.Moderate, returnValue: 'Moderate' },
  { argument: intensities.High, returnValue: 'High' },
  { argument: null, returnValue: intensityNotAvailable },
  { argument: undefined, returnValue: intensityNotAvailable },
  { argument: '', returnValue: intensityNotAvailable },
];

describe('getIntensityTranslation', () => {
  describe.each(tests)(
    'when the argument is $argument',
    ({ argument, returnValue }) => {
      it(`it returns ${returnValue}`, () => {
        expect(getIntensityTranslation(argument, (string) => string)).toEqual(
          returnValue
        );
      });
    }
  );
});
