// @flow
import { useArgs } from '@storybook/client-api';
import InfoTooltip from '.';

export default {
  title: 'InfoTooltip',
  component: InfoTooltip,

  argTypes: {
    content: { control: { type: 'text' } },
    delay: { control: { type: 'number' } },
    errorStyle: {
      control: { type: 'boolean' },
    },
    placement: {
      control: {
        type: 'select',
        options: [
          'bottom',
          'bottom-start',
          'bottom-end',
          'top',
          'top-start',
          'top-end',
          'right-end',
        ],
      },
    },
  },
};

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ padding: '30px 0 0 10px' }}>
      <InfoTooltip {...args}>
        <button type="button">Show InfoTooltip</button>
      </InfoTooltip>
    </div>
  );
};

Basic.args = {
  content: 'Info tooltip text content',
  delay: 200,
  errorStyle: false,
  placement: 'bottom',
};
