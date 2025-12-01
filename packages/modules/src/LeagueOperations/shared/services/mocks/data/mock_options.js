// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { SelectOption } from '@kitman/components/src/types';

import { data as mockOrganisation } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';
import { data } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_squad_list';

export const playerTypeOptions: Array<SelectOption> = [
  { label: i18n.t('Primary player'), value: 'primary' },
  { label: i18n.t('Future player'), value: 'future' },
  { label: i18n.t('Future affiliate player'), value: 'future_affiliate' },
  { label: i18n.t('Guest'), value: 'guest' },
  { label: i18n.t('Late developer'), value: 'late_developer' },
];

export const statusTypeOptions: Array<SelectOption> = [
  { label: i18n.t('Incomplete'), value: 'incomplete' },
  { label: i18n.t('Pending'), value: 'pending' },
  { label: i18n.t('Rejected'), value: 'rejected' },
  { label: i18n.t('Active'), value: 'active' },
];

export const staffLevelOptions: Array<SelectOption> = [
  { label: i18n.t('Assistant Coach'), value: 'Assistant Coach' },
  { label: i18n.t('Team Manager'), value: 'Team Manager' },
  { label: i18n.t('Medical'), value: 'Medical' },
  { label: i18n.t('Head Coach'), value: 'Head Coach' },
];

export const playerClubOptions: Array<SelectOption> = mockOrganisation.map(
  (club) => {
    return {
      label: club.club_name,
      value: club.id,
    };
  }
);

export const playerTeamOptions: Array<SelectOption> = data.map((team) => {
  return {
    label: team.name,
    value: team.id,
  };
});
