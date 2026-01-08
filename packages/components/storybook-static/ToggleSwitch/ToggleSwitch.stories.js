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
      url: 'https://www.figma.com/file/GfkGAMUiFVB3oFmRPVg8Ze/%F0%9F%8E%A8-Kitman-Web-Design-System?node-id=897%3A13',
    },
  },
  argTypes: {
    labelPlacement: {
      control: { type: 'select', options: ['left', 'right'] },
    },
  },
};
