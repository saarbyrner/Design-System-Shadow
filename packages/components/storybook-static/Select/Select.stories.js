// @flow
import 'bootstrap/js/dist/dropdown';
import { useEffect, useMemo, useState } from 'react';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import { createFilter } from 'react-select';
import { SelectTranslated as Select } from './index';

const getOptions = (numOptions, disableSomeOptions = false) => {
  const opts = [];

  for (let i = 0; i < numOptions; i++) {
    opts.push({
      value: `option_${i + 1}`,
      label: `Option ${i + 1}`,
      id: i + 1,
      isDisabled: disableSomeOptions ? i !== 0 && i % 3 === 0 : false,
    });
  }

  return opts;
};

const getGroupedOptions = (numGroups) => {
  const groupedOpts = [];

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (let i = 0; i < numGroups; i++) {
    const numOptions = getRandomInt(20, 50);
    const options = [];

    for (let j = 0; j < numOptions; j++) {
      options.push({
        value: `group_${i}_option_${j + 1}`,
        label: `Option ${j + 1}-${j + 1}`,
      });
    }

    groupedOpts.push({ label: `Group ${i + 1}`, options });
  }

  return groupedOpts;
};

const getOptionsWithSubmenuOrPaginated = (
  numOptions,
  submenuIndices,
  groupBy?
) => {
  const opts = [];

  for (let i = 0; i < numOptions; i++) {
    opts.push({
      value: `option_${i + 1}`,
      label: `Option ${i + 1}`,
      id: i + 1,
    });
  }

  const optionValueText =
    groupBy === 'paginated' ? 'paginatedOption' : 'submenuOption';

  const optionLabelText =
    groupBy === 'paginated' ? 'PaginatedOption' : 'SubmenuOption';

  submenuIndices.forEach((indexWithOptions) => {
    const submenuOpts = [];
    for (let j = 0; j < indexWithOptions.numItems; j++) {
      submenuOpts.push({
        value: `option_${indexWithOptions.index + 1}_${optionValueText}_${
          j + 1
        }`,
        label: `${optionLabelText} ${j + 1}`,
        parentId: indexWithOptions.index + 1,
      });
    }

    opts[indexWithOptions.index] = {
      ...opts[indexWithOptions.index],
      options: submenuOpts,
    };
  });
  return opts;
};

const getOptionsWithAsyncSubmenu = (numOptions, submenuIndices) => {
  const opts = [];

  for (let i = 0; i < numOptions; i++) {
    opts.push({
      value: `option_${i + 1}`,
      label: `Option ${i + 1}`,
      id: i + 1,
    });
  }

  submenuIndices.forEach((indexWithOptions) => {
    opts[indexWithOptions.index] = {
      ...opts[indexWithOptions.index],
      loadAsyncOptions: indexWithOptions.loadAsyncOptions,
    };
  });
  return opts;
};

const mockDefaultResponse = [
  { value: 99999, label: 'Kerry', parentId: 9 },
  { value: 11111, label: 'Mayo', parentId: 9 },
];

const mockResponseForCallback = {
  eastCoast: [
    {
      id: 19019,
      type: 'east',
      city: 'Philadelphia',
      state: 'PA',
      parentId: 4,
    },
    { id: 33101, type: 'east', city: 'Miami', state: 'FL', parentId: 4 },
  ],
  westCoast: [
    {
      id: 94025,
      type: 'west',
      city: 'Menlo Park',
      state: 'CA',
      parentId: 4,
    },
    {
      id: 90001,
      type: 'west',
      city: 'Los Angeles',
      state: 'CA',
      parentId: 4,
    },
  ],
};

const transformMockedLocationResponse = (fetchedLocations) => {
  return [
    ...fetchedLocations.eastCoast.map(
      ({ type, id, city, state, parentId }) => ({
        value: `${type}_${id}`,
        label: `${city} - ${state}`,
        parentId,
      })
    ),
    ...fetchedLocations.westCoast.map(
      ({ type, id, city, state, parentId }) => ({
        value: `${type}_${id}`,
        label: `${city} - ${state}`,
        parentId,
      })
    ),
  ];
};

const mockSubmenu = (args) =>
  new Promise((resolve, reject) => {
    switch (args) {
      case 'error':
        return setTimeout(
          () =>
            reject(
              new Error(
                'Error parsing submenu response. Check mapping configuration'
              )
            ),
          400
        );

      case 'callback':
        return setTimeout(() => resolve(mockResponseForCallback), 1000);

      default:
        return setTimeout(() => resolve(mockDefaultResponse), 1000);
    }
  });

