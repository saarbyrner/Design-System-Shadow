/* eslint-disable camelcase */
// @flow
import structuredClone from 'core-js/stable/structured-clone';
import { withNamespaces } from 'react-i18next';
import { useState, useMemo, useEffect, useCallback } from 'react';

import {
  getEventTypes,
  updateEventType,
  createEventType,
} from '@kitman/services/src/services/OrganisationSettings';
import getSquads from '@kitman/services/src/services/getSquads';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { Option } from '@kitman/components/src/Select';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { CustomEventTypeIP } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import styles from '../utils/styles';
import { UNGROUPED_ID } from './utils/consts';
import {
  getNewAndUpdatedEvents,
  mapResponseEventTypeToIP,
  prepareEventsInGroups,
  reduceGroupsIntoEventNames,
} from './utils/groups-helpers';
import { TranslatedTable as Table } from './Table';
import SkeletonTable from './Skeletons/SkeletonTable';
import { EditFormTranslated as EditForm } from './EditForm';
import { HeaderTranslated as Header } from './Header';
import { pageModeEnumLike } from '../utils/enum-likes';
import { blurButton } from '../utils/helpers';
import { useGetCalendarSettingsPermissions } from '../utils/hooks';
import type {
  GroupedEventTypesArray,
  IdToEventTypeMap,
  SquadIdToNameMap,
} from './utils/types';
import type { PageMode } from '../utils/types';

type ChangeEventTypeArchiveStatus = {
  event: CustomEventTypeIP,
  shouldBeArchived: boolean,
};

const changeEventTypeArchiveStatus = async ({
  event: { id, ...restEvent },
  shouldBeArchived,
}: ChangeEventTypeArchiveStatus): Promise<void> => {
  await updateEventType({
    ...restEvent,
    id: +id,
    is_archived: shouldBeArchived,
  });
};

