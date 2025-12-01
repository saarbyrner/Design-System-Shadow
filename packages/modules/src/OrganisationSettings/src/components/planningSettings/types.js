// @flow
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { ActivityTypeCategory } from '@kitman/services/src/services/getActivityTypeCategories';

export type SettingsView = 'PRESENTATION' | 'EDIT';

export type SettingsItem = {
  archived?: boolean,
  event_activity_type_category?: ?ActivityTypeCategory,
  id: number | string,
  isNewItem?: boolean,
  name: string,
  squads?: Squads,
};

export type SettingsEditItem = {
  id?: number | string,
  name?: string,
  delete?: boolean,
  archived?: boolean,
  squad_ids?: Array<number | string>,
};

export type ArchiveAction = 'ARCHIVE' | 'UNARCHIVE';
