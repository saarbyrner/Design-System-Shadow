// @flow
import { useArgs } from '@storybook/client-api';
import RichTextDisplay from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <RichTextDisplay {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  value: '<h1>This is a note text..</h1>',
};

export default {
  title: 'RichTextDisplay',
  component: Basic,
  argTypes: {
    value: { control: { type: 'text' } },
    removeDefaultStyles: { control: { type: 'boolean' } },
    abbreviatedHeight: { control: { type: 'number' } },
  },
};
