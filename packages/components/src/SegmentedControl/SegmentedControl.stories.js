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
      url: 'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL/MUI-for-Figma-Material-UI-v5.16.0?node-id=11838-7926&m=dev',
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
