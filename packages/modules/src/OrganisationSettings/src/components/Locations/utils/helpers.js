// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { createTextCell } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/helpers';
import { pageModeEnumLike } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/enum-likes';
import type { Cells, Rows } from '@kitman/components/src/DataGrid/index';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/components/src/Select';
import type { PageMode } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/types';
import type { EventLocationSettingsPermissions } from '@kitman/common/src/contexts/PermissionsContext/eventLocationSettings/types';
import { eventTypesJoinSeparator, NEW_LOCATION_ID_PREFIX } from './consts';
import type {
  Locations,
  Location,
  EventTypeArray,
  OnChangingArchiveStatus,
} from './types';

export const createEventTypeOptions = (t: Translation): Array<Option> => [
  {
    label: t('Event'),
    value: 'custom',
  },
  {
    label: t('Game'),
    value: 'game',
  },
  {
    label: t('Session'),
    value: 'session',
  },
];

export const createLocationTypeOptions = (t: Translation): Array<Option> => [
  {
    label: t('Other'),
    value: 'other',
  },
  {
    label: t('Stadium'),
    value: 'stadium',
  },
  {
    label: t('Training Facility'),
    value: 'training_facility',
  },
];

export const createLocationTypeValueToLabelMap = () => {
  return {
    training_facility: i18n.t('Training Facility'),
    stadium: i18n.t('Stadium'),
    other: i18n.t('Other'),
  };
};

export const createEventTypeValueToLabelMap = () => {
  return {
    custom: i18n.t('Event'),
    game: i18n.t('Game'),
    session: i18n.t('Session'),
  };
};

export const reduceLocationsIntoLocationNames = (locations: Locations) => {
  let duplicatesExist = false;

  const reducedSet = locations.reduce((prevSet, { name }) => {
    const localPrevSet = new Set<string>([...prevSet]);
    const nameLower = name.toLocaleLowerCase();
    if (localPrevSet.has(nameLower)) {
      duplicatesExist = true;
    }
    localPrevSet.add(nameLower);
    return localPrevSet;
  }, new Set<string>());
  return { duplicatesExist, locationNamesSet: reducedSet };
};

export const createColumns = (t: Translation): Cells => {
  const columns = [
    {
      id: 'name',
      content: <div>{t('Name')}</div>,
      isHeader: true,
    },
    {
      id: 'locationType',
      content: <div>{t('Location Type')}</div>,
      isHeader: true,
    },
    {
      id: 'relatedEvent',
      content: <div>{t('Related Event')}</div>,
      isHeader: true,
    },
  ];
  return columns;
};

export const getEventTypesText = (eventTypes: EventTypeArray) => {
  const eventTypeValueToLabelMap = createEventTypeValueToLabelMap();
  return eventTypes
    .map((eventType) => eventTypeValueToLabelMap[eventType])
    .join(eventTypesJoinSeparator);
};

type CreateRows = {
  t: Translation,
  locations: Locations,
  pageMode: PageMode,
  permissions: EventLocationSettingsPermissions,
  onChangingArchiveStatus: OnChangingArchiveStatus,
};

export const createRows = ({
  locations,
  pageMode,
  permissions,
  onChangingArchiveStatus,
  t,
}: CreateRows): Rows => {
  return locations.map((location: Location) => {
    const rowActions = [];
    if (permissions?.canArchiveEventLocations) {
      rowActions.push({
        id: 'archive',
        text:
          pageMode === pageModeEnumLike.Archive ? t('Unarchive') : t('Archive'),
        onCallAction: () => {
          onChangingArchiveStatus({
            ...location,
            active: !location.active,
          });
        },
      });
    }

    const locationTypeValueToLabelMap = createLocationTypeValueToLabelMap();

    return {
      id: location.id,
      cells: [
        createTextCell({ rowId: location.id, text: location.name }),
        createTextCell({
          rowId: location.id,
          text: locationTypeValueToLabelMap[location.location_type],
        }),
        createTextCell({
          rowId: location.id,
          text: getEventTypesText(location.event_types),
        }),
      ],
      ...(rowActions.length > 0 ? { rowActions } : {}),
    };
  });
};

type UpdatedLocationsInfo = {
  locationsToCreate: Locations,
  locationsToUpdate: Locations,
};

export const findLocationsToUpdateOrCreate = (
  formData: Locations
): UpdatedLocationsInfo => {
  const locationsToUpdate = [];
  const locationsToCreate = [];
  formData
    .filter((rowData) => rowData.modified)
    .forEach((locationFormRow) => {
      const locationRequest = locationFormRow;
      delete locationRequest.modified;
      if (locationFormRow.id.startsWith(NEW_LOCATION_ID_PREFIX)) {
        locationsToCreate.push(locationRequest);
      } else {
        locationsToUpdate.push(locationRequest);
      }
    });
  return {
    locationsToCreate,
    locationsToUpdate,
  };
};
