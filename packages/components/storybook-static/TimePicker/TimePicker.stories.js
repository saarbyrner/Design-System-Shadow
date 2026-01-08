// @flow
import { useArgs } from '@storybook/client-api';
import TimePicker from './index';
import type { Props } from './index';

export default {
  title: 'Form Components/Simple Inputs/TimePicker',
  component: TimePicker,
};

// eslint-disable-next-line no-unused-vars
const Template = (inputArgs: Props) => {
  const [args, updateArgs] = useArgs();
  const handleChange = (optionValue) => {
    updateArgs({ value: optionValue });
  };

  return <TimePicker {...args} onChange={handleChange} />;
};

export const Default = Template.bind({});

Default.args = {
  value: null,
  label: '',
  disabled: false,
  name: '',
  defaultOpenValue: null,
  minuteStep: 30,
  kitmanDesignSystem: false,
  t: (t) => t,
};
