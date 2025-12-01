// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import EditInPlace from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <EditInPlace {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  value: 'Edit in place component',
  onChange: action('onChange'),
};

export default {
  title: 'Form Components/Simple Inputs/EditInPlace',
  component: Basic,
  argTypes: {
    value: { control: { type: 'text' } },
    inputType: { control: { type: 'text' } },
  },
};
