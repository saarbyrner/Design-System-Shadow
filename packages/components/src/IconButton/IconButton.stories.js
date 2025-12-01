// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { iconOptions, iconThemes } from '@kitman/common/src/variables';
import IconButton from './index';

export const Basic = () => {
  const [args] = useArgs();

  return <IconButton {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  icon: iconOptions,
  theme: iconThemes,
  text: 'Button Text',
  isSmall: false,
  isBorderless: false,
  isDisabled: false,
  isActive: false,
  isTransparent: false,
  isLoading: false,
  onClick: action('click'),
};

export default {
  title: 'Form Components/Buttons/IconButton',
  component: Basic,
  argTypes: {
    icon: { control: { type: 'select', options: iconOptions } },
    theme: { control: { type: 'select', options: iconThemes } },
    text: { control: { type: 'text' } },
    isSmall: { control: { type: 'boolean' } },
    isBorderless: { control: { type: 'boolean' } },
    isDisabled: { control: { type: 'boolean' } },
    isActive: { control: { type: 'boolean' } },
    isTransparent: { control: { type: 'boolean' } },
    isLoading: { control: { type: 'boolean' } },
  },
};
