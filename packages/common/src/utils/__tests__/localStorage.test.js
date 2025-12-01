import { getFromLocalStorage, setInLocalStorage } from '../localStorage';

describe('localStorage', () => {
  afterEach(() => delete window.localStorage);

  describe('getFromLocalStorage()', () => {
    it.each([
      {
        description: 'gets an existing item by key',
        localStorage: {
          value: {
            getItem: jest.fn((key) => (key === 'key' ? '{"v": 1}' : undefined)),
          },
        },
        input: 'key',
        expected: { v: 1 },
      },
      {
        description: 'returns undefined if localStorage is undefined',
        localStorage: { value: undefined },
        input: 'key',
        expected: undefined,
      },
      {
        description: 'returns undefined if item doesn’t exist',
        localStorage: { value: { getItem: jest.fn(() => undefined) } },
        input: 'key',
        expected: undefined,
      },
      {
        description: 'returns raw value if it’s unparseable by JSON.parse',
        localStorage: {
          value: {
            getItem: jest.fn((key) => (key === 'key' ? 'value' : undefined)),
          },
        },
        input: 'key',
        expected: 'value',
      },
    ])('$description', ({ localStorage, input, expected }) => {
      Object.defineProperty(window, 'localStorage', {
        ...localStorage,
        configurable: true,
      });
      expect(getFromLocalStorage(input)).toEqual(expected);
    });
  });

  describe('setInLocalStorage()', () => {
    const objectWithCircularReference = {};
    objectWithCircularReference.self = objectWithCircularReference;

    const test = ({ localStorage, input, expectedValue, isLogExpected }) => {
      Object.defineProperty(window, 'localStorage', {
        ...localStorage,
        configurable: true,
      });

      if (isLogExpected) jest.spyOn(window.console, 'error');

      setInLocalStorage(...input);

      const setItem = window.localStorage?.setItem;
      if (expectedValue) {
        expect(setItem).toHaveBeenCalledWith(input[0], expectedValue);
      } else if (setItem) {
        expect(setItem).not.toHaveBeenCalled();
      }
      if (isLogExpected) {
        expect(console.error).toHaveBeenCalledTimes(1);
      }
    };

    it.each([
      {
        description: 'sets an item by key',
        localStorage: { value: { setItem: jest.fn() } },
        input: ['key', { v: 1 }],
        expectedValue: '{"v":1}',
      },
      {
        description: 'does nothing if localStorage.setItem is undefined',
        localStorage: { value: { setItem: undefined } },
        input: ['key', { v: 1 }],
        isLogExpected: true,
      },
      {
        description:
          'does nothing if value is unserializable by JSON.stringify',
        localStorage: { value: { setItem: jest.fn() } },
        input: ['key', objectWithCircularReference],
      },
    ])('$description', test);
  });
});