const EventTypes = ({ t }: { t: Translation }) => {
  const [eventTypes, setEventTypes] = useState<IdToEventTypeMap>(new Map());
  const [squadIdToNameMap, setSquadIdToNameMap] = useState<SquadIdToNameMap>(
    new Map()
  );
  const [allSquadsOptions, setAllSquadsOptions] = useState<Array<Option>>([]);

  const [fetchData, shouldFetchData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedEventTypes, setSelectedEventTypes] = useState<Set<string>>(
    new Set()
  );
  const [pageMode, setPageMode] = useState<PageMode>(pageModeEnumLike.View);

  const { groups, archivedGroups } = useMemo(() => {
    return prepareEventsInGroups([...eventTypes.values()], t);
  }, [eventTypes, t]);

  const [formData, setFormData] = useState<GroupedEventTypesArray>(groups);

  const { canEditCustomEvents } = useGetCalendarSettingsPermissions();

  useEffect(() => {
    getSquads().then((squads) => {
      setAllSquadsOptions(defaultMapToOptions(squads));
      const localSquadIdToNameMap: SquadIdToNameMap = new Map();
      squads.forEach(({ id, name }) => localSquadIdToNameMap.set(+id, name));
      setSquadIdToNameMap(localSquadIdToNameMap);
    });
  }, []);

  useEffect(() => {
    if (fetchData) {
      setIsLoading(true);
      try {
        getEventTypes().then(async (customEvents) => {
          const eventTypesMap: IdToEventTypeMap = new Map();

          customEvents.forEach((event) => {
            const iPEvent = mapResponseEventTypeToIP(event);
            eventTypesMap.set(iPEvent.id, iPEvent);
          });

          setEventTypes(eventTypesMap);
          shouldFetchData(false);
          setIsLoading(false);
        });
      } catch {
        setIsLoading(false);
      }
    }
  }, [fetchData]);

  const [eventNamesSet, setEventNamesSet] = useState<Set<string>>(
    reduceGroupsIntoEventNames(groups, archivedGroups).eventNamesSet
  );

  useEffect(() => {
    setFormData(groups);
    setEventNamesSet(
      reduceGroupsIntoEventNames(groups, archivedGroups).eventNamesSet
    );
  }, [groups, archivedGroups]);
  const [formHasDuplicateNames, setFormHasDuplicateNames] = useState(false);

  const ungroupedIndex = formData.findIndex(
    (group) => group.id === UNGROUPED_ID
  );

  const changeEventTypesArchiveStatusLocal = useCallback(
    ({
      eventIds,
      isArchived,
    }: {
      eventIds: Array<string>,
      isArchived: boolean,
    }) => {
      setEventTypes((prev) => {
        const clonedPrev: IdToEventTypeMap = structuredClone(prev);

        // change archive status
        eventIds.forEach((eventTypeId) => {
          const eventType = clonedPrev.get(eventTypeId);
          if (eventType) {
            clonedPrev.set(eventTypeId, {
              ...eventType,
              is_archived: isArchived,
            });
          }
        });

        // ungroup unarchived children whose parent is still archived
        if (!isArchived) {
          eventIds.forEach((eventTypeId) => {
            const eventType = clonedPrev.get(eventTypeId);
            if (eventType && eventType.parent_custom_event_type_id) {
              const eventParent = clonedPrev.get(
                eventType.parent_custom_event_type_id.toString()
              );
              if (eventParent && eventParent.is_archived)
                clonedPrev.set(eventTypeId, {
                  ...eventType,
                  parent_custom_event_type_id: null,
                });
            }
          });
        }
        return clonedPrev;
      });
    },
    []
  );

  const groupRowAction = useCallback(
    async (groupIndex: number) => {
      const isArchiveMode = pageMode === pageModeEnumLike.Archive;
      const { children, ...restParent } = isArchiveMode
        ? archivedGroups[groupIndex]
        : groups[groupIndex];
      const eventIds = [restParent.id];
      const newArchivedStatus = !isArchiveMode;
      setIsLoading(true);
      const promises = [
        changeEventTypeArchiveStatus({
          // $FlowIgnore(incompatible-use) the type is OK - Flow doesn't like ...
          event: restParent,
          shouldBeArchived: newArchivedStatus,
        }),
      ];
      children.forEach((event) => {
        eventIds.push(event.id);
        promises.push(
          changeEventTypeArchiveStatus({
            // $FlowIgnore(prop-missing) - verified in the row above that the event is valid
            event,
            shouldBeArchived: newArchivedStatus,
          })
        );
      });
      await Promise.all(promises);
      changeEventTypesArchiveStatusLocal({
        eventIds,
        isArchived: newArchivedStatus,
      });
      setIsLoading(false);
    },
    [pageMode, changeEventTypesArchiveStatusLocal, archivedGroups, groups]
  );

  const eventRowAction = useCallback(
    async (id: string) => {
      const event = eventTypes.get(id);
      if (!event) return;
      const newArchivedStatus = !event.is_archived;
      setIsLoading(true);
      await changeEventTypeArchiveStatus({
        event,
        shouldBeArchived: newArchivedStatus,
      });
      changeEventTypesArchiveStatusLocal({
        eventIds: [id],
        isArchived: newArchivedStatus,
      });
      setIsLoading(false);
    },
    [changeEventTypesArchiveStatusLocal, eventTypes]
  );

  const HeaderMemoized = useMemo(() => {
    const onSavingForm = async () => {
      setIsLoading(true);
      const { newEvents, updatedEvents, newGroups } = getNewAndUpdatedEvents({
        formData,
        eventTypes,
      });
      const newGroupsPromises = newGroups.map(({ children, ...restNewGroup }) =>
        createEventType(restNewGroup)
      );

      const newlyCreatedGroups = await Promise.all(newGroupsPromises);

      const newGroupNewEventsPromises = [];
      newlyCreatedGroups.forEach((newlyCreatedGroup, index) => {
        const newParentId = newlyCreatedGroup.id;
        newGroups[index].children.forEach((newEventInGroup) => {
          newGroupNewEventsPromises.push(
            createEventType({
              ...newEventInGroup,
              parent_custom_event_type_id: newParentId,
            })
          );
        });
      });

      const newEventsPromises = newEvents.map((event) =>
        createEventType(event)
      );
      const updateEventsPromises = updatedEvents.map(({ id, ...restEvent }) =>
        updateEventType({ ...restEvent, id: +id })
      );

      await Promise.all([
        ...newEventsPromises,
        ...updateEventsPromises,
        ...newGroupNewEventsPromises,
      ]);
      // does not set loading as false since it will be set to false after fetching the data is finished.
      // setting it as false here and then true in the useEffect will cause a (very short) UI flick of skeleton/no skeleton
      shouldFetchData(true);
    };

    const resetSelection = () => setSelectedEventTypes(new Set());

    const changeArchiveStatusForSelected = async ({
      shouldBeArchived,
    }: {
      shouldBeArchived: boolean,
    }) => {
      setIsLoading(true);
      const promises = [];
      eventTypes.forEach((event) => {
        const { id, parent_custom_event_type_id } = event;
        if (selectedEventTypes.has(id.toString())) {
          const eventToUpdate: CustomEventTypeIP = { ...event };
          if (
            !shouldBeArchived &&
            parent_custom_event_type_id &&
            !selectedEventTypes.has(parent_custom_event_type_id.toString())
          ) {
            // parent is archived and child is being unarchived - child is ungrouped
            eventToUpdate.parent_custom_event_type_id = null;
          }
          promises.push(
            changeEventTypeArchiveStatus({
              event: eventToUpdate,
              shouldBeArchived,
            })
          );
        }
      });
      await Promise.all(promises);
      changeEventTypesArchiveStatusLocal({
        eventIds: [...selectedEventTypes],
        isArchived: shouldBeArchived,
      });

      resetSelection();
      setIsLoading(false);
    };

    const resetForm = () => setFormData(groups);

    const changeMode = (
      pageModeToChangeTo: PageMode,
      event: SyntheticEvent<HTMLButtonElement>
    ) => {
      resetSelection();
      setPageMode(pageModeToChangeTo);
      blurButton(event);
    };

    const isSaveButtonDisabled = eventNamesSet.has('') || formHasDuplicateNames;
    return (
      <Header
        isSaveButtonDisabled={isSaveButtonDisabled}
        isLoading={isLoading}
        pageMode={pageMode}
        onSave={async (event) => {
          changeMode(pageModeEnumLike.View, event);
          await onSavingForm();
          resetForm();
        }}
        onCancel={(event) => {
          resetForm();
          changeMode(pageModeEnumLike.View, event);
        }}
        onEdit={(event) => {
          changeMode(pageModeEnumLike.Edit, event);
        }}
        onArchive={() =>
          changeArchiveStatusForSelected({ shouldBeArchived: true })
        }
        onViewArchive={(event) => {
          changeMode(pageModeEnumLike.Archive, event);
        }}
        onExitArchive={(event) => changeMode(pageModeEnumLike.View, event)}
        onUnarchive={() =>
          changeArchiveStatusForSelected({ shouldBeArchived: false })
        }
      />
    );
  }, [
    changeEventTypesArchiveStatusLocal,
    selectedEventTypes,
    groups,
    pageMode,
    formData,
    eventNamesSet,
    formHasDuplicateNames,
    eventTypes,
    isLoading,
  ]);

  const isArchiveMode = pageMode === pageModeEnumLike.Archive;

  const renderContent = () => {
    switch (pageMode) {
      case pageModeEnumLike.Edit:
        if (canEditCustomEvents) {
          // the user shouldn't be able to get here without the permissions (the button is not shown), just making sure
          return (
            <EditForm
              formData={formData}
              onFormChange={(newGroups) => {
                const { eventNamesSet: reducedEventNamesSet, duplicatesExist } =
                  reduceGroupsIntoEventNames(newGroups, archivedGroups);
                setFormHasDuplicateNames(duplicatesExist);
                setEventNamesSet(reducedEventNamesSet);
                setFormData(newGroups);
              }}
              eventNamesSet={eventNamesSet}
              ungroupedIndex={ungroupedIndex}
              allSquadsOptions={allSquadsOptions}
            />
          );
        }
        return undefined;

      default:
        return isLoading ? (
          <SkeletonTable />
        ) : (
          <Table
            data={isArchiveMode ? archivedGroups : groups}
            selectedEventTypes={selectedEventTypes}
            setSelectedEventTypes={setSelectedEventTypes}
            pageMode={pageMode}
            eventRowAction={eventRowAction}
            groupRowAction={groupRowAction}
            squadIdToNameMap={squadIdToNameMap}
          />
        );
    }
  };

  return (
    <div css={styles.pageContainer}>
      {HeaderMemoized}
      {renderContent()}
    </div>
  );
};

export const EventTypesTranslated = withNamespaces()(EventTypes);
export default EventTypes;
