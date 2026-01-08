// @flow
import { useArgs } from '@storybook/client-api';
import GenericIframe from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <GenericIframe {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  src: 'https://www.wikipedia.org/', // first public url I could find that would work
  t: (t) => t,
};

export default {
  title: 'Generic Iframe',
  component: Basic,
  argTypes: {
    title: { control: { type: 'text' } },
    src: { control: { type: 'text' } },
  },
};
