// @flow
import { useArgs } from '@storybook/client-api';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChooseNameModal from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <ChooseNameModal {...args} />;
};

Basic.args = {
  title: 'Title',
  label: 'A label',
  actionButtonText: 'Confirm',
  value: 'Value here',
  description: 'Description',
  customEmptyMessage: 'Type something here',
  maxLength: 100,
  isOpen: true,
  t: i18nextTranslateStub(),
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

export default {
  title: 'ChooseNameModal',
  component: ChooseNameModal,
  argTypes: {
    title: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    customEmptyMessage: { control: { type: 'text' } },
    isOpen: { control: { type: 'boolean' } },
    description: { control: { type: 'text' } },
    actionButtonText: { control: { type: 'text' } },
    maxLength: { control: { type: 'number' } },
  },
};
