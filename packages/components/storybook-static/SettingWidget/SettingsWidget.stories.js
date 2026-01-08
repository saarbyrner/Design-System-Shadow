// @flow
import { useArgs } from '@storybook/client-api';
import { action } from '@storybook/addon-actions';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import SettingWidget from '.';
import type { Props as PropType } from '.';

// Child 1
export const SettingWidgetPlain = () => {
  const [args] = useArgs();

  return (
    <SettingWidget {...args}>
      <p>Inner Content</p>
    </SettingWidget>
  );
};

SettingWidgetPlain.parameters = {
  controls: { hideNoControlsWarning: true },
};

SettingWidgetPlain.args = {
  title: 'Setting Title',
  kitmanDesignSystem: false,
};

// Child 2
export const SettingWidgetWithRestoreDefaults = () => {
  const [args] = useArgs();

  return (
    <SettingWidget {...args}>
      <p>Inner Content</p>
    </SettingWidget>
  );
};

SettingWidgetWithRestoreDefaults.parameters = {
  controls: { hideNoControlsWarning: true },
};

SettingWidgetWithRestoreDefaults.args = {
  title: 'Setting Title',
  kitmanDesignSystem: false,
  t: (t) => t,
  onClickRestore: action('onClickRestore'),
};

// Child 3
export const SettingWidgetWithAction = (args: I18nProps<PropType>) => {
  return (
    <SettingWidget {...args}>
      <p>Inner Content</p>
    </SettingWidget>
  );
};

SettingWidgetWithAction.parameters = {
  controls: { hideNoControlsWarning: true },
};

SettingWidgetWithAction.args = {
  title: 'Setting Title',
  kitmanDesignSystem: false,
  t: (t) => t,
  onClickActionButton: action('onClickActionButton'),
  actionButtonText: 'Action button text',
};

export default {
  title: 'Setting Widgets / Settings Widget',
  component: SettingWidgetPlain,
  argTypes: {
    title: { control: { type: 'text' } },
    kitmanDesignSystem: { control: { type: 'boolean' } },
  },
};
