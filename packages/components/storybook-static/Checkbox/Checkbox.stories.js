// @flow
import { useArgs } from '@storybook/client-api';
import Checkbox from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <Checkbox {...args} />
    </div>
  );
};
// Removes the warning as its not a bug warning (versioning)
Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  isChecked: false,
  label: 'label',
  secondaryLabel: 'secondaryLabel',
  isDisabled: false,
  name: '',
  radioStyle: false,
  kitmanDesignSystem: false,
};

export default {
  title: 'Form Components/Simple Inputs/Checkbox',
  component: Basic,
  argTypes: {
    isChecked: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    secondaryLabel: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
    name: { control: { type: 'text' } },
    radioStyle: { control: { type: 'boolean' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
  },
};
