// @flow
import { useArgs } from '@storybook/client-api';

import EllipsisTooltipText from '.';

export default {
  title: 'EllipsisTooltipText',
  component: EllipsisTooltipText,

  argTypes: {
    content: { control: { type: 'text' } },
    displayEllipsisWidth: { control: { type: 'number' } },
  },
};

export const Basic = () => {
  const [args] = useArgs();

  return <EllipsisTooltipText {...args} />;
};

Basic.args = {
  content: 'EllipsisTooltipText',
  displayEllipsisWidth: 160,
};
