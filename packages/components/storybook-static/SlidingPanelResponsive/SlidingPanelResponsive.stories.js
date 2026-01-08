// @flow
import { useArgs } from '@storybook/client-api';
import { TextButton } from '@kitman/components';
import SlidingPanel from './index';
import type { Props } from './index';

export default {
  title: 'SlidingPanel - Responsive',
  component: SlidingPanel,
  argTypes: {
    useClickToClose: { control: { type: 'boolean' } },
  },
};

// eslint-disable-next-line no-unused-vars
export const Default = (inputArgs: Props) => {
  const [args, updateArgs] = useArgs();
  const handleChange = () => {
    updateArgs({ isOpen: false });
  };

  return (
    <SlidingPanel {...args} togglePanel={handleChange}>
      <SlidingPanel.Content>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </SlidingPanel.Content>
      <SlidingPanel.Actions>
        <TextButton text="Save" type="primary" kitmanDesignSystem />
      </SlidingPanel.Actions>
    </SlidingPanel>
  );
};
Default.args = {
  isOpen: true,
  width: 460,
  title: 'Sliding Content Panel Title',
  useClickToClose: false,
};
