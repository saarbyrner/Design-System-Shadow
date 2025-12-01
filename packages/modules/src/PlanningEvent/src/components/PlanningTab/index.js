// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect, useContext } from 'react';
import _isEqual from 'lodash/isEqual';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { makeFavorite, deleteFavorite } from '@kitman/services';
import {
  searchDrills,
  searchPrinciples,
  createEventActivity,
  updateEventActivity,
  updateEventActivityDrill,
  reorderEventActivities,
  createDrill,
  getStaffOnly,
  getEventActivityGlobalStates,
  getEventsUsers,
  type EventActivityDrillsType,
  type EventActivityFilterParams,
} from '@kitman/services/src/services/planning';
import { type Options } from '@kitman/components/src/types';
import {
  IconButton,
  AppStatus,
  ActivityDrillPanelTranslated as ActivityDrillPanel,
} from '@kitman/components';
import { zIndices, errors } from '@kitman/common/src/variables';
import {
  type Event,
  type EventActivityV2,
  type EventActivityDrillV2,
  type SportType,
} from '@kitman/common/src/types/Event';
import { type Principle } from '@kitman/common/src/types/Principles';
import { type ActivityType } from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import {
  PLANNING_SIDE_PANEL_STATES,
  type PlanningSidePanelStates,
  type RequestStatus,
  type LibraryDrillToUpdate,
} from '@kitman/modules/src/PlanningEvent/types';
import {
  transformFilesForUpload,
  type AttachedFile,
} from '@kitman/common/src/utils/fileHelper';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  getAddDrillToSessionData,
  getDrillData,
} from '@kitman/common/src/utils/TrackingData/src/data/planningHub/getPlanningHubEventData';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import { useEventTracking, useIsMountedCheck } from '@kitman/common/src/hooks';

import { PlanningEventContext } from '../../contexts/PlanningEventContext';
import { startFileUpload, finishFileUpload } from '../../services/fileUpload';
import {
  ActivityPrinciplesPanelTranslated as ActivityPrinciplesPanel,
  useActivityPrinciples,
} from '../ActivityPrinciplesPanel';
import { DrillLibraryPanelTranslated as DrillLibraryPanel } from './components/DrillLibraryPanel';
import {
  DeleteDrillFromSessionModal,
  UpdateDrillLibraryItemModal,
} from './components/ConfirmationModals';
import SortableActivity from './components/SortableActivity';
import DrillItem from './components/DrillItem';
import style from './style';

type Props = I18nProps<{
  areCoachingPrinciplesEnabled: boolean,
  activities: Array<EventActivityV2>,
  activityTypes: Array<ActivityType>,
  event: Event,
  organisationSport: SportType,
  onActivitiesUpdate: (newActivities: Array<EventActivityV2>) => void,
  onAlreadyAddedPrinciple?: (name: string) => void,
  onOpenTab?: (tabHash: string) => void,
  squadId: number,
}>;

const newActivityPlaceholder: EventActivityV2 = {
  athletes: [],
  principles: [],
  users: [],
  event_activity_ids: [],
  id: 0,
  duration: null,
  event_activity_type: { id: 0, name: '', squads: [] },
};

