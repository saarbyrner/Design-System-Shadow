// @flow
import 'bootstrap/js/dist/dropdown';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { MultiSelectDropdownTranslated as MultiSelectDropdown } from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '300px' }}>
      <MultiSelectDropdown {...args} />
    </div>
  );
};

const items = [
  {
    id: 'option_1_bowling',
    name: 'Bowling',
  },
  {
    id: 'option_2_boxing',
    name: 'Boxing',
  },
  {
    id: 'option_3_cardio',
    name: 'Cardio',
  },
];

const selectionValuesObj = {
  Bowling: 'option_1_bowling',
  Boxing: 'option_2_boxing',
  Cardio: 'option_3_cardio',
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  customClass: '',
  hasApply: false,
  hasSearch: false,
  hasSelectAll: false,
  isOptional: false,
  label: 'label',
  listItems: items,
  onApply: action('change'),
  onItemSelect: action('change'),
  onSelectAll: action('change'),
  selectedItems: 'option_3_cardio',
  disabledItems: 'option_1_bowling',
  showDropdownButton: true,
  invalid: false,
  dropdownTitle: 'My Dropdown',
  disabled: false,
  emptyText: '',
  t: (t) => t,
};

export default {
  title: 'Form Components/Simple Inputs/MultiSelectDropdown',
  component: Basic,
  argTypes: {
    customClass: { control: { type: 'text' } },
    hasApply: { control: { type: 'boolean' } },
    hasSearch: { control: { type: 'boolean' } },
    hasSelectAll: { control: { type: 'boolean' } },
    isOptional: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    showDropdownButton: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    dropdownTitle: { control: { type: 'text' } },
    selectedItems: {
      control: { type: 'check', options: selectionValuesObj },
    },
    disabledItems: {
      control: { type: 'check', options: selectionValuesObj },
    },
    emptyText: { control: { type: 'text' } },
  },
};
