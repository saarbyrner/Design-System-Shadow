import {
  KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
  BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
} from '@kitman/common/src/consts/analysis';

import {
  formatAvailableVariables,
  formatAvailableVariablesForGroupedDropdown,
  formatAvailableVariablesForSelect,
  formatAvailableVariablesForGroupedSelect,
} from '../formatAvailableVariables';

describe('formatAvailableVariables', () => {
  it('returns an empty array when availableVariables is empty', () => {
    expect(formatAvailableVariables([])).toEqual([]);
  });

  it('includes the data source if the source is different than kitman or kitman:tv', () => {
    const variables = [
      {
        source_key: 'custom|dataname',
        name: 'dataname',
        source_name: 'Custom Data',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        id: 'custom|dataname',
        title: 'dataname ',
        description: 'Custom Data',
      },
    ];

    expect(formatAvailableVariables(variables)).toEqual(expectedVariables);
  });

  it("doesn't include the data source if the source is kitman", () => {
    const variables = [
      {
        source_key: 'kitman|dataname',
        name: 'dataname',
        source_name: 'Kitman',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        id: 'kitman|dataname',
        title: 'dataname ',
        description: '',
      },
    ];

    expect(formatAvailableVariables(variables)).toEqual(expectedVariables);
  });

  it("doesn't include the data source if the source is kitman:tv", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        id: 'kitman:tv|dataname',
        title: 'dataname ',
        description: '',
      },
    ];

    expect(formatAvailableVariables(variables)).toEqual(expectedVariables);
  });

  it('includes the data source if the source name is ‘Benchmark testing’', () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        id: 'kitman:tv|dataname',
        title: 'dataname ',
        description: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
      },
    ];

    expect(formatAvailableVariables(variables)).toEqual(expectedVariables);
  });

  it("doesn't include the data unit if not provided", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        id: 'kitman:tv|dataname',
        title: 'dataname ',
        description: '',
      },
    ];

    expect(formatAvailableVariables(variables)).toEqual(expectedVariables);
  });

  it('includes the data unit if existing', () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
        localised_unit: '%',
      },
    ];

    const expectedVariables = [
      {
        id: 'kitman:tv|dataname',
        title: 'dataname (%)',
        description: '',
      },
    ];

    expect(formatAvailableVariables(variables)).toEqual(expectedVariables);
  });
});

