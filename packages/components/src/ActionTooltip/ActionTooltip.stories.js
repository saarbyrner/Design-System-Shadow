// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import ActionTooltip from '.';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <ActionTooltip {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  content: 'ActionTooltip content',
  actionSettings: {
    text: 'apply',
    onCallAction: action('onCallAction'),
    preventCloseOnActionClick: ('preventCloseOnActionClick', false),
  },
  triggerElement: 'Show ActionTooltip',
  kitmanDesignSystem: false,
};

export default {
  title: 'ActionTooltip',
  component: Basic,
  argTypes: {
    content: { control: { type: 'text' } },
    actionSettings: { control: { type: 'object' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
  },
};
