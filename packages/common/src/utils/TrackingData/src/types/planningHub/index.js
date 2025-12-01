// @flow
import { type GetAthleteEventsSortingOptions } from '@kitman/services/src/services/planning/getAthleteEvents';

export type AddDrillToSessionData = $Exact<{
  Favourites: boolean,
}>;

export type CreateNewDrillData = $Exact<{
  From: 'Session' | 'Coaching library',
  '# of principles added': number,
  Library: boolean,
}>;

export type NewEventImportTypeAndVendor = $Exact<{
  DataSource: 'CSV' | 'API',
  FileType: string | typeof undefined,
}>;

export type AthleteFiltersAndSorting = $Exact<{
  Filters: Array<
    'athleteName' | 'positions' | 'availabilities' | 'participationLevels'
  >,
  Sorting: GetAthleteEventsSortingOptions,
}>;

export type RPECollectionChannelsData = $Exact<{
  AthleteAppCollection: boolean,
  KioskAppCollection: boolean,
  KioskAppDisplayStyle: 'Grid' | 'List' | null,
}>;
