import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import TextButton from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <TextButton {...args} />
    </div>
  );
};

const buttonTypeOptions = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  textOnly: 'textOnly',
  warning: 'warning',
  danger: 'danger',
  subtle: 'subtle',
  link: 'link',
  destruct: 'destruct',
};

const buttonSizeOptions = {
  extraSmall: 'extraSmall',
  small: 'small',
  large: 'large',
  primaryDestruct: 'primaryDestruct',
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  type: buttonTypeOptions,
  size: buttonSizeOptions,
  text: 'Button Text',
  isDisabled: false,
  isSubmit: false,
  isActive: false,
  isLoading: false,
  iconAfter: 'Button Text',
  kitmanDesignSystem: false,
  onClick: action('click'),
};

export default {
  title: 'Form Components/Buttons/TextButton',
  component: Basic,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL/MUI-for-Figma-Material-UI-v5.16.0?node-id=11838-7926&m=dev',
    },
  },
  argTypes: {
    type: { control: { type: 'select', options: buttonTypeOptions } },
    size: { control: { type: 'select', options: buttonSizeOptions } },
    text: { control: { type: 'text' } },
    isDisabled: { control: { type: 'boolean' } },
    isSubmit: { control: { type: 'boolean' } },
    isActive: { control: { type: 'boolean' } },
    isLoading: { control: { type: 'boolean' } },
    iconAfter: { control: { type: 'text' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
  },
};
