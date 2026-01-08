// @flow
import { action } from '@storybook/addon-actions';
import ToggleSwitch from './index';

export const Default = (inputArgs: Object) => (
  <div className="storybook__formComponentHolder">
    <ToggleSwitch
      isDisabled={inputArgs.isDisabled}
      isSwitchedOn={inputArgs.isSwitchedOn}
      label={inputArgs.label}
      labelPlacement={inputArgs.labelPlacement}
      toggle={action('toggle')}
      kitmanDesignSystem={inputArgs.kitmanDesignSystem}
    />
  </div>
);

Default.args = {
  isDisabled: false,
  isSwitchedOn: false,
  label: 'Toggle Switch',
  labelPlacement: 'left',
  kitmanDesignSystem: true,
};

export default {
  title: 'Form Components/Simple Inputs/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL/MUI-for-Figma-Material-UI-v5.16.0?node-id=11838-7926&m=dev',
    },
  },
  argTypes: {
    labelPlacement: {
      control: { type: 'select', options: ['left', 'right'] },
    },
  },
};
