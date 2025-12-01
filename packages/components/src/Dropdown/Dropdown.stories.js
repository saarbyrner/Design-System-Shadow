// @flow
import 'bootstrap/js/dist/dropdown';
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import { DropdownTranslated as Dropdown } from './index';

export const Basic = () => {
  const [args] = useArgs();

  return <Dropdown {...args} />;
};

const availableItems = [
  {
    id: 'option_1_bowling',
    title: 'Bowling',
  },
  {
    id: 'option_2_boxing',
    title: 'Boxing',
  },
  {
    id: 'option_3_cardio',
    title: 'Cardio',
  },
];

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  disabled: false,
  searchable: false,
  ignoreValidation: false,
  optional: false,
  emptyText: 'Select an activity',
  displayEmptyText: false,
  invalid: false,
  clearBtn: false,
  hiddenNoneOption: false,
  name: 'My Dropdown',
  items: availableItems,
  label: 'Activities',
  value: 'option_1_bowling',
  onClickClear: action('onClickClear'),
  t: (t) => t,
};

export default {
  title: 'Form Components/Simple Inputs/Dropdown',
  component: Basic,
  argTypes: {
    disabled: { control: { type: 'boolean' } },
    searchable: { control: { type: 'boolean' } },
    ignoreValidation: { control: { type: 'boolean' } },
    optional: { control: { type: 'boolean' } },
    emptyText: { control: { type: 'text' } },
    displayEmptyText: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    clearBtn: { control: { type: 'boolean' } },
    hiddenNoneOption: { control: { type: 'boolean' } },
    name: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    value: {
      control: {
        type: 'select',
        options: ['option_1_bowling', 'option_2_boxing', 'option_3_cardio'],
      },
    },
  },
};