describe('formatAvailableVariablesForGroupedDropdown', () => {
  it('returns an empty array when availableVariables is empty', () => {
    expect(formatAvailableVariablesForGroupedDropdown([])).toEqual([]);
  });

  it('includes the data source if the source is different than kitman or kitman:tv', () => {
    const variables = [
      {
        source_key: 'custom|dataname',
        name: 'dataname',
        source_name: 'Custom Data',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        name: 'Custom Data',
        isGroupOption: true,
        description: 'Custom Data',
      },
      {
        key_name: 'custom|dataname',
        name: 'dataname ',
        description: 'Custom Data',
      },
    ];

    expect(formatAvailableVariablesForGroupedDropdown(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data source if the source is kitman", () => {
    const variables = [
      {
        source_key: 'kitman|dataname',
        name: 'dataname',
        source_name: 'Kitman',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        name: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        isGroupOption: true,
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
      {
        key_name: 'kitman|dataname',
        name: 'dataname ',
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
    ];

    expect(formatAvailableVariablesForGroupedDropdown(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data source if the source is kitman:tv", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        name: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        isGroupOption: true,
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
      {
        key_name: 'kitman:tv|dataname',
        name: 'dataname ',
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
    ];

    expect(formatAvailableVariablesForGroupedDropdown(variables)).toEqual(
      expectedVariables
    );
  });

  it('includes the data source if the source name is ‘Benchmark testing’', () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        name: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
        isGroupOption: true,
        description: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
      },
      {
        key_name: 'kitman:tv|dataname',
        name: 'dataname ',
        description: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
      },
    ];

    expect(formatAvailableVariablesForGroupedDropdown(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data unit if not provided", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        name: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        isGroupOption: true,
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
      {
        key_name: 'kitman:tv|dataname',
        name: 'dataname ',
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
    ];

    expect(formatAvailableVariablesForGroupedDropdown(variables)).toEqual(
      expectedVariables
    );
  });

  it('includes the data unit if existing', () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
        localised_unit: '%',
      },
    ];

    const expectedVariables = [
      {
        name: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        isGroupOption: true,
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
      {
        key_name: 'kitman:tv|dataname',
        name: 'dataname (%)',
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
    ];

    expect(formatAvailableVariablesForGroupedDropdown(variables)).toEqual(
      expectedVariables
    );
  });

  it('adds the correct group heading options', () => {
    const variables = [
      {
        source_key: 'custom|dataname',
        name: 'dataname',
        source_name: 'Custom Data',
        type: 'number',
      },
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
        localised_unit: '%',
      },
    ];

    const expectedVariables = [
      {
        name: 'Custom Data',
        isGroupOption: true,
        description: 'Custom Data',
      },
      {
        key_name: 'custom|dataname',
        name: 'dataname ',
        description: 'Custom Data',
      },
      {
        name: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        isGroupOption: true,
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
      {
        key_name: 'kitman:tv|dataname',
        name: 'dataname (%)',
        description: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
      },
    ];

    expect(formatAvailableVariablesForGroupedDropdown(variables)).toEqual(
      expectedVariables
    );
  });
});

describe('formatAvailableVariablesForSelect', () => {
  it('returns an empty array when availableVariables is empty', () => {
    expect(formatAvailableVariablesForSelect([])).toEqual([]);
  });

  it('includes the data source if the source is different than kitman or kitman:tv', () => {
    const variables = [
      {
        source_key: 'custom|dataname',
        name: 'dataname',
        source_name: 'Custom Data',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        value: 'custom|dataname',
        label: 'dataname ',
      },
    ];

    expect(formatAvailableVariablesForSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data source if the source is kitman", () => {
    const variables = [
      {
        source_key: 'kitman|dataname',
        name: 'dataname',
        source_name: 'Kitman',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        value: 'kitman|dataname',
        label: 'dataname ',
      },
    ];

    expect(formatAvailableVariablesForSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data source if the source is kitman:tv", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        value: 'kitman:tv|dataname',
        label: 'dataname ',
      },
    ];

    expect(formatAvailableVariablesForSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data unit if not provided", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        value: 'kitman:tv|dataname',
        label: 'dataname ',
      },
    ];

    expect(formatAvailableVariablesForSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it('includes the data unit if existing', () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
        localised_unit: '%',
      },
    ];

    const expectedVariables = [
      {
        value: 'kitman:tv|dataname',
        label: 'dataname (%)',
      },
    ];

    expect(formatAvailableVariablesForSelect(variables)).toEqual(
      expectedVariables
    );
  });
});

describe('formatAvailableVariablesForGroupedSelect', () => {
  it('returns an empty array when availableVariables is empty', () => {
    expect(formatAvailableVariablesForGroupedSelect([])).toEqual([]);
  });

  it('includes the data source if the source is different than kitman or kitman:tv', () => {
    const variables = [
      {
        source_key: 'custom|dataname',
        name: 'dataname',
        source_name: 'Custom Data',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        label: 'Custom Data',
        options: [
          {
            value: 'custom|dataname',
            label: 'dataname ',
          },
        ],
      },
    ];

    expect(formatAvailableVariablesForGroupedSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it('includes the data source if the source name is ‘Benchmark testing’', () => {
    const variables = [
      {
        source_key: 'custom|dataname',
        name: 'dataname',
        source_name: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        label: BENCHMARK_TESTING_VARIABLE_CUSTOM_SOURCE_NAME,
        options: [
          {
            value: 'custom|dataname',
            label: 'dataname ',
          },
        ],
      },
    ];

    expect(formatAvailableVariablesForGroupedSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data source if the source is kitman", () => {
    const variables = [
      {
        source_key: 'kitman|dataname',
        name: 'dataname',
        source_name: 'Kitman',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        label: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        options: [
          {
            value: 'kitman|dataname',
            label: 'dataname ',
          },
        ],
      },
    ];

    expect(formatAvailableVariablesForGroupedSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data source if the source is kitman:tv", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        label: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        options: [
          {
            value: 'kitman:tv|dataname',
            label: 'dataname ',
          },
        ],
      },
    ];

    expect(formatAvailableVariablesForGroupedSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it("doesn't include the data unit if not provided", () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
      },
    ];

    const expectedVariables = [
      {
        label: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        options: [
          {
            value: 'kitman:tv|dataname',
            label: 'dataname ',
          },
        ],
      },
    ];

    expect(formatAvailableVariablesForGroupedSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it('includes the data unit if exists', () => {
    const variables = [
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
        localised_unit: '%',
      },
    ];

    const expectedVariables = [
      {
        label: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        options: [
          {
            value: 'kitman:tv|dataname',
            label: 'dataname (%)',
          },
        ],
      },
    ];

    expect(formatAvailableVariablesForGroupedSelect(variables)).toEqual(
      expectedVariables
    );
  });

  it('adds the correct group heading options', () => {
    const variables = [
      {
        source_key: 'custom|dataname',
        name: 'dataname',
        source_name: 'Custom Data',
        type: 'number',
      },
      {
        source_key: 'kitman:tv|dataname',
        name: 'dataname',
        source_name: 'Kitman:tv',
        type: 'number',
        localised_unit: '%',
      },
    ];

    const expectedVariables = [
      {
        label: 'Custom Data',
        options: [
          {
            value: 'custom|dataname',
            label: 'dataname ',
          },
        ],
      },
      {
        label: KITMAN_VARIABLE_CUSTOM_SOURCE_NAME,
        options: [
          {
            value: 'kitman:tv|dataname',
            label: 'dataname (%)',
          },
        ],
      },
    ];

    expect(formatAvailableVariablesForGroupedSelect(variables)).toEqual(
      expectedVariables
    );
  });
});
