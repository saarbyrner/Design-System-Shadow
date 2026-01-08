// @flow
import { useArgs } from '@storybook/client-api';
import PopupBox from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <PopupBox {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  title: 'Popup box component title',
  onExpand: false,
  alignLeft: false,
  children: <p>Test child</p>,
  t: (t) => t,
};

export default {
  title: 'Popup Box',
  component: Basic,
  argTypes: {
    title: { control: { type: 'text' } },
    onExpand: { control: { type: 'boolean' } },
    alignLeft: { control: { type: 'boolean' } },
  },
};
