// @flow
import { useArgs } from '@storybook/client-api';
import colors from '@kitman/common/src/variables/colors';
import UploadProgress from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <UploadProgress {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  radius: 20,
  strokeWidth: 3,
  progress: 20,
  progressColour: colors.grey_200,
  showProgressIndicator: true,
};

export default {
  title: 'Upload Progress',
  component: Basic,
  argTypes: {
    radius: {
      control: false,
      description:
        'Used to scale the component. Height & width will be 2 x radius.',
    },
    strokeWidth: { control: { type: 'number' } },
    progress: { control: { type: 'number' } },
    progressColour: { control: { type: 'color' } },
    showProgressIndicator: { control: { type: 'boolean' } },
  },
};
