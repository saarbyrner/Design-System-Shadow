// @flow
import type { Node } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';
import type { PositionGroups } from '@kitman/services/src/services/getPositionGroups';
import type { Filters } from '@kitman/modules/src/UserMovement/shared/redux/services/api/searchAthletes';
import type { ActiveStatus } from '@kitman/modules/src/AthleteManagement/shared/types';

import type { Options } from './useManageAthletesGrid';

export type CellHeader = { id: string, row_key: string, content: Node };

const athleteColumn = {
  id: 'name',
  title: i18n.t('Athlete'),
};
const orgColumn = {
  id: 'assigned_to',
  title: i18n.t('Assigned To'),
};

const emailColumn = {
  id: 'email',
  title: i18n.t('Email'),
};
const dateOfBirthColumn = {
  id: 'date_of_birth',
  title: i18n.t('DOB'),
};
const idColumn = {
  id: 'id',
  title: i18n.t('Athlete ID'),
};
const usernameColumn = {
  id: 'username',
  title: i18n.t('Username'),
};
const positionColumn = {
  id: 'position',
  title: i18n.t('Position'),
};
const careerStatusColumn = {
  id: 'career_status',
  title: i18n.t('Career Status'),
};

const squadsColumn = {
  id: 'squads',
  title: i18n.t('Squads'),
};

const creationDateColumn = {
  id: 'creation_date',
  title: i18n.t('Creation Date'),
};

const mapToDefaultCell = (item: { id: string, title: string }) => {
  return {
    id: item.id,
    row_key: item.id,
    content: <DefaultHeaderCell title={item.title} />,
  };
};

export const getCellHeaders = (
  isAssociationAdmin: boolean
): Array<CellHeader> => {
  if (isAssociationAdmin) {
    return [
      athleteColumn,
      orgColumn,
      emailColumn,
      dateOfBirthColumn,
      idColumn,
      usernameColumn,
      positionColumn,
      careerStatusColumn,
    ].map(mapToDefaultCell);
  }
  return [
    athleteColumn,
    usernameColumn,
    positionColumn,
    squadsColumn,
    creationDateColumn,
  ].map(mapToDefaultCell);
};

export const getEmptyTableText = (
  filters: Filters,
  activeStatus: ActiveStatus
) => {
  if (filters?.search_expression && filters.search_expression.length > 0) {
    return i18n.t('No athletes match the search criteria');
  }
  if (activeStatus === 'ACTIVE') {
    return i18n.t('No athletes have been registered yet');
  }
  return i18n.t('No released athletes found');
};

export const mapToOption = (item: { id: number, name: string }) => ({
  value: item.id,
  label: item.name,
});

export const convertPositionsToOptions = (
  positions: ?PositionGroups
): Array<Options> => {
  if (!positions) return [];

  return positions.flatMap((option) => option.positions).map(mapToOption);
};
