// @flow
import { useArgs } from '@storybook/client-api';
import LineLoader from '.';

export default {
  title: 'LineLoader',
  component: LineLoader,

  argTypes: {
    direction: {
      control: { type: 'select', options: ['right', 'left'] },
    },
  },
};

export const Basic = () => {
  const [args] = useArgs();

  return <LineLoader {...args} />;
};

Basic.args = {
  direction: 'right',
};
