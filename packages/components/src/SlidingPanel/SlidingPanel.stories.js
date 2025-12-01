// @flow
import { useArgs } from '@storybook/client-api';
import SlidingPanel from './index';
import type { Props } from './index';

export default {
  title: 'SlidingPanel',
  component: SlidingPanel,
  argTypes: {
    align: { control: { type: 'select', options: ['left', 'right'] } },
    useClickToClose: { control: { type: 'boolean' } },
  },
};

// eslint-disable-next-line no-unused-vars
export const Default = (inputArgs: Props) => {
  const [args, updateArgs] = useArgs();
  const handleChange = () => {
    updateArgs({ isOpen: false });
  };

  return <SlidingPanel {...args} togglePanel={handleChange} />;
};
Default.args = {
  align: 'right',
  isOpen: true,
  kitmanDesignSystem: true,
  width: 460,
  title: 'Sliding Content Panel Title',
  hideHeader: false,
  isRelative: false,
  leftMargin: 0,
  useClickToClose: false,
};
