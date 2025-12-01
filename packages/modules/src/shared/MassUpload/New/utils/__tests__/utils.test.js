import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

import {
  getTitleLabels,
  getErrorStateTemplateConfig,
  getOptionalExpectedHeaders,
  getIntegrationImageMapping,
  chunkArray,
  mapHeaderKeysToColumnDef,
} from '../index';

describe('utils', () => {
  describe('getTitleLabels', () => {
    it('should match snapshot when eventType is "Game"', () => {
      expect(getTitleLabels('Game')).toMatchSnapshot();
    });

    it('should match snapshot when eventType is "Session"', () => {
      expect(getTitleLabels('Session')).toMatchSnapshot();
    });

    it('should match snapshot when eventType is null', () => {
      expect(getTitleLabels(null)).toMatchSnapshot();
    });
  });

  it('getErrorStateTemplateConfig', () => {
    expect(getErrorStateTemplateConfig()).toMatchSnapshot();
  });

  describe('getOptionalExpectedHeaders', () => {
    const tests = [
      ['returns an empty array when the input is empty', { expected: [] }, []],
      [
        'returns both `benchmarking_var` and `var` if the perma_id has `benchmarking_` prefix',
        { expected: ['benchmarking_var', 'var'] },
        [
          {
            description: 'desc1',
            id: 1,
            invert_scale: false,
            max: 10,
            min: 0,
            name: 'var1',
            perma_id: 'benchmarking_var',
            variable_type_id: 100,
          },
        ],
      ],
      [
        'returns both `g_and_m_abc` and `abc` for the `g_and_m_` prefix',
        { expected: ['g_and_m_abc', 'abc'] },
        [
          {
            description: 'desc2',
            id: 2,
            invert_scale: false,
            max: 50,
            min: 5,
            name: 'var2',
            perma_id: 'g_and_m_abc',
            variable_type_id: 101,
          },
        ],
      ],
      [
        'returns both `concussion_test` and `test` for the `concussion_` prefix',
        { expected: ['concussion_test', 'test'] },
        [
          {
            description: 'desc3',
            id: 3,
            invert_scale: true,
            max: 100,
            min: 10,
            name: 'var3',
            perma_id: 'concussion_test',
            variable_type_id: 102,
          },
        ],
      ],
      [
        'skips empty strings',
        { expected: [] },
        [
          {
            description: 'desc4',
            id: 4,
            invert_scale: false,
            max: 100,
            min: 0,
            name: 'var4',
            perma_id: '',
            variable_type_id: 103,
          },
        ],
      ],
      [
        'returns prefixed and unprefixed IDs for multiple variables of different prefixes',
        {
          expected: [
            'benchmarking_one',
            'one',
            'g_and_m_two',
            'two',
            'concussion_three',
            'three',
          ],
        },
        [
          {
            description: 'desc5',
            id: 5,
            invert_scale: false,
            max: 100,
            min: 0,
            name: 'var5',
            perma_id: 'benchmarking_one',
            variable_type_id: 104,
          },
          {
            description: 'desc6',
            id: 6,
            invert_scale: false,
            max: 200,
            min: 10,
            name: 'var6',
            perma_id: 'g_and_m_two',
            variable_type_id: 105,
          },
          {
            description: 'desc7',
            id: 7,
            invert_scale: false,
            max: 300,
            min: 20,
            name: 'var7',
            perma_id: 'concussion_three',
            variable_type_id: 106,
          },
        ],
      ],
      [
        'returns only one variable if no matching prefixes were found',
        {
          expected: [
            'NULL_one',
            'g_and_m_two',
            'two',
            'concussion_three',
            'three',
          ],
        },
        [
          {
            description: 'desc5',
            id: 5,
            invert_scale: false,
            max: 100,
            min: 0,
            name: 'var5',
            perma_id: 'NULL_one',
            variable_type_id: 104,
          },
          {
            description: 'desc6',
            id: 6,
            invert_scale: false,
            max: 200,
            min: 10,
            name: 'var6',
            perma_id: 'g_and_m_two',
            variable_type_id: 105,
          },
          {
            description: 'desc7',
            id: 7,
            invert_scale: false,
            max: 300,
            min: 20,
            name: 'var7',
            perma_id: 'concussion_three',
            variable_type_id: 106,
          },
        ],
      ],
    ];

    it.each(tests)('%s', (description, { expected }, input) => {
      const result = getOptionalExpectedHeaders(input);
      expect(result).toEqual(expected);
    });
  });

  describe('integrationImageMapping', () => {
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'admin.staging.com',
      },
      writable: true,
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('should return the correct mapping when on staging', () => {
      expect(getIntegrationImageMapping()).toMatchSnapshot();
    });

    it('should return the correct mapping when not on staging', () => {
      expect(getIntegrationImageMapping()).toMatchSnapshot();
    });
  });

  it('chunkArray', () => {
    expect(
      chunkArray([
        'athlete_1',
        'athlete_2',
        'athlete_3',
        'athlete_4',
        'athlete_5',
      ])
    ).toEqual([
      ['athlete_1', 'athlete_2', 'athlete_3'],
      ['athlete_4', 'athlete_5'],
    ]);
  });

  it('mapHeaderKeysToColumnDef', () => {
    const headerKeys = ['header_1', 'header_2', 'header_3'];
    const result = mapHeaderKeysToColumnDef(headerKeys);

    expect(result).toEqual(
      headerKeys.map((key) => ({
        id: key,
        row_key: key,
        content: <DefaultHeaderCell title={key} />,
      }))
    );
  });
});
