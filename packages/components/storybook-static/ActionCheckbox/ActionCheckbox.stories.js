// @flow
import { useArgs } from '@storybook/client-api';
import ActionCheckbox from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <ActionCheckbox {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  isChecked: false,
  isDisabled: false,
  onToggle: false,
  kitmanDesignSystem: false,
};

export default {
  title: 'Form Components/Simple Inputs/ActionCheckbox',
  component: Basic,
  argTypes: {
    isChecked: { control: { type: 'boolean' } },
    isDisabled: { control: { type: 'boolean' } },
    onToggle: { control: { type: 'boolean' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
  },
};
