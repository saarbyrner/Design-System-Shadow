// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import CheckboxList from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <CheckboxList {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  items: [
    { value: 1, label: 'Item 1' },
    { value: 2, label: 'Item 2' },
    { value: 3, label: 'Item 3' },
  ],
  values: [1],
  onChange: action('on change'),
  singleSelection: false,
  kitmanDesignSystem: false,
};

export default {
  title: 'Form Components/Simple Inputs/CheckboxList',
  component: Basic,
  argTypes: {
    items: { control: { type: 'array' } },
    values: { control: { type: 'array' } },
    singleSelection: { control: { type: 'boolean' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
  },
};
