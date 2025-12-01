// @flow
import { type SourceData } from '@kitman/modules/src/ImportWorkflow/src/types';
import {
  type NewEventImportTypeAndVendor,
  type AthleteFiltersAndSorting,
  type RPECollectionChannelsData,
} from '@kitman/common/src/utils/TrackingData/src/types/planningHub';
import {
  type GetAthleteEventsFilters,
  type GetAthleteEventsSortingOptions,
} from '@kitman/services/src/services/planning/getAthleteEvents';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import type { CreatableEventType } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

import type {
  AddDrillToSessionData,
  CreateNewDrillData,
} from '../../types/planningHub';

const getAddDrillToSessionData = ({
  isFavorite,
}: {
  isFavorite: boolean,
}): AddDrillToSessionData => ({
  Favourites: isFavorite,
});

const getDrillData = ({
  principles,
  isLibrary,
}: {
  principles: ?Array<string | number>,
  isLibrary: boolean,
}): CreateNewDrillData => {
  const path = window.location.pathname.includes('planning_hub')
    ? 'Session'
    : 'Coaching library';
  const principlesAdded = Array.isArray(principles) ? principles.length : 0;
  return {
    From: path,
    '# of principles added': principlesAdded,
    Library: isLibrary,
  };
};

const getImportTypeAndVendor = (
  source: SourceData
): NewEventImportTypeAndVendor => {
  const isCSV = source.type === 'FILE' || source.type === 'CSV';
  return {
    DataSource: isCSV ? 'CSV' : 'API',
    FileType: isCSV ? source.fileData?.source : source.integrationData?.name,
  };
};

const getAthleteFiltersAndSorting = ({
  filters,
  sortBy,
}: {
  filters: GetAthleteEventsFilters,
  sortBy: GetAthleteEventsSortingOptions,
}): AthleteFiltersAndSorting => ({
  // $FlowIgnore[incompatible-call] the type is correct here.
  Filters: Object.keys(filters).filter((name) => {
    const filterValue = filters[name];
    // If a filter is a single-value property, include its name if it’s truthy
    // which means it’s used.
    if (['boolean', 'string', 'number'].includes(typeof filterValue)) {
      return Boolean(filterValue);
    }
    // If a filter is an array property, include its name if it contains
    // values which means it’s used.
    if (filterValue?.length) return Boolean(filters[name]?.length);
    // Don’t include a filter name otherwise.
    return false;
  }),
  Sorting: sortBy,
});

const getRPECollectionChannelsData = ({
  athleteAppCollection,
  kioskAppCollection,
  massInput,
}: {
  athleteAppCollection: boolean,
  kioskAppCollection: boolean,
  massInput: boolean,
}): RPECollectionChannelsData => {
  const displayStyle = massInput ? 'Grid' : 'List';
  return {
    AthleteAppCollection: athleteAppCollection,
    KioskAppCollection: kioskAppCollection,
    KioskAppDisplayStyle: kioskAppCollection ? displayStyle : null,
  };
};

const getAddColumnToParticipantsOrCollectionTabTable = ({
  eventType,
  dataSourceName,
  calculation,
}: {
  eventType: CreatableEventType,
  dataSourceName: ?string,
  calculation: ?string,
}) => ({
  'Event Type': getHumanReadableEventType(eventType),
  'Data Source': dataSourceName,
  Calculation: calculation,
});

export {
  getAddDrillToSessionData,
  getDrillData,
  getImportTypeAndVendor,
  getAthleteFiltersAndSorting,
  getRPECollectionChannelsData,
  getAddColumnToParticipantsOrCollectionTabTable,
};
