// @flow
import type { Node } from 'react';
import type {
  GridQueryParam,
  UserType,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  DisciplinePermissions,
  HomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

export type TabTitleConfig = {
  isPermitted: boolean,
  label: string,
  value: string,
};

export type TabConfig = TabTitleConfig & {
  content: Node,
};

export type SuspensionStatus = 'current' | 'past';

export type TabProps<T> = {
  filterOverrides?: $Shape<T>,
  gridQueryParams: GridQueryParam,
  currentUserType: UserType,
  title?: string,
  permissions?: DisciplinePermissions,
  suspensionStatus?: SuspensionStatus,
  gridName?: string,
  enableFiltersPersistence?: boolean,
};

export type HomegrownTabProps<T> = {
  filterOverrides?: $Shape<T>,
  gridQueryParams: GridQueryParam,
  currentUserType: UserType,
  title?: string,
  permissions?: HomegrownPermissions,
  gridName?: string,
  enableFiltersPersistence?: boolean,
};
