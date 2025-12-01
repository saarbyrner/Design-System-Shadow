// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import InputText from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <InputText {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  autoFocus: true,
  label: 'label',
  name: 'name',
  inputType: ['text', 'password', 'email', 'tel'],
  maxLength: 20,
  customEmptyMessage: 'Enter your text',
  required: true,
  value: 'My input text',
  revealError: false,
  showRemainingChars: false,
  revealEshowCharsLimitReachedrror: false,
  disabled: false,
  invalid: false,
  placeholder: 'placeholder',
  kitmanDesignSystem: true,
  searchIcon: false,
  calendarIcon: false,
  onValidation: action('onValidation'),
  t: (t) => t,
};

export default {
  title: 'Form Components/Simple Inputs/InputText',
  component: Basic,
  argTypes: {
    name: { control: { type: 'text' } },
    inputType: {
      control: {
        type: 'select',
        options: ['text', 'password', 'email', 'tel'],
      },
    },
    maxLength: { control: { type: 'number' } },
    customEmptyMessage: { control: { type: 'text' } },
    required: { control: { type: 'boolean' } },
    value: { control: { type: 'text' } },
    revealError: { control: { type: 'boolean' } },
    showRemainingChars: { control: { type: 'boolean' } },
    revealEshowCharsLimitReachedrror: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    placeholder: { control: { type: 'text' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
    kitmanDesignSsearchIconystem: { control: { type: 'boolean' } },
    kitmanDesignSystemCalendarIcon: { control: { type: 'boolean' } },
    autoFocus: { control: { type: 'boolean' } }, // Note autofocus is used for page load so to see this effect you will need to switch to another component and back to this component to see the change (on load)
  },
};
