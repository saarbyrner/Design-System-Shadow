// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getDirectionDropdownOptions = () => [
  {
    value: 'apply',
    label: i18n.t('Apply', { context: 'medication direction' }),
  },
  {
    value: 'take',
    label: i18n.t('Take', { context: 'medication direction' }),
  },
];

const medRouteContext = { context: 'medication route of consumption' };
export const getRouteDropdownOptions = () => [
  {
    value: 'opthalmic',
    label: i18n.t('Opthalmic', medRouteContext),
  },
  {
    value: 'otic',
    label: i18n.t('Otic', medRouteContext),
  },
  {
    value: 'inhalation',
    label: i18n.t('Inhalation', medRouteContext),
  },
  {
    value: 'by mouth',
    label: i18n.t('Oral', medRouteContext),
  },
  {
    value: 'topical',
    label: i18n.t('Topical', medRouteContext),
  },
  {
    value: 'transdermal',
    label: i18n.t('Transdermal', medRouteContext),
  },
  {
    value: 'subcutaneous',
    label: i18n.t('Subcutaneous', medRouteContext),
  },
  {
    value: 'intramuscular',
    label: i18n.t('Intramuscular', medRouteContext),
  },
  {
    value: 'intra-articular',
    label: i18n.t('Intra-articular', medRouteContext),
  },
  {
    value: 'intravenous',
    label: i18n.t('Intravenous', medRouteContext),
  },
  {
    value: 'via g-tube',
    label: i18n.t('G-Tube', medRouteContext),
  },
  {
    value: 'via j-tube',
    label: i18n.t('J-Tube', medRouteContext),
  },
  {
    value: 'via g-j tube',
    label: i18n.t('G-J Tube', medRouteContext),
  },
  {
    value: 'rectal',
    label: i18n.t('Rectal', medRouteContext),
  },
];
