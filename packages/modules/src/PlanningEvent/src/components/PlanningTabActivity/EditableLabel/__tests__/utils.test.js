import {
  getInputElementStyles,
  getInputControlsStyles,
  inputTypes,
} from '../utils';
import style from '../style';

const getInputElementStylesTests = [
  [{ isFocused: false }, []],
  [{ isFocused: true }, [style.focusedInputElement]],
];
describe('getInputElementStyles()', () => {
  describe.each(getInputElementStylesTests)(
    'when the argument is %o',
    (argument, expected) => {
      it('returns expected styles', () =>
        expect(getInputElementStyles(argument)).toEqual(expected));
    }
  );
});

const getInputControlsStylesTests = [
  [{ inputType: inputTypes.Input }, []],
  [{ inputType: inputTypes.Textarea }, [style.alignItemsStart]],
  [{ inputType: inputTypes.Select }, [style.select]],
];
describe('getInputContolsStyles()', () => {
  describe.each(getInputControlsStylesTests)(
    'when the argument is %o',
    (argument, expected) => {
      it('returns expected styles', () =>
        expect(getInputControlsStyles(argument)).toEqual(expected));
    }
  );
});
