import lodash from 'lodash';

import { getObjectKeysTransformer } from '../objectKeysTransformers';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  camelCase: jest.fn(jest.requireActual('lodash').camelCase),
}));

describe('objectKeysTransformer', () => {
  describe('getObjectKeysTransformer()', () => {
    // These tests can be quite verbose, please separate each test with an empty
    // line.
    const tests = [
      {
        description: 'handles a top-level object correctly',
        input: {},
        expectedSnake: {},
        expectedCamel: {},
        expectedKebab: {},
        expectedStart: {},
        expectedLower: {},
        expectedUpper: {},
      },

      {
        description: 'handles a top-level array correctly',
        input: [],
        expectedSnake: [],
        expectedCamel: [],
        expectedKebab: [],
        expectedStart: [],
        expectedLower: [],
        expectedUpper: [],
      },

      {
        description:
          'handles a top-level object with nested objects and arrays correctly',
        input: {
          // Test snake case.
          firstObject: {
            // Test camel case.
            first_array: [
              {
                // Test kebab case.
                secondObject: {
                  // Test start case.
                  secondArray: [
                    {
                      // Test lower case.
                      ThirdObject: {
                        // Test upper case.
                        thirdArray: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        expectedSnake: {
          first_object: {
            first_array: [
              {
                second_object: {
                  second_array: [
                    {
                      third_object: {
                        third_array: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        expectedCamel: {
          firstObject: {
            firstArray: [
              {
                secondObject: {
                  secondArray: [
                    {
                      thirdObject: {
                        thirdArray: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        expectedKebab: {
          'first-object': {
            'first-array': [
              {
                'second-object': {
                  'second-array': [
                    {
                      'third-object': {
                        'third-array': [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        expectedStart: {
          'First Object': {
            'First Array': [
              {
                'Second Object': {
                  'Second Array': [
                    {
                      'Third Object': {
                        'Third Array': [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        expectedLower: {
          'first object': {
            'first array': [
              {
                'second object': {
                  'second array': [
                    {
                      'third object': {
                        'third array': [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        expectedUpper: {
          'FIRST OBJECT': {
            'FIRST ARRAY': [
              {
                'SECOND OBJECT': {
                  'SECOND ARRAY': [
                    {
                      'THIRD OBJECT': {
                        'THIRD ARRAY': [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },

      {
        description:
          'handles a top-level array with nested objects and arrays correctly',
        input: {
          // Test snake case.
          firstArray: [
            {
              // Test camel case.
              first_object: {
                // Test kebab case.
                secondObject: {
                  // Test start case.
                  secondArray: [
                    {
                      // Test lower case.
                      ThirdObject: {
                        // Test upper case.
                        thirdArray: [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        expectedSnake: {
          first_array: [
            {
              first_object: {
                second_object: {
                  second_array: [
                    {
                      third_object: {
                        third_array: [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        expectedCamel: {
          firstArray: [
            {
              firstObject: {
                secondObject: {
                  secondArray: [
                    {
                      thirdObject: {
                        thirdArray: [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        expectedKebab: {
          'first-array': [
            {
              'first-object': {
                'second-object': {
                  'second-array': [
                    {
                      'third-object': {
                        'third-array': [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        expectedStart: {
          'First Array': [
            {
              'First Object': {
                'Second Object': {
                  'Second Array': [
                    {
                      'Third Object': {
                        'Third Array': [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        expectedLower: {
          'first array': [
            {
              'first object': {
                'second object': {
                  'second array': [
                    {
                      'third object': {
                        'third array': [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        expectedUpper: {
          'FIRST ARRAY': [
            {
              'FIRST OBJECT': {
                'SECOND OBJECT': {
                  'SECOND ARRAY': [
                    {
                      'THIRD OBJECT': {
                        'THIRD ARRAY': [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },

      {
        description: 'handles all falsy data types correctly correctly',
        input: {
          boolean: false,
          number: 0,
          string: '',
          null: null,
          undefined,
        },
        expectedSnake: {
          boolean: false,
          number: 0,
          string: '',
          null: null,
          undefined,
        },
        expectedCamel: {
          boolean: false,
          number: 0,
          string: '',
          null: null,
          undefined,
        },
        expectedKebab: {
          boolean: false,
          number: 0,
          string: '',
          null: null,
          undefined,
        },
        expectedStart: {
          Boolean: false,
          Number: 0,
          String: '',
          Null: null,
          Undefined: undefined,
        },
        expectedLower: {
          boolean: false,
          number: 0,
          string: '',
          null: null,
          undefined,
        },
        expectedUpper: {
          BOOLEAN: false,
          NUMBER: 0,
          STRING: '',
          NULL: null,
          UNDEFINED: undefined,
        },
      },

      {
        description: 'handles all truthy data types correctly correctly',
        input: {
          boolean: true,
          number: 1,
          string: 's',
        },
        expectedSnake: {
          boolean: true,
          number: 1,
          string: 's',
        },
        expectedCamel: {
          boolean: true,
          number: 1,
          string: 's',
        },
        expectedKebab: {
          boolean: true,
          number: 1,
          string: 's',
        },
        expectedStart: {
          Boolean: true,
          Number: 1,
          String: 's',
        },
        expectedLower: {
          boolean: true,
          number: 1,
          string: 's',
        },
        expectedUpper: {
          BOOLEAN: true,
          NUMBER: 1,
          STRING: 's',
        },
      },

      {
        description: 'handles a boolean correctly',
        input: true,
        expectedSnake: true,
        expectedCamel: true,
        expectedKebab: true,
        expectedStart: true,
        expectedLower: true,
        expectedUpper: true,
      },

      {
        description: 'handles a number correctly',
        input: 1,
        expectedSnake: 1,
        expectedCamel: 1,
        expectedKebab: 1,
        expectedStart: 1,
        expectedLower: 1,
        expectedUpper: 1,
      },

      {
        description: 'handles a string correctly',
        input: 's',
        expectedSnake: 's',
        expectedCamel: 's',
        expectedKebab: 's',
        expectedStart: 's',
        expectedLower: 's',
        expectedUpper: 's',
      },

      {
        description: 'handles null correctly',
        input: null,
        expectedSnake: null,
        expectedCamel: null,
        expectedKebab: null,
        expectedStart: null,
        expectedLower: null,
        expectedUpper: null,
      },

      {
        description: 'handles undefined correctly',
        input: undefined,
        expectedSnake: undefined,
        expectedCamel: undefined,
        expectedKebab: undefined,
        expectedStart: undefined,
        expectedLower: undefined,
        expectedUpper: undefined,
      },
    ];

    const test = ({
      input,
      expectedSnake,
      expectedCamel,
      expectedKebab,
      expectedStart,
      expectedLower,
      expectedUpper,
    }) => {
      expect(getObjectKeysTransformer(lodash.snakeCase)(input)).toEqual(
        expectedSnake
      );
      expect(getObjectKeysTransformer(lodash.camelCase)(input)).toEqual(
        expectedCamel
      );
      expect(getObjectKeysTransformer(lodash.kebabCase)(input)).toEqual(
        expectedKebab
      );
      expect(getObjectKeysTransformer(lodash.startCase)(input)).toEqual(
        expectedStart
      );
      expect(getObjectKeysTransformer(lodash.lowerCase)(input)).toEqual(
        expectedLower
      );
      expect(getObjectKeysTransformer(lodash.upperCase)(input)).toEqual(
        expectedUpper
      );
    };

    it.each(tests)('$description', test);
  });
});
