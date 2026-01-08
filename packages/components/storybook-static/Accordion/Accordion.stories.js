// @flow
import { useArgs } from '@storybook/client-api';
import { colors } from '@kitman/common/src/variables';
import Accordion from '.';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <Accordion {...args} />
    </div>
  );
};

Basic.args = {
  title: 'Accordion title',
  content: 'Accordion content',
  iconAlign: 'left',
  titleColour: colors.p03,
};

export default {
  title: 'Accordion',
  component: Accordion,
  argTypes: {
    title: { control: { type: 'text' } },
    content: { control: { type: 'text' } },
    iconAlign: {
      control: {
        type: 'select',
        options: ['left', 'right'],
      },
    },
    titleColour: { control: { type: 'color' } },
    rightArrowIcon: {
      control: {
        type: 'select',
        options: [true, false],
      },
    },
  },
};
