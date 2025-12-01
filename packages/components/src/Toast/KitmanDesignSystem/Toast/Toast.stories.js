// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';
import { TextButton } from '@kitman/components';
import Toast from '.';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '400px' }}>
      <Toast {...args}>
        <Toast.Icon />
        <Toast.Title>Toast title</Toast.Title>
        <TextButton iconBefore="icon-close" type="textOnly" />
        <Toast.Description>Toast description</Toast.Description>
        <Toast.Links
          links={[
            { id: 1, text: 'FirstLink', link: 'https://www.google.com' },
            {
              id: 2,
              text: 'SecondLink',
              link: 'https//:www.facebook.com',
            },
          ]}
        />
      </Toast>
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  id: 1,
  status: 'INFO',
  onClose: action('onClose'),
};

export default {
  title: 'Toast',
  component: Toast,
  argTypes: {
    status: {
      control: {
        type: 'select',
        options: ['SUCCESS', 'WARNING', 'ERROR', 'INFO', 'LOADING'],
      },
    },
  },
};
