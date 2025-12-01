// @flow
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import i18n from '@kitman/common/src/utils/i18n';
import { formTypeEnumLike } from './enum-likes';

// Probably temp
export const formMetaDataMockData = {
  title: 'Wellbeing survey',
  description: 'Weekly wellbeing survey for team',
  type: formTypeEnumLike.survey,
  category: 'Other',
  createdAt: 'Feb 28, 2023',
  creator: 'Valery Lucks',
  formCategoryId: 1,
  productArea: 'Medical',
};

export const questionStyleOptions = [
  { label: i18n.t('Attachment'), value: INPUT_ELEMENTS.Attachment },
  { label: i18n.t('Yes/No'), value: INPUT_ELEMENTS.Boolean },
  { label: i18n.t('Date/Time'), value: INPUT_ELEMENTS.DateTime },
  { label: i18n.t('Multiple Choice'), value: INPUT_ELEMENTS.MultipleChoice },
  { label: i18n.t('Number'), value: INPUT_ELEMENTS.Number },
  { label: i18n.t('Scale/Range'), value: INPUT_ELEMENTS.Range },
  { label: i18n.t('Single Choice'), value: INPUT_ELEMENTS.SingleChoice },
  { label: i18n.t('Text Input'), value: INPUT_ELEMENTS.Text },
];

export const rangeQuestionTypeOptions = [
  { label: i18n.t('Slider'), value: 'linear' },
  { label: i18n.t('Rating'), value: 'rating' },
];

export const dateTimeQuestionTypeOptions = [
  { label: i18n.t('Date'), value: 'date' },
  { label: i18n.t('Date and Time'), value: 'date_time' },
  { label: i18n.t('Time'), value: 'time' },
  { label: i18n.t('Month and Year'), value: 'month_year' },
  { label: i18n.t('Year'), value: 'year' },
];

export const attachmentQuestionTypeOptions = [
  { label: i18n.t('Avatar'), value: 'avatar' },
  { label: i18n.t('File'), value: 'file' },
  { label: i18n.t('Signature'), value: 'signature' },
];

export const attachmentSizeOptions = [
  { label: i18n.t('5mb'), value: '5mb' },
  { label: i18n.t('10mb'), value: '10mb' },
  { label: i18n.t('25mb'), value: '25mb' },
  { label: i18n.t('100mb'), value: '100mb' },
];

export const incrementOptions = [
  { label: '0.5', value: 0.5 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];

export const singleSelectStyleOptions = [
  { label: i18n.t('Dropdown'), value: 'dropdown' },
  { label: i18n.t('Radio'), value: 'radio' },
  { label: i18n.t('Toggle'), value: 'toggle' },
];

export const multiSelectStyleOptions = [
  { label: i18n.t('Dropdown'), value: 'dropdown' },
  { label: i18n.t('Toggle'), value: 'toggle' },
];

export const textStyleOptions = [
  { label: i18n.t('Standard'), value: 'standard' },
  { label: i18n.t('Phone Number'), value: 'phone' },
  { label: i18n.t('Email Address'), value: 'email' },
];
