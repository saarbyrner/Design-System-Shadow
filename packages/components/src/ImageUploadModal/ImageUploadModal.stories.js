// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import ImageUploadModal from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <ImageUploadModal {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  onClickCloseModal: action('onClickCloseModal'),
  onClickSaveImage: action('onClickSaveImage'),
  t: (t) => t,
};

export default {
  title: 'ImageUploadModal',
  component: Basic,
  argTypes: {},
};
