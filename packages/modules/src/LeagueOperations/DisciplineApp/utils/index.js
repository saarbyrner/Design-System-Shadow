// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getTranslatedDisciplineReasons = () => ({
  'YELLOW CARD ACCUMULATION': i18n.t('Yellow card accumulation'),
  'RED CARD': i18n.t('Red card'),
  'VIOLENT CONDUCT': i18n.t('Violent conduct'),
  'OFFENSIVE BEHAVIOR': i18n.t('Offensive behavior'),
  'VIOLATION OF CLUB POLICIES': i18n.t('Violation of club policies'),
  'VIOLATION OF LEAGUE POLICIES': i18n.t('Violation of league policies'),
});

export const getSuspensionOptions = () => [
  { value: 'number_of_games', label: i18n.t('Number of games') },
  { value: 'date_range', label: i18n.t('Date') },
];
