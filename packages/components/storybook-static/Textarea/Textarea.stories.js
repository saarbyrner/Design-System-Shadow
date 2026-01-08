// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import Textarea from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <Textarea {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  value: 'My long text',
  label: 'label',
  maxLimit: 100,
  minLimit: 1,
  name: 'name',
  disabled: false,
  invalid: false,
  kitmanDesignSystem: false,
  optionalText: '',
  onChange: action('change'),
  onBlur: action('blur'),
};

export default {
  title: 'Form Components/Simple Inputs/Textarea',
  component: Basic,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/GfkGAMUiFVB3oFmRPVg8Ze/%F0%9F%8E%A8-Kitman-Web-Design-System?node-id=2128%3A0',
    },
  },
  argTypes: {
    value: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    maxLimit: { control: { type: 'number' } },
    minLimit: { control: { type: 'number' } },
    name: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
    optionalText: { control: { type: 'text' } },
  },
};
