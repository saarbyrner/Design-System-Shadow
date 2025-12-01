// @flow
import type { Node } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import {
  formatAvatarCell,
  formatCurrencyCell,
  formatAddressCell,
  formatRegistrationStatusCell,
  formatLinkCell,
  formatActionableCell,
  formatDisciplinaryStatusCell,
  formatLabelStatusCell,
  formatDocumentsCell,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/cells';
import type {
  AthleteRow,
  UserRow,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';

import type { Label } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { DisciplinaryStatus } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import type { StatusPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  FALLBACK_USER_LOCALE,
  COLUMN_TYPES,
  DEFAULT_CURRENCY,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import { FALLBACK_REGISTRATION_SYSTEM_STATUS } from '@kitman/modules/src/LeagueOperations/shared/types/common';

import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { AddressCell, AvatarCell, LinkedCell, ActionCell } from '../types';

export const COMMON_COLUMN_PROPS: GridColDef = {
  disableReorder: true,
  disableColumnPinning: true,
  disableColumnMenu: true,
  disableColumnResize: true,
  disableColumnSelector: true,
  sortable: false,
  resizable: false,
  flex: 1,
};

export const getTextColumn = (columnDefinition: GridColDef): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
});

export const currencyColumn = (columnDefinition: GridColDef): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: number }) => {
    return formatCurrencyCell({
      userLocale: window.userLocale || FALLBACK_USER_LOCALE,
      currency: columnDefinition.currency,
      value: params?.value,
    });
  },
});

export const getAvatarColumn = (columnDefinition: GridColDef): GridColDef => {
  return {
    ...COMMON_COLUMN_PROPS,
    ...columnDefinition,
    renderCell: (params: { value: Array<AvatarCell> }) => {
      return formatAvatarCell(params?.value);
    },
  };
};

export const getAddressColumn = (columnDefinition: GridColDef): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: AddressCell }) => {
    return formatAddressCell({
      address: params?.value,
    });
  },
});
export const getRegistrationStatusColumn = (
  columnDefinition: GridColDef,
  statusPermissions?: StatusPermissions
): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { row: AthleteRow | UserRow }) => {
    const useRegistrationSystemStatus = window.getFlag(
      'league-ops-update-registration-status'
    );
    return formatRegistrationStatusCell({
      registrationStatus: params?.row?.registration_status,
      registrationSystemStatus:
        params?.row?.registration_system_status ??
        FALLBACK_REGISTRATION_SYSTEM_STATUS,
      registrationStatusReason: params?.row?.registration_status_reason,
      useRegistrationSystemStatus,
      withTooltip: true,
      statusPermissions,
    });
  },
});
export const getLabelStatusColumn = (
  columnDefinition: GridColDef
): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: Array<Label> }) => {
    return formatLabelStatusCell({
      labels: params?.value,
      withTooltip: true,
    });
  },
});

export const getDisciplineStatusColumn = (
  columnDefinition: GridColDef
): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: DisciplinaryStatus }) => {
    return formatDisciplinaryStatusCell({
      status: params?.value,
      withTooltip: false,
    });
  },
});

export const getLinkColumn = (columnDefinition: GridColDef): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: LinkedCell }) => {
    return formatLinkCell({
      text: params?.value?.text,
      href: params?.value?.href || null,
    });
  },
});

export const getNodeColumn = (columnDefinition: GridColDef): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: Node }) => params?.value,
});

export const getMenuColumn = (columnDefinition: GridColDef): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: Node }) => params?.value,
});

export const getActionableColumn = (
  columnDefinition: GridColDef
): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: ActionCell }) => {
    return formatActionableCell({
      text: params?.value?.text,
      isActionable: params?.value?.isActionable || false,
    });
  },
});

export const getDocumentsColumn = (
  columnDefinition: GridColDef
): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params) => {
    return formatDocumentsCell(params?.value);
  },
});

export const onTransformColumns = ({
  cols,
  viewLabel,
  permissions,
}: {
  cols: Array<GridColDef>,
  viewLabel?: boolean,
  permissions?: PermissionsType,
}): Array<GridColDef> => {
  const filteredColumns = !viewLabel
    ? cols.filter((column) => column.type !== 'labels')
    : cols;

  return filteredColumns.map((col) => {
    switch (col.type) {
      case COLUMN_TYPES.AVATAR:
        return getAvatarColumn(col);
      case COLUMN_TYPES.CURRENCY:
        return currencyColumn({
          ...col,
          currency: col?.currency ?? DEFAULT_CURRENCY,
        });
      case COLUMN_TYPES.STATUS:
        return getRegistrationStatusColumn(
          col,
          permissions?.registration?.status
        );
      case COLUMN_TYPES.LINK:
        return getLinkColumn(col);
      case COLUMN_TYPES.NODE:
        return getNodeColumn(col);
      case COLUMN_TYPES.MENU:
        return getMenuColumn(col);
      case COLUMN_TYPES.ACTION:
        return getActionableColumn(col);
      case COLUMN_TYPES.DISCIPLINE_STATUS:
        return getDisciplineStatusColumn(col);
      case COLUMN_TYPES.LABELS:
        return getLabelStatusColumn(col);
      case COLUMN_TYPES.DOCUMENTS:
        return getDocumentsColumn(col);
      default:
        return getTextColumn(col);
    }
  });
};
