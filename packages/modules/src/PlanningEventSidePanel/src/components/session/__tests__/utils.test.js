import { sessionTypeAndOptionSeparator } from '../constants';
import {
  stringifySessionTypeAndOption,
  getSessionThemeSubOptions,
} from '../utils';

describe('utils', () => {
  describe('stringifySessionTypeAndOption', () => {
    const tests = [
      // All arguments are valid.
      [
        'type and option aren’t null or undefined',
        `type${sessionTypeAndOptionSeparator}option`,
        ['type', 'option'],
      ],

      // All arguments are invalid.
      [
        'type and option are null and undefined',
        sessionTypeAndOptionSeparator,
        [null, undefined],
      ],
      [
        'type and option are falsy',
        `false${sessionTypeAndOptionSeparator}false`,
        [false, false],
      ],

      // Argument ‘type’ is invalid.
      [
        'option isn’t falsy and type is null',
        `${sessionTypeAndOptionSeparator}option`,
        [null, 'option'],
      ],
      [
        'option isn’t falsy and type is undefined',
        `${sessionTypeAndOptionSeparator}option`,
        [undefined, 'option'],
      ],
      [
        'option isn’t falsy and type is falsy',
        `false${sessionTypeAndOptionSeparator}option`,
        [false, 'option'],
      ],

      // Argument ‘option’ is invalid.
      [
        'type isn’t falsy and option is null',
        `type${sessionTypeAndOptionSeparator}`,
        ['type', null],
      ],
      [
        'type isn’t falsy and option is undefined',
        `type${sessionTypeAndOptionSeparator}`,
        ['type', undefined],
      ],
      [
        'type isn’t falsy and option is falsy',
        `type${sessionTypeAndOptionSeparator}false`,
        ['type', false],
      ],
    ];

    it.each(tests)('when %s, returns ‘%s’', (description, expected, args) =>
      expect(stringifySessionTypeAndOption(...args)).toEqual(expected)
    );
  });

  describe('getSessionThemeSubOptions', () => {
    it('maps argument ‘option’ correctly', () => {
      const option = { id: 1, name: 'name' };
      const type = 'type';

      expect(getSessionThemeSubOptions([option], type)).toStrictEqual([
        {
          ...option,
          value: `${type}${sessionTypeAndOptionSeparator}${option.id}`,
          label: option.name,
        },
      ]);
    });
  });
});
