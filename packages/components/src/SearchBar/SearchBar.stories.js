// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import SearchBar from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '300px' }}>
      <SearchBar {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  icon: 'icon-search',
  ignoreValidation: true,
  placeholder: 'placeholder',
  onChange: action('onChange'),
  value: 'value',
};

export default {
  title: 'Form Components/Simple Inputs/SearchBar',
  component: Basic,
  argTypes: {
    icon: { control: { type: 'text' } },
    ignoreValidation: { control: { type: 'boolean' } },
    placeholder: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
  },
};
