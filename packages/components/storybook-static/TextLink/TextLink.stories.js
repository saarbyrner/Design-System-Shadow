// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import TextLink from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <TextLink {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  text: 'myTextLink',
  isDisabled: false,
  kitmanDesignSystem: false,
  onClick: action('click'),
};

export default {
  title: 'Form Components/Links/TextLink',
  component: Basic,
  argTypes: {
    text: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
  },
};