export const Basic = (inputArgs: Object) => {
  const [selected, setSelected] = useState([]);
  const options = useMemo(() => {
    if (inputArgs.isGrouped) {
      return getGroupedOptions(inputArgs.numGroups);
    }
    if (inputArgs.groupBy === 'submenu' && !inputArgs.asyncSubmenu) {
      return getOptionsWithSubmenuOrPaginated(
        inputArgs.numOptions,
        inputArgs.submenuIndices
      );
    }
    if (inputArgs.groupBy === 'submenu' && inputArgs.asyncSubmenu) {
      return getOptionsWithAsyncSubmenu(
        inputArgs.numOptions,
        inputArgs.asyncSubmenuIndices
      );
    }
    if (inputArgs.groupBy === 'paginated') {
      return getOptionsWithSubmenuOrPaginated(
        inputArgs.numOptions,
        inputArgs.submenuIndices,
        inputArgs.groupBy
      );
    }

    return getOptions(inputArgs.numOptions, inputArgs.disableSomeOptions);
  }, [
    inputArgs.isGrouped,
    inputArgs.numGroups,
    inputArgs.numOptions,
    inputArgs.submenuIndices,
    inputArgs.groupBy,
    inputArgs.disableSomeOptions,
    inputArgs.asyncSubmenuIndices,
    inputArgs.asyncSubmenu,
  ]);

  useEffect(() => {
    setSelected([]);
  }, [
    inputArgs.isMulti,
    inputArgs.isGrouped,
    inputArgs.groupBy,
    inputArgs.numGroups,
    inputArgs.numOptions,
    inputArgs.submenuIndices,
    inputArgs.asyncSubmenuIndices,
    inputArgs.asyncSubmenu,
  ]);

  return (
    <div className="storybook__formComponentHolder">
      <Select
        options={options}
        onClear={() => setSelected([])}
        onChange={(data) => {
          setSelected(inputArgs.returnObject ? data.value : data);
        }}
        value={selected}
        groupBy={inputArgs.groupBy}
        placeholder={inputArgs.placeholder}
        isMulti={inputArgs.isMulti}
        isClearable={inputArgs.isClearable}
        invalid={inputArgs.invalid}
        displayedMultiValueType={inputArgs.displayedMultiValueType}
        allowSelectAll={inputArgs.allowSelectAll}
        allowClearAll={inputArgs.allowClearAll}
        allowSearch={inputArgs.allowSearch}
        label={inputArgs.label}
        isDisabled={inputArgs.isDisabled}
        showAutoWidthDropdown={inputArgs.showAutoWidthDropdown}
        multiSelectSubMenu={inputArgs.multiSelectSubMenu}
        inlineShownSelection={inputArgs.inlineShownSelection}
        inlineShownSelectionMaxWidth={inputArgs.inlineShownSelectionMaxWidth}
        optional={inputArgs.optional}
        asyncSubmenu={inputArgs.asyncSubmenu}
        returnObject={inputArgs.returnObject}
        appendToBody={!inputArgs.hideInputField}
        actionsLabel={inputArgs.actionsLabel}
        selectAllGroups={inputArgs.selectAllGroups}
        returnParentInValueFromSubMenu={
          inputArgs.returnParentInValueFromSubMenu
        }
        hideCounter={inputArgs.hideCounter}
        className={
          inputArgs.hideInputField ? 'kitmanReactSelect--no-input' : ''
        }
        filterOption={
          inputArgs.searchStartsWith
            ? createFilter({ matchFrom: 'start' })
            : createFilter({ matchFrom: 'contains' })
        }
        renderControl={
          inputArgs.hideInputField
            ? () => {
                return (
                  <i
                    data-testid="changeVariationSelect"
                    className="icon-chevron-down"
                  />
                );
              }
            : null
        }
      />
    </div>
  );
};

Basic.args = {
  numOptions: 10,
  numGroups: 10,
  disableSomeOptions: false,
  label: 'My Select',
  placeholder: '',
  groupBy: 'nested',
  submenuIndices: [
    { index: 2, numItems: 3 },
    { index: 3, numItems: 1 },
    { index: 9, numItems: 10 },
  ],
  isMulti: false,
  isDisabled: false,
  isGrouped: false,
  isClearable: false,
  optional: false,
  allowSelectAll: false,
  allowClearAll: false,
  allowSearch: false,
  invalid: false,
  inlineShownSelection: false,
  inlineShownSelectionMaxWidth: 150,
  showAutoWidthDropdown: false,
  multiSelectSubMenu: false,
  returnObject: false,
  asyncSubmenu: false,
  asyncSubmenuIndices: [
    {
      index: 3,
      loadAsyncOptions: {
        fetchOptions: mockSubmenu,
        fetchOptionsArgs: 'callback',
        mapping: {
          callback: transformMockedLocationResponse,
        },
      },
    },
    {
      index: 8,
      loadAsyncOptions: {
        fetchOptions: mockSubmenu,
      },
    },
  ],
  hideInputField: false,
  returnParentInValueFromSubMenu: true,
  hideCounter: true,
  searchStartsWith: false,
};

export default {
  title: 'Form Components/Simple Inputs/Select',
  component: Select,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/GfkGAMUiFVB3oFmRPVg8Ze/%F0%9F%8E%A8-Kitman-Web-Design-System?node-id=295%3A0',
    },
  },
  argTypes: {
    numOptions: {
      control: { type: 'number' },
    },
    numGroups: {
      control: { type: 'number' },
    },
    label: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    groupBy: {
      control: { type: 'text' },
    },
    submenuIndices: {
      control: 'object',
    },
    allowSelectAll: {
      control: { type: 'boolean' },
    },
    allowClearAll: {
      control: { type: 'boolean' },
    },
    allowSearch: {
      control: { type: 'boolean' },
    },
    isMulti: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    isGrouped: {
      control: { type: 'boolean' },
    },
    isClearable: {
      control: { type: 'boolean' },
    },
    invalid: {
      control: { type: 'boolean' },
    },
    inlineShownSelection: {
      control: { type: 'boolean' },
    },
    optional: {
      control: { type: 'boolean' },
    },
    inlineShownSelectionMaxWidth: {
      control: { type: 'number' },
    },
    showAutoWidthDropdown: {
      control: { type: 'boolean' },
    },
    multiSelectSubMenu: {
      control: { type: 'boolean' },
    },
    asyncSubmenu: {
      control: { type: 'boolean' },
    },
    returnObject: {
      control: { type: 'boolean' },
    },
    hideInputField: {
      control: { type: 'boolean' },
    },
    returnParentInValueFromSubMenu: {
      control: { type: 'boolean' },
    },
    hideCounter: {
      control: { type: 'boolean' },
    },
    actionsLabel: {
      control: { type: 'text' },
    },
    selectAllGroups: {
      control: { type: 'boolean' },
    },
  },
};
