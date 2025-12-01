// @flow
import { useArgs } from '@storybook/client-api';
import type { RadioOption } from './types';
import InputRadio from './index';

export default {
  title: 'Form Components/Simple Inputs/InputRadio',
  component: InputRadio,

  argTypes: {
    buttonSide: { control: { type: 'select', options: ['left', 'right'] } },
    value: {
      control: {
        type: 'select',
        options: ['', 'option_1_bowling', 'option_2_darts'],
      },
    },
  },
};

const radioOption1: RadioOption = {
  value: 'option_1_bowling',
  name: 'Bowling',
};

const radioOption2: RadioOption = {
  value: 'option_2_darts',
  name: 'Darts',
};

// eslint-disable-next-line no-unused-vars
export const Basic = (inputArgs: any) => {
  const [args, updateArgs] = useArgs();
  const handleChange = (optionValue) => {
    updateArgs({ value: optionValue });
  };

  return (
    <div style={{ width: '80px' }}>
      <InputRadio {...args} option={radioOption1} change={handleChange} />
      <InputRadio {...args} option={radioOption2} change={handleChange} />
    </div>
  );
};
Basic.args = {
  inputName: 'myInputName',
  disabled: false,
  buttonSide: 'left',
  index: 1,
  kitmanDesignSystem: true,
  value: 'option_1_bowling',
};
