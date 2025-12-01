// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import RadioList from './index';

export const Basic = () => {
  const [args] = useArgs();

  return <RadioList {...args} />;
};

const radioOptions = [
  {
    value: 'option_1_bowling',
    name: 'Bowling',
  },
  {
    value: 'option_2_boxing',
    name: 'Boxing',
  },
  {
    value: 'option_3_cardio',
    name: 'Cardio',
  },
];

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  options: radioOptions,
  value: 'option_1_bowling',
  label: 'label',
  disabled: false,
  kitmanDesignSystem: false,
  change: action('change'),
  radioName: 'My Radio List',
};

export default {
  title: 'Form Components/Simple Inputs/RadioList',
  component: Basic,
  argTypes: {
    options: { control: { type: 'array' } },
    label: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
    value: {
      control: {
        type: 'select',
        options: ['option_1_bowling', 'option_2_boxing', 'option_3_cardio'],
      },
    },
  },
};
