// @flow
import { useArgs } from '@storybook/client-api';
import Checkbox from './index';

export const New = () => {
  const [args] = useArgs();
  return <Checkbox {...args} />;
};

New.parameters = {
  controls: { hideNoControlsWarning: true },
};

New.args = {
  id: 'checkbox',
  checked: false,
  indeterminate: false,
  disabled: false,
  invalid: false,
};

export default {
  title: 'Form Components/Simple Inputs/Checkbox',
  component: New,
  argTypes: {
    checked: { control: { type: 'boolean' } },
    indeterminate: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
  },
};
