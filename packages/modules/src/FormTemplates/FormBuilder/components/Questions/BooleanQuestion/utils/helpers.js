// @flow

import { MenuItem } from '@kitman/playbook/components';

import i18n from '@kitman/common/src/utils/i18n';

export const getBooleanQuestionTranslations = () => ({
  option1: i18n.t('Option 1'),
  option2: i18n.t('Option 2'),
  yes: i18n.t('Yes'),
  no: i18n.t('No'),
  style: i18n.t('Style'),
});

export const getStyleOptions = () =>
  [
    { label: i18n.t('Toggle'), value: 'toggle' },
    { label: i18n.t('Checkbox'), value: 'checkbox' },
    { label: i18n.t('Switch'), value: 'switch' },
  ].map<React$Element<'div'>>((option) => {
    return (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    );
  });
