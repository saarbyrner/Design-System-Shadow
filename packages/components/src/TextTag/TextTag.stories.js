// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import TextTag from '.';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <TextTag {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  content: 'value here',
  closeable: false,
  clickable: false,
  isDisabled: false,
  displayEllipsisWidth: 120,
  backgroundColor: '#f1f2f3',
  textColor: '#1f2d44',
  onTagClick: action('onTagClick'),
  onClose: action('onClose'),
  wrapperCustomStyles: [
    { width: 'auto' },
    { padding: '20px' },
    { color: 'orange' },
  ],
};

export default {
  title: 'TextTag',
  component: Basic,
  argTypes: {
    content: { control: { type: 'text' } },
    closeable: { control: { type: 'boolean' } },
    clickable: { control: { type: 'boolean' } },
    isDisabled: { control: { type: 'boolean' } },
    displayEllipsisWidth: { control: { type: 'number' } },
    backgroundColor: { control: { type: 'color' } },
    textColor: { control: { type: 'color' } },
    wrapperCustomStyles: { control: { type: 'array' } },
  },
};
