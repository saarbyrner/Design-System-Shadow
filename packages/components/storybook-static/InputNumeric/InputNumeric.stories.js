// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { InputNumericTranslated as InputNumeric } from './index';

export const Basic = () => {
  const [args, updateArgs] = useArgs();
  const onChange = (updatedValue) => updateArgs({ value: updatedValue });

  return <InputNumeric {...args} onChange={onChange} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  value: '1',
  onBlur: action('onBlur'),
  label: 'label',
  descriptor: 'Descriptor Text',
  descriptorSide: ['left', 'right'],
  inputMode: ['decimal', 'numeric'],
  placeholder: 'Placeholder',
  optional: false,
  name: 'My InputNumeric',
  disabled: false,
  isInvalid: false,
  size: ['small', 'large'],
  kitmanDesignSystem: false,
  tooltipDescriptor: false,
  t: (t) => t,
};

export default {
  title: 'Form Components/Simple Inputs/InputNumeric',
  component: Basic,
  argTypes: {
    value: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    descriptor: { control: { type: 'text' } },
    descriptorSide: { control: { type: 'select', options: ['left', 'right'] } },
    inputMode: { control: { type: 'select', options: ['decimal', 'numeric'] } },
    optional: { control: { type: 'boolean' } },
    name: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    isInvalid: { control: { type: 'boolean' } },
    size: { control: { type: 'select', options: ['small', 'large'] } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
    tooltipDescriptor: { control: { type: 'boolean' } },
  },
};
