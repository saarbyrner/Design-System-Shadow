// @flow
import { useArgs } from '@storybook/client-api';
import LoadingSpinner from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <LoadingSpinner {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  size: 16,
  strokeWidth: 2,
  color: '#2A6EBB',
};

export default {
  title: 'LoadingSpinner',
  component: Basic,
  argTypes: {
    size: { control: { type: 'number' } },
    strokeWidth: { control: { type: 'number' } },
    color: { control: { type: 'color' } },
  },
};
