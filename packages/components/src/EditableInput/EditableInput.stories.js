// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import EditableInput from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <EditableInput {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  value: 'Editable Input',
  onSubmit: action('onSubmit'),
  maxWidth: 200,
  maxLength: 10,
  allowOnlyNumbers: false,
  allowSavingEmpty: false,
};

export default {
  title: 'Form Components/Simple Inputs/EditableInput',
  component: Basic,
  argTypes: {
    value: { control: { type: 'text' } },
    maxWidth: { control: { type: 'number' } },
    maxLength: { control: { type: 'number' } },
    allowOnlyNumbers: { control: { type: 'boolean' } },
    allowSavingEmpty: { control: { type: 'boolean' } },
  },
};
