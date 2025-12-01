/* eslint-disable flowtype/require-valid-file-annotation */
import i18n from '@kitman/common/src/utils/i18n';

export const inlineStyles = [
  {
    id: 'BOLD',
    name: i18n.t('Bold'),
    icon: 'icon-font-style-bold',
  },
  {
    id: 'ITALIC',
    name: i18n.t('Italic'),
    icon: 'icon-font-style-italic',
  },
  {
    id: 'UNDERLINE',
    name: i18n.t('Underline'),
    icon: 'icon-font-style-underline',
  },
  {
    id: 'STRIKETHROUGH',
    name: i18n.t('Strikethrough'),
    icon: 'icon-font-style-strikethrough',
  },
];

export const blockStyles = [
  {
    id: 'unordered-list-item',
    name: i18n.t('Unordered List'),
    icon: 'icon-font-style-bulletlist',
  },
  {
    id: 'ordered-list-item',
    name: i18n.t('Ordered List'),
    icon: 'icon-font-style-numlist',
  },
];
