// @flow
import { useArgs } from '@storybook/client-api';
import Dialogue from '.';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <Dialogue {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  message: 'Message here',
  isEmbed: false,
  visible: true,
  type: 'confirm',
  confirmAction: () => {},
  cancelAction: () => {},
  t: (t) => t,
};

export default {
  title: 'Dialogue',
  component: Basic,
  argTypes: {
    message: { control: { type: 'text' } },
    isEmbed: { control: { type: 'boolean' } },
    visible: { control: { type: 'boolean' } },
    type: {
      control: {
        type: 'select',
        options: ['confirm', 'info'],
      },
    },
  },
};
