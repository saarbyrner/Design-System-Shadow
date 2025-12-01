// @flow
import { useArgs } from '@storybook/client-api';
import ProgressTracker from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <ProgressTracker {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  headings: [
    { id: 1, name: 'Heading 1' },
    { id: 2, name: 'Heading 2' },
    { id: 3, name: 'Heading 3' },
  ],
};

export default {
  title: 'Progress Tracker',
  component: Basic,
  argTypes: {
    headings: { control: { type: 'array' } },
  },
};
