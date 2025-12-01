// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import { MultiSelectTranslated as MultiSelect } from './index';

export const Basic = () => {
  const [args] = useArgs();

  return <MultiSelect {...args} />;
};

const selectionValuesObj = {
  Bowling: 'option_1_bowling',
  Boxing: 'option_2_boxing',
  Cardio: 'option_3_cardio',
};

const selectableItems = [
  {
    id: 'option_1_bowling',
    title: 'Bowling',
    description: ': An activity',
  },
  {
    id: 'option_2_boxing',
    title: 'Boxing',
    description: ': An activity',
  },
  {
    id: 'option_3_cardio',
    title: 'Cardio',
    description: ': An activity',
  },
];

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  label: 'label',
  items: selectableItems,
  placeholder: 'Pick some options',
  onChange: action('change'),
};

export default {
  title: 'Form Components/Simple Inputs/MultiSelect',
  component: Basic,
  argTypes: {
    label: { control: { type: 'text' } },
    selectedItems: {
      control: { type: 'check', options: selectionValuesObj },
    },
    placeholder: { control: { type: 'text' } },
  },
};
