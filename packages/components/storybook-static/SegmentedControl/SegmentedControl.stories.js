// @flow
import { useArgs } from '@storybook/client-api';
import SegmentedControl from '.';
import type { Props } from '.';

export default {
  title: 'Form Components/Simple Inputs/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/GfkGAMUiFVB3oFmRPVg8Ze/%F0%9F%8E%A8-Kitman-Web-Design-System?node-id=365%3A14761',
    },
  },
};

const selectableButtons = [
  { name: 'Left', value: 'LEFT' },
  { name: 'Centre', value: 'CENTRE' },
  { name: 'Right', value: 'RIGHT' },
];

// eslint-disable-next-line no-unused-vars
export const Basic = (inputArgs: Props) => {
  const [args, updateArgs] = useArgs();
  const handleClickButton = (value) => {
    updateArgs({ selectedButton: value });
  };

  return (
    <div className="storybook__formComponentHolder">
      <SegmentedControl
        onClickButton={(value) => handleClickButton(value)}
        {...args}
      />
    </div>
  );
};

Basic.args = {
  buttons: selectableButtons,
  isDisabled: false,
  invalid: false,
  label: 'Label',
  maxWidth: 300,
};
