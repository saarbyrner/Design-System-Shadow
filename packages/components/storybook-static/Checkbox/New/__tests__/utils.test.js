import { getCheckmarkStyles } from '../utils';
import { styles } from '../style';

const baseArgument = {
  isChecked: false,
  isIndeterminate: false,
  isDisabled: false,
  isInvalid: false,
  isFocused: false,
};

const uncheckedCheckmarkTests = [
  [
    {
      ...baseArgument,
    },
    {
      css: [styles.unchecked],
      className: '',
    },
  ],
  [
    {
      ...baseArgument,
      isDisabled: true,
    },
    {
      css: [styles.unchecked, styles.disabled],
      className: '',
    },
  ],
  [
    {
      ...baseArgument,
      isFocused: true,
    },
    {
      css: [styles.unchecked, styles.focused],
      className: '',
    },
  ],
  [
    {
      ...baseArgument,
      isInvalid: true,
    },
    {
      css: [styles.unchecked, styles.invalid],
      className: '',
    },
  ],
];

const indeterminateCheckmarkTests = [
  [
    {
      ...baseArgument,
      isIndeterminate: true,
    },
    {
      css: [styles.indeterminate],
      className: 'icon-indeterminate-checkmark',
    },
  ],
  [
    {
      ...baseArgument,
      isIndeterminate: true,
      isDisabled: true,
    },
    {
      css: [styles.indeterminate, styles.disabled],
      className: 'icon-indeterminate-checkmark',
    },
  ],
  [
    {
      ...baseArgument,
      isIndeterminate: true,
      isFocused: true,
    },
    {
      css: [styles.indeterminate, styles.focused],
      className: 'icon-indeterminate-checkmark',
    },
  ],
  [
    {
      ...baseArgument,
      isIndeterminate: true,
      isInvalid: true,
    },
    {
      css: [styles.indeterminate, styles.invalid],
      className: 'icon-indeterminate-checkmark',
    },
  ],
];

const checkedCheckmarkTests = [
  [
    {
      ...baseArgument,
      isChecked: true,
    },
    {
      css: [styles.checked],
      className: 'icon-checked-checkmark',
    },
  ],
  [
    {
      ...baseArgument,
      isChecked: true,
      isDisabled: true,
    },
    {
      css: [styles.checked, styles.disabled],
      className: 'icon-checked-checkmark',
    },
  ],
  [
    {
      ...baseArgument,
      isChecked: true,
      isFocused: true,
    },
    {
      css: [styles.checked, styles.focused],
      className: 'icon-checked-checkmark',
    },
  ],
  [
    {
      ...baseArgument,
      isChecked: true,
      isInvalid: true,
    },
    {
      css: [styles.checked, styles.invalid],
      className: 'icon-checked-checkmark',
    },
  ],
];

const tests = [
  ...uncheckedCheckmarkTests,
  ...indeterminateCheckmarkTests,
  ...checkedCheckmarkTests,
];

describe('getCheckmarkStyles', () => {
  describe.each(tests)('when the argument is %o', (argument, expected) => {
    it('returns expected styles', () =>
      expect(getCheckmarkStyles(argument)).toEqual(expected));
  });
});