export default function PlanningTab(props: Props) {
  const checkIsMounted = useIsMountedCheck();
  const { trackEvent } = useEventTracking();
  const { planningState, dispatch } = useContext(PlanningEventContext);
  const [draggedActivityId, setDraggedActivityId] =
    useState<?EventActivityV2>(null);
  const [activities, setActivities] = useState<Array<EventActivityV2>>([]);
  const [libraryDrillToUpdate, setLibraryDrillToUpdate] =
    useState<LibraryDrillToUpdate>({
      drill: null,
      diagram: null,
      attachments: null,
    });

  // eslint-disable-next-line no-unused-vars
  const [selectValueActivityType, setSelectValueActivityType] = useState<
    Array<?Options>
  >(defaultMapToOptions(props.activityTypes) ?? []);
  const [drillPrinciples, setDrillPrinciples] = useState<Array<?Options>>([]);
  const [staffMembers, setStaffMembers] = useState<Array<?Options>>([]);
  const [drillActivityToDelete, setDrillActivityToDelete] =
    useState<?EventActivityV2>(null);
  const [activityPanelMode, setActivityPanelMode] =
    useState<PlanningSidePanelStates>(PLANNING_SIDE_PANEL_STATES.None);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('LOADING');
  const [drillRequestStatus, setDrillRequestStatus] =
    useState<RequestStatus>('LOADING');
  const [drillLibrary, setDrillLibrary] = useState<Array<EventActivityDrillV2>>(
    []
  );
  const [drillLibraryFilters, setDrillLibraryFilters] =
    useState<EventActivityFilterParams>({
      search_expression: '',
      principle_ids: [],
      event_activity_type_ids: [],
      user_ids: [],
      squad_ids: [props.squadId],
      archived: false,
    });
  const [nextDrillId, setNextDrillId] = useState<?number>(null);
  const [selectedActivityIndex, setSelectedActivityIndex] =
    useState<?number>(null);
  const [
    activityNameInputInvalidityReason,
    setActivityNameInputInvalidityReason,
  ] = useState<string>('');

  const [selectedDrill, setSelectedDrill] = useState<{
    initial: EventActivityDrillV2,
    current: EventActivityDrillV2,
  }>({
    initial: ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES,
    current: ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES,
  });
  const setDrillFromActivityDrillPanel = (
    stateUpdate:
      | EventActivityDrillV2
      | ((EventActivityDrillV2) => EventActivityDrillV2)
  ) => {
    if (typeof stateUpdate === 'object') {
      setSelectedDrill({ initial: stateUpdate, current: stateUpdate });
    } else if (typeof stateUpdate === 'function') {
      setSelectedDrill(({ current, initial }) => {
        const next = stateUpdate(current);
        return {
          current: next,
          initial: _isEqual(next, ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES)
            ? ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES
            : initial,
        };
      });
    }
  };

  const [draggedDrillSortableId, setDraggedDrillSortableId] =
    useState<?number>(null);
  const [draggedDrill, setDraggedDrill] =
    useState<?{ id: number, name: string }>(null);
  const [isNewActivityLoading, setIsNewActivityLoading] =
    useState<boolean>(false);
  useEffect(() => {
    if (!draggedDrillSortableId) return;
    setActivities((prevActivities) => [
      ...prevActivities,
      {
        ...newActivityPlaceholder,
        id: draggedDrillSortableId,
      },
    ]);
  }, [draggedDrillSortableId]);

  const [panelOpenerId, setPanelOpenerId] = useState<?number>();

  const getAndSetFavoriteDrills = async () => {
    let response: EventActivityDrillsType = {};
    try {
      response = await searchDrills({
        ...drillLibraryFilters,
        only_favorites: true,
      });
    } catch {
      if (!checkIsMounted()) return;
      setDrillRequestStatus('FAILURE');
      return;
    }
    const favoriteDrills = (response.event_activity_drills || []).map((d) => ({
      ...d,
      isFavorite: true,
    }));
    if (!checkIsMounted()) return;
    setDrillLibrary((prev) => [
      ...prev.filter(({ isFavorite }) => !isFavorite),
      ...favoriteDrills,
    ]);
    setDrillRequestStatus('SUCCESS');
  };

  const getAndSetNonFavoriteDrills = async (nextId?: ?number) => {
    let response: EventActivityDrillsType = {};
    try {
      response = await searchDrills({
        ...drillLibraryFilters,
        exclude_favorites: true,
        nextId,
      });
    } catch {
      if (!checkIsMounted()) return;
      setDrillRequestStatus('FAILURE');
      return;
    }
    if (!checkIsMounted()) return;
    setNextDrillId(response.next_id);
    const nonFavoriteDrills = (response.event_activity_drills || []).map(
      (d) => ({
        ...d,
        isFavorite: false,
      })
    );
    if (nextId) {
      setDrillLibrary((prev) => [...prev, ...nonFavoriteDrills]);
    } else {
      setDrillLibrary((prev) => [
        ...prev.filter(({ isFavorite }) => isFavorite),
        ...nonFavoriteDrills,
      ]);
    }
    setDrillRequestStatus('SUCCESS');
  };

  // `libraryId` is the value of `event_activity_drill_library_id` of a drill.
  const toggleLibraryDrillFavoriteState = async (libraryId: number) => {
    const isFavorite = drillLibrary.find(
      (d) => d.event_activity_drill_library_id === libraryId
    )?.isFavorite;
    try {
      if (isFavorite) {
        await deleteFavorite(libraryId, 'event_activity_drill_libraries', true);
      } else {
        await makeFavorite(libraryId, 'event_activity_drill_libraries', true);
      }
    } catch {
      setDrillRequestStatus('FAILURE');
    }
    setDrillLibrary((prev) => [
      ...prev.map((d) => {
        if (d.event_activity_drill_library_id === libraryId) {
          return {
            ...d,
            isFavorite: !isFavorite,
          };
        }
        return { ...d };
      }),
    ]);
  };

  useEffect(() => {
    const fetchAndSetPrinciples = async () => {
      let principles;

      try {
        principles = await searchPrinciples({ isForCurrentSquadOnly: true });
      } catch {
        if (!checkIsMounted()) return;
        setRequestStatus('FAILURE');
        return;
      }
      if (!checkIsMounted()) return;

      setRequestStatus('SUCCESS');
      setDrillPrinciples(
        defaultMapToOptions(principles).map((principle) => ({
          ...principle,
          label: getPrincipleNameWithItems(principle),
        })) ?? []
      );
    };

    const fetchAndSetStaffMembers = async () => {
      let staff;

      try {
        staff = await getStaffOnly();
      } catch {
        if (!checkIsMounted()) return;
        setRequestStatus('FAILURE');
        return;
      }
      if (!checkIsMounted()) return;

      setRequestStatus('SUCCESS');
      setStaffMembers(
        staff?.map(({ fullname, id }) => ({
          label: fullname,
          value: id,
        })) ?? []
      );
    };

    if (props.areCoachingPrinciplesEnabled) fetchAndSetPrinciples();
    fetchAndSetStaffMembers();
  }, []);

  useEffect(() => {
    getAndSetFavoriteDrills();
  }, [drillLibraryFilters, activities]);

  useEffect(() => {
    getAndSetNonFavoriteDrills();
  }, [drillLibraryFilters, activities]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setActivities(props.activities);
  }, []);

  const fetchAndSetParticipantsCountsForActivities = async () => {
    let athletesCounts;
    let availableStaff;
    try {
      [athletesCounts, availableStaff] = await Promise.all([
        getEventActivityGlobalStates({
          eventId: props.event.id,
          eventActivityIds: activities.map(({ id }) => id),
        }),
        getEventsUsers({
          eventId: props.event.id,
        }),
      ]);
    } catch {
      if (!checkIsMounted()) return;
      setRequestStatus('FAILURE');
      return;
    }

    if (!checkIsMounted()) return;
    setActivities(
      activities.map((activity) => {
        const { count: available, totalCount: total } =
          athletesCounts.find(
            ({ eventActivityId }) => eventActivityId === activity.id
          ) ?? {};

        return {
          ...activity,
          participants: {
            athletes: {
              available,
              total,
            },
            staff: {
              available: availableStaff.filter(({ event_activity_ids: ids }) =>
                ids.includes(activity.id)
              ).length,
              total: props.event.event_users.length,
            },
          },
        };
      })
    );
  };

  useEffect(() => {
    if (
      activities.length === 0 ||
      activities.every(({ participants }) => participants)
    ) {
      return;
    }

    fetchAndSetParticipantsCountsForActivities();
  }, [activities]);

  useEffect(() => {
    if (activities.length === 0) return;

    fetchAndSetParticipantsCountsForActivities();
  }, [planningState.athleteEvents, planningState.staff]);

  const uploadFile = async ({
    file,
    attachmentId,
    presignedPost,
  }: {
    file: AttachedFile,
    attachmentId: number,
    presignedPost: Object,
  }) => {
    try {
      await startFileUpload(file.file, attachmentId, presignedPost);
    } catch {
      setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.None);
      setRequestStatus('FAILURE');
    }
    finishFileUpload(attachmentId);
  };

  const addActivity = (drillId: number, order?: number) => {
    setIsNewActivityLoading(true);
    createEventActivity({ eventId: props.event.id, drillId }).then(
      (activity) => {
        setActivities((prevActivities) => {
          setIsNewActivityLoading(false);
          let newActivities;
          if (order) {
            newActivities = [...prevActivities];
            newActivities.splice(order - 1, 1, activity);
            newActivities = newActivities.map((a, i) => ({
              ...a,
              order: i + 1,
            }));

            reorderEventActivities({
              eventId: props.event.id,
              activities: newActivities.map(({ id, order: o }) => ({
                event_activity_id: id,
                order: o ?? 0,
              })),
            });
          } else {
            newActivities = [...prevActivities, activity];
          }

          props.onActivitiesUpdate(newActivities);
          return newActivities;
        });
        dispatch({
          type: 'ADD_DRILL',
          drillId: activity.id,
        });
      }
    );
    const isFavorite =
      drillLibrary.find((d) => d.id === drillId)?.isFavorite ?? false;
    trackEvent(
      `Calendar — Session details — Planning — Add drill (Add a drill to a session)`,
      getAddDrillToSessionData({ isFavorite })
    );
  };

  const resetDrillSidePanelState = () => {
    setSelectedDrill({
      initial: ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES,
      current: ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES,
    });
    setSelectedActivityIndex(null);
    setPanelOpenerId(null);
    setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.None);
    setActivityNameInputInvalidityReason('');
  };

  // handles edit and create of activity drill
  const handleUpdateToActivities = async ({
    diagram,
    attachments,
    drill,
    isCreate,
    isUpdate,
  }: {
    diagram: ?AttachedFile,
    attachments: ?Array<AttachedFile>,
    drill: EventActivityDrillV2,
    isCreate?: boolean,
    isUpdate?: boolean,
  }) => {
    setRequestStatus('SUCCESS');
    if (diagram) {
      // A file upload needs to be waited to finish, otherwise an activity
      // won’t show its drill diagram.
      await uploadFile({
        file: diagram,
        attachmentId:
          typeof drill.diagram?.id === 'number' ? drill.diagram.id : -1,
        presignedPost: drill.diagram?.presigned_post || {},
      });
    }

    const attachmentsToUpload = drill.attachments?.filter(
      (attachment) => !attachment?.confirmed
    );

    await Promise.all(
      attachmentsToUpload?.map((attachment, i) => {
        if (!attachment || !attachments) {
          return null;
        }
        return uploadFile({
          file: attachments[i],
          attachmentId: attachment?.id ?? -1,
          presignedPost: attachment?.presigned_post,
        });
      }) || []
    );

    if (isCreate) {
      addActivity(drill.id);
    } else if (isUpdate) {
      setActivities((prev) => {
        const newActivities = prev.slice();
        if (typeof selectedActivityIndex !== 'number') {
          return newActivities;
        }
        const actToUpdate = newActivities[selectedActivityIndex];

        const currentDrillId = drill.id;
        const updatingDrillId = actToUpdate.event_activity_drill?.id;
        const currentSessionTypeActivityId = drill.event_activity_type?.id;
        const updatingDrillActivityId =
          actToUpdate.event_activity_drill?.event_activity_type?.id;
        // 1). The structure of an original ITEM in a session plan had both a
        // 'Session Type' and a 'Drill Session Type' this has now been updated
        // to only have a 'Drill Session Type' but because of previous
        // examples/migrated data we still must accommodate for it. (This is
        // why we update activity type if drill is added to library or activity
        // type is changed) everything else only requires updating the drill.
        if (
          !(
            currentDrillId === updatingDrillId &&
            currentSessionTypeActivityId === updatingDrillActivityId
          )
        ) {
          updateEventActivity({
            eventId: props.event.id,
            activityId: actToUpdate.id,
            attributes: {
              event_activity_drill_id: drill.id,
            },
          });
        }
        // 2). ensure event_activity_type is present before updating the
        // activity 'Session Type' to the newly selected 'Drill Session Type'
        if (drill.event_activity_type) {
          actToUpdate.event_activity_type = drill.event_activity_type;
        }
        actToUpdate.event_activity_drill = drill;
        return newActivities;
      });
    }
    resetDrillSidePanelState();
  };

  // handles edit and create of activity drill
  const onComposeActivityDrill = async ({
    drill,
    diagram,
    attachments,
  }: LibraryDrillToUpdate): Promise<Error | null> => {
    setActivityNameInputInvalidityReason('');
    if (!drill) return null;
    setRequestStatus('LOADING');
    const newDiagram = diagram && {
      original_filename: diagram.filename,
      filetype: diagram.fileType,
      filesize: diagram.fileSize,
      name: diagram.fileTitle,
    };
    const newAttachments = transformFilesForUpload(
      attachments ?? ([]: Array<AttachedFile>)
    );
    const newDrillDetails = {
      ...drill,
      event_activity_type_id:
        drill.event_activity_type_id ||
        drill.event_activity_type?.id ||
        ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES.event_activity_type_id,
      event_activity_drill_label_ids: drill.event_activity_drill_labels.map(
        ({ id }) => id
      ),
      diagram: newDiagram || drill.diagram,
      attachments: [...(drill.attachments || []), ...newAttachments],
    };
    if (drill.id === ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES.id) {
      let createdDrill;
      try {
        createdDrill = await createDrill(newDrillDetails);
      } catch (e) {
        const { status, data } = e.response;

        if (
          status === errors.NAME_HAS_BEEN_TAKEN_ERROR.code &&
          data.name[0] === errors.NAME_HAS_BEEN_TAKEN_ERROR.message
        ) {
          setActivityNameInputInvalidityReason(
            errors.NAME_HAS_BEEN_TAKEN_ERROR.message
          );
          return e;
        }

        setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.None);
        setActivityNameInputInvalidityReason('');
        setRequestStatus('FAILURE');
      }
      trackEvent(
        `Calendar — Session details — Planning tab — Add drill — Create new drill — Add (create a new drill)`,
        getDrillData({
          principles: drill.principle_ids,
          isLibrary: !!drill?.library,
        })
      );

      handleUpdateToActivities({
        diagram,
        attachments,
        drill: createdDrill ?? {},
        isCreate: true,
      });
    } // checking if the drill item is the same as initial drill state if it is no need to send request
    else if (
      _isEqual(drill, selectedDrill.initial) &&
      !diagram &&
      !attachments
    ) {
      resetDrillSidePanelState();
    } else {
      let updatedDrill;
      try {
        updatedDrill = await updateEventActivityDrill(newDrillDetails);
      } catch (e) {
        const { status, data } = e.response;

        if (
          status === errors.NAME_HAS_BEEN_TAKEN_ERROR.code &&
          data.name[0] === errors.NAME_HAS_BEEN_TAKEN_ERROR.message
        ) {
          setActivityNameInputInvalidityReason(
            errors.NAME_HAS_BEEN_TAKEN_ERROR.message
          );
          return e;
        }

        // todo test failure of create drill calls the app status
        setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.None);
        setActivityNameInputInvalidityReason('');
        setRequestStatus('FAILURE');
      }
      trackEvent(
        `Calendar — Session details — Planning tab — Drill detail — Update`,
        getDrillData({
          principles: drill.principle_ids,
          isLibrary: !!drill?.library,
        })
      );

      handleUpdateToActivities({
        diagram,
        attachments,
        drill: updatedDrill ?? {},
        isUpdate: true,
      });
    }
    return null;
  };

  const {
    principlesRequestStatus,
    principles,
    hasInitialPrinciples,
    hasPrincipleWithCategory,
    categories,
    hasPrincipleWithPhase,
    phases,
    types,
    draggedPrinciple,
    fetchPrinciples,
    onDragPrinciple,
    onDropPrinciple,
    searchFilterChars,
    filterPrinciplesByItem,
    filterPrinciplesBySearch,
  } = useActivityPrinciples();
  const [newPrinciple, setNewPrinciple] = useState<?Principle>();

  const onShowPrinciplesPanel = (id: number) => {
    setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.ManagePrinciples);
    setPanelOpenerId(id);

    if (principlesRequestStatus === 'LOADING') {
      fetchPrinciples();
    }
  };

  const renderModals = () => {
    if (libraryDrillToUpdate.drill) {
      return (
        <UpdateDrillLibraryItemModal
          libraryDrillToUpdate={libraryDrillToUpdate}
          isOpen={!!libraryDrillToUpdate.drill}
          onComposeActivityDrill={onComposeActivityDrill}
          setActivityPanelMode={setActivityPanelMode}
          setSelectedDrill={(drill) =>
            setSelectedDrill({ initial: drill, current: drill })
          }
          setLibraryDrillToUpdate={setLibraryDrillToUpdate}
          t={props.t}
        />
      );
    }

    if (drillActivityToDelete) {
      return (
        <DeleteDrillFromSessionModal
          dispatch={dispatch}
          drillActivityToDelete={drillActivityToDelete}
          setActivities={setActivities}
          setDrillActivityToDelete={setDrillActivityToDelete}
          onActivitiesUpdate={props.onActivitiesUpdate}
          eventId={props.event.id}
          t={props.t}
        />
      );
    }

    return null;
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={draggedActivityId && [restrictToVerticalAxis]}
        onDragStart={({ active }) => {
          const { drillId, drillName } = active.data.current;
          if (drillId) {
            setDraggedDrill({ id: drillId, name: drillName });
            setDraggedDrillSortableId(active.id);
            return;
          }
          setDraggedActivityId(active.id);
        }}
        onDragEnd={({ over }) => {
          if (!draggedDrillSortableId && draggedActivityId !== over.id) {
            setActivities((prevActivities) => {
              const newActivities = arrayMove(
                prevActivities,
                prevActivities.findIndex(({ id }) => draggedActivityId === id),
                prevActivities.findIndex(({ id }) => over.id === id)
              );

              reorderEventActivities({
                eventId: props.event.id,
                activities: newActivities.map(({ id }, i) => ({
                  event_activity_id: id,
                  order: i + 1,
                })),
              });

              props.onActivitiesUpdate(newActivities);
              return newActivities;
            });
          }
          if (draggedDrillSortableId && draggedDrill) {
            setActivities((prevActivities) => {
              let newActivities;

              if (activities.findIndex(({ id }) => id === over.id) > -1) {
                newActivities = arrayMove(
                  prevActivities,
                  prevActivities.findIndex(
                    ({ id }) => draggedDrillSortableId === id
                  ),
                  prevActivities.findIndex(({ id }) => over.id === id)
                );

                addActivity(
                  draggedDrill.id,
                  newActivities.findIndex(
                    ({ id }) => draggedDrillSortableId === id
                  ) + 1
                );
              } else {
                newActivities = [...prevActivities].slice(0, -1);
              }

              return newActivities;
            });
          }
          setDraggedDrill(null);
          setDraggedDrillSortableId(null);

          setDraggedActivityId(null);
        }}
        onDragCancel={() => {
          setActivities((prevActivities) => [...prevActivities].slice(0, -1));
        }}
      >
        <SortableContext
          items={activities}
          strategy={verticalListSortingStrategy}
        >
          {activities.map((activity, index) => (
            // JSON.stringify(activity) is used as a key instead of activity.id
            // because otherwise changes to activity.participants don’t trigger
            // re-renders.
            <div data-testid="activity-wrapper" key={JSON.stringify(activity)}>
              <div css={style.activity}>
                <SortableActivity
                  areCoachingPrinciplesEnabled={
                    props.areCoachingPrinciplesEnabled
                  }
                  id={activity.id}
                  isLoading={isNewActivityLoading}
                  isNew={activity.id === draggedDrillSortableId}
                  activityIndex={index}
                  activity={activity}
                  organisationSport={props.organisationSport}
                  arePrinciplesEdited={
                    activityPanelMode ===
                    PLANNING_SIDE_PANEL_STATES.ManagePrinciples
                  }
                  panelOpenerId={panelOpenerId}
                  draggedPrinciple={draggedPrinciple}
                  newPrinciple={newPrinciple}
                  onActivityUpdate={(newActivity) => {
                    updateEventActivity({
                      eventId: props.event.id,
                      activityId: activity.id,
                      attributes: {
                        duration: newActivity.duration,
                        note: newActivity.note,
                        order_label: newActivity.order_label,
                        area_size: newActivity.area_size,
                        principle_ids: newActivity.principles.map(({ id }) =>
                          Number.parseInt(id.toString(), 10)
                        ),
                      },
                    });
                    setActivities((prev) =>
                      [...prev].map((prevActivity) => {
                        if (prevActivity.id === newActivity.id)
                          return newActivity;
                        return prevActivity;
                      })
                    );
                    setNewPrinciple(null);
                  }}
                  onDeleteActivity={() => setDrillActivityToDelete(activity)}
                  onOpenDrill={() => {
                    const drill =
                      activity.event_activity_drill ||
                      ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES;
                    setSelectedDrill({ initial: drill, current: drill });
                    setSelectedActivityIndex(index);
                    setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.ViewDrill);
                    setPanelOpenerId(activity.id);
                  }}
                  onOpenPrinciples={() => onShowPrinciplesPanel(activity.id)}
                  onAlreadyAddedPrinciple={props.onAlreadyAddedPrinciple}
                  onOpenTab={props.onOpenTab}
                  t={props.t}
                />
              </div>
              <hr css={style.separator} />
            </div>
          ))}
          <div>
            <div css={style.manageActivityButtons(activities.length)}>
              {window.getFlag('coaching-library') && (
                <div css={style.addActivityButton}>
                  <IconButton
                    icon="icon-add"
                    text={props.t('Add drill from library')}
                    isBorderless
                    onClick={() =>
                      setActivityPanelMode(
                        PLANNING_SIDE_PANEL_STATES.DrillLibrary
                      )
                    }
                  />
                </div>
              )}
              <div
                css={style.createActivityButton(
                  window.getFlag('coaching-library')
                )}
              >
                <IconButton
                  icon="icon-add"
                  testId="create-new-drill-button"
                  text={props.t('Create new drill')}
                  isBorderless
                  onClick={() =>
                    setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.CreateDrill)
                  }
                />
              </div>
            </div>
            <hr css={style.separator} />
          </div>
        </SortableContext>
        <DragOverlay zIndex={draggedDrillSortableId && zIndices.dragOverlay}>
          {draggedActivityId && (
            <SortableActivity
              id={draggedActivityId}
              isDragged
              activity={activities.find(({ id }) => draggedActivityId === id)}
              activityIndex={activities.findIndex(
                ({ id }) => draggedActivityId === id
              )}
              organisationSport={props.organisationSport}
              areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
              t={props.t}
            />
          )}
          {draggedDrillSortableId && draggedDrill && (
            <DrillItem
              name={draggedDrill.name}
              id={draggedDrillSortableId}
              sortableId={draggedDrillSortableId}
              isDragged
            />
          )}
        </DragOverlay>
        <DrillLibraryPanel
          areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
          activityTypes={selectValueActivityType}
          createDrill={() => {
            setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.CreateDrill);
          }}
          drillFilters={drillLibraryFilters}
          drillLibrary={drillLibrary}
          drillPrinciples={drillPrinciples}
          getNextDrillLibraryItems={() => {
            if (!nextDrillId) return;
            getAndSetNonFavoriteDrills(nextDrillId);
          }}
          isOpen={activityPanelMode === PLANNING_SIDE_PANEL_STATES.DrillLibrary}
          onClose={() => {
            setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.None);
            setActivityNameInputInvalidityReason('');
          }}
          sortableIdLowerBound={
            Math.max(...activities.map(({ id }) => id), activities.length) + 1
          }
          staffMembers={staffMembers}
          addActivity={addActivity}
          toggleFavorite={toggleLibraryDrillFavoriteState}
          requestStatus={drillRequestStatus}
          setDrillLibraryFilters={setDrillLibraryFilters}
        />
      </DndContext>
      <ActivityDrillPanel
        areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
        drill={selectedDrill.current}
        // initialDrillState is passed in order to keep state of the drill
        // update side panel, i.e. item is in library.
        initialDrillState={selectedDrill.initial}
        drillPrinciples={drillPrinciples}
        eventActivityTypes={selectValueActivityType}
        activityNameInputInvalidityReason={activityNameInputInvalidityReason}
        isOpen={
          activityPanelMode === PLANNING_SIDE_PANEL_STATES.CreateDrill ||
          activityPanelMode === PLANNING_SIDE_PANEL_STATES.ViewDrill
        }
        onClose={resetDrillSidePanelState}
        onComposeActivityDrill={onComposeActivityDrill}
        setLibraryDrillToUpdate={setLibraryDrillToUpdate}
        setSelectedDrill={setDrillFromActivityDrillPanel}
      />
      <ActivityPrinciplesPanel
        isOpen={
          activityPanelMode === PLANNING_SIDE_PANEL_STATES.ManagePrinciples
        }
        requestStatus={principlesRequestStatus}
        categories={categories}
        types={types}
        phases={phases}
        principles={principles}
        hasInitialPrinciples={hasInitialPrinciples}
        hasPrincipleWithCategory={hasPrincipleWithCategory}
        hasPrincipleWithPhase={hasPrincipleWithPhase}
        isAddButtonEnabled
        cssTop={0}
        onClose={() => {
          setActivityPanelMode(PLANNING_SIDE_PANEL_STATES.None);
          setPanelOpenerId(null);
        }}
        onFilterPrinciplesByItem={filterPrinciplesByItem}
        onFilterPrinciplesBySearch={filterPrinciplesBySearch}
        searchPrinciplesFilterChars={searchFilterChars}
        onDragPrinciple={onDragPrinciple}
        onDropPrinciple={onDropPrinciple}
        onAddPrinciple={(newPrincipleId) =>
          setNewPrinciple(principles.find(({ id }) => id === newPrincipleId))
        }
      />
      {renderModals()}
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </>
  );
}
export const PlanningTabTranslated = withNamespaces()(PlanningTab);
