// @flow
import { useState, useEffect, useCallback } from 'react';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { ToastId } from '@kitman/components/src/Toast/types';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { zIndices } from '@kitman/common/src/variables';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { RequestStatus } from '@kitman/common/src/types';
import type { SessionExerciseCopyData } from '@kitman/services/src/services/rehab/copyRehabSessionExercises';
import convertIssueType from '@kitman/services/src/services/rehab/issueTypeHelper';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import type {
  ExerciseTemplate,
  RehabSession,
  RehabDayMode,
  ExerciseCreationStructure,
  ClickModeTargetDetails,
  Exercise,
  RehabMode,
  ExerciseUpdateDetails,
  ExerciseReasonUpdateDetails,
} from './types';
import { openAddMedicalNotePanel } from '../../redux/actions';
import AddMedicalNoteSidePanel from '../../containers/AddMedicalNoteSidePanel';
import { RehabContainerTranslated as RehabContainer } from './components/RehabContainer';
import { RehabFiltersTranslated as RehabFilters } from './components/RehabFilters';
import { ExerciseListPanelTranslated as ExerciseListPanel } from './components/ExerciseListPanel';
import { CopyExercisesPanelTranslated as CopyExercisesPanel } from './components/CopyExercisesPanel';
import { RehabGroupsSidePanelTranslated as RehabGroupsSidePanel } from './components/RehabGroupsPanel';
import { LinkExercisesPanelTranslated as LinkExercisesPanel } from './components/LinkExercisesPanel';
import style from './style';
import { dropAnimation } from './animations';
import DragDummy from './components/DragDummy';
import collisionAlgorithm from './collisionAlgorithmClosestDroppable';
import keyboardCoordinates from './keyboardCoordinates';
import type { IssueType } from '../../types';
import { RehabDispatchContext } from './RehabContext';
import rehabNetworkActions from './RehabContext/rehabNetworkActions';
import fetchRehabSessions from './fetchRehabSessions';
import { useRehabReducer } from './hooks/useRehabReducer';
import RehabDeleteModal from './components/RehabDeleteModal';
import { PrintViewTranslated as PrintView } from './components/PrintView';
import type { RehabStateSession } from './hooks/useRehabReducer';
import keyCommands from './keyCommands';
import getLinkDetails from './toastLinkHelper';
import type { LinkType } from './toastLinkHelper';

type Props = {
  inMaintenance: boolean,
  athleteId: number,
  athleteName: string,
  // Properties for injury level rehab view
  issueOccurrenceId?: number,
  issueOccurrenceDate?: string,
  issueType?: IssueType,
  isChronicIssue?: boolean,

  hiddenFilters?: ?Array<string>,
};

const defaultRehabDayMode: RehabDayMode = '3_DAY';

const RehabTab = (props: I18nProps<Props>) => {
  const [creationIndex, setCreationIndex] = useState(0); // This needs to go to rehabState
  const [rehabDayMode, setRehabDayMode] = useState<?RehabDayMode>(null);
  const [rehabNoteDate, setRehabNoteDate] = useState<?string>(null);

  const [viewNotes, setViewNotes] = useState<boolean>(false);
  const [exerciseListIsOpen, setExerciseListIsOpen] = useState(false);
  const [rehabMode, setRehabMode] = useState<RehabMode>('DEFAULT');

  const [activeDate, setActiveDate] = useState<moment>(
    window.location.search.split('?display_date=')[1]
      ? moment(window.location.search.split('?display_date=')[1], 'YYYY-MM-DD')
      : moment().startOf('day')
  );
  const [fetchSessionsRequestStatus, setFetchSessionsRequestStatus] =
    useState<RequestStatus>('PENDING');
  const { permissions } = usePermissions();
  const { rehabState, dispatch } = useRehabReducer();
  const { organisation } = useOrganisation();
  const [allExercisesIds, setAllExercisesIds] = useState([]);
  const [displayEditAll, setDisplayEditAll] = useState(true);
  const { toasts, toastDispatch } = useToasts();
  const reduxDispatch = useDispatch();
  const { trackEvent } = useEventTracking();

  const getExerciseById = (exerciseId: number) => {
    let activeSection;
    let foundExercise;
    Object.keys(rehabState.sections).every((key) => {
      activeSection = {
        ...rehabState.sections[parseInt(key, 10)],
      }; // need to reuse rehabState as dealing with mixed in loop
      foundExercise = activeSection.exercise_instances.find(
        (exercise) => exercise.id === exerciseId
      );
      if (foundExercise) {
        return false;
      }
      return true;
    });
    return foundExercise;
  };

  const { data: isRehabCopyAutomaticallyRedirectEnabled } =
    useFetchOrganisationPreferenceQuery('automatically_redirect_rehab_copy');

  const changeRehabMode = (mode: RehabMode, leaveExercisePanelOpen = false) => {
    switch (mode) {
      case 'COPY_TO_MODE':
        dispatch({
          type: 'CLEAR_EDITING_EXERCISE_IDS',
        });
        setRehabMode(mode);
        break;
      case 'ADDING_TO_FIRST_SESSION':
        setRehabMode(mode);
        break;
      case 'GROUP_MODE':
        setRehabMode(mode);
        break;
      case 'LINK_TO_MODE':
        dispatch({
          type: 'CLEAR_EDITING_EXERCISE_IDS',
        });
        if (!props.inMaintenance) {
          return;
        }
        setRehabMode(mode);
        break;
      default:
        setRehabMode('DEFAULT');
        dispatch({
          type: 'CLEAR_COPY_SELECTIONS',
        });
        dispatch({
          type: 'CLEAR_GROUP_SELECTIONS',
        });
        dispatch({
          type: 'CLEAR_LINK_SELECTIONS',
        });
        break;
    }
    dispatch({
      type: 'HIGHLIGHT_SESSION',
      sessionId: null,
    });
    dispatch({
      type: 'SET_CLICK_MODE_TARGET',
      target: null,
    });
    dispatch({
      type: 'CLEAR_RECENTLY_ADDED_EXERCISE_IDS',
    });
    setExerciseListIsOpen(leaveExercisePanelOpen);
  };

  const refetchSessions = () => {
    if (rehabDayMode == null) {
      // So we don't try to make a request until had chance to get rehabDayMode from localStorage
      return;
    }
    setFetchSessionsRequestStatus('PENDING');
    fetchRehabSessions(
      props.issueOccurrenceId,
      props.issueType,
      rehabDayMode,
      activeDate,
      props.athleteId,
      props.inMaintenance,
      permissions.medical.notes.canView
    ).then(
      (sessions) => {
        dispatch({
          type: 'SET_REHAB_SESSIONS',
          rehabSessions: sessions,
        });

        if (rehabMode === 'ADDING_TO_FIRST_SESSION') {
          dispatch({
            type: 'SET_CLICK_MODE_TARGET',
            target: {
              targetSessionId: sessions[0].id,
              targetSectionId: sessions[0].sections[0].id,
            },
          });
        }
        setFetchSessionsRequestStatus('SUCCESS');
      },
      () => {
        setFetchSessionsRequestStatus('FAILURE');
      }
    );
  };

  const rehabNetworkCall = rehabNetworkActions(dispatch, refetchSessions);

  const performDelete = (deleteItem: ?Exercise | number) => {
    // deleteItem is the session number when a user is deleting an entire session
    // when a user is deleting an exercise it is the exercise object
    if (deleteItem != null && typeof deleteItem !== 'number') {
      const exerciseId = parseInt(deleteItem.id, 10);
      const sessionId = deleteItem.session_id;
      const sectionId = deleteItem.section_id;
      if (sessionId != null && sectionId != null) {
        // If we would have an empty section after delete then we should refetch the sessions
        // as will ensure empty section gets removed / created as a placeholder
        const emptySectionAfterDelete =
          rehabState.sections[sectionId].exercise_instances.length === 1;
        rehabNetworkCall.deleteExercise(
          sessionId,
          exerciseId,
          sectionId,
          emptySectionAfterDelete // Need to refresh sessions if section will be empty
        );
      }
    } else if (typeof deleteItem === 'number') {
      const foundSession = rehabState.sessions.find(
        (session) => session.id === deleteItem
      );
      if (!foundSession) {
        return;
      }
      const deleteParams = {
        rehab_sessions: [
          {
            id: foundSession.id,
            section_ids: foundSession.sections,
          },
        ],
        maintenance: props.inMaintenance,
        issues: props.issueOccurrenceId
          ? [
              {
                issue_type: convertIssueType(props.issueType) || 'injury',
                issue_id: props.issueOccurrenceId || 0, // Zero just for flow js
              },
            ]
          : undefined,
      };

      rehabNetworkCall.deleteEntireSession(deleteParams, {
        onSuccess: () => {
          if (foundSession.id) {
            trackEvent(performanceMedicineEventNames.deletedRehabSession, {
              ...determineMedicalLevelAndTab(),
              sessionType: props.inMaintenance ? 'Maintenance' : 'Rehab',
            });
          }
        },
      });
    }
  };

  const onDeleteExerciseShortcut = (exerciseId: number) => {
    const exercise = getExerciseById(exerciseId);
    if (exercise) {
      const exerciseName = exercise.exercise_name || exercise.reason || '';
      const deleteMessage = exercise.reason
        ? props.t('Are you sure you want to delete the reason')
        : props.t('Are you sure you want to delete the exercise');
      if (window.featureFlags['rehab-delete-exercise-confirmation']) {
        dispatch?.({
          type: 'REHAB_DELETE_MODAL',
          deleteRehabItem: exercise,
          deleteRehabContent: `${deleteMessage} ${exerciseName}?`,
        });
      } else {
        performDelete(exercise);
      }
    }
  };

  const moveActiveDate = (days: number) => {
    // $FlowIgnore[speculation-ambiguous]
    setActiveDate((prev) => moment(prev).add(days, 'days'));
  };

  const onKeydown = keyCommands({
    mode: rehabMode,
    changeRehabMode,
    dispatch,
    deleteExerciseCallback: onDeleteExerciseShortcut,
    moveActiveDateCallback: moveActiveDate,
    editingAll: !displayEditAll,
  });

  useEffect(() => {
    document.addEventListener('keydown', onKeydown, false);

    return function cleanup() {
      document.removeEventListener('keydown', onKeydown, false);
    };
  }); // Runs every render for now. TODO: we need to useCallback on onKeydown

  const closeToast = (id: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      keyboardCodes: {
        // Reserving enter for editing an exercise
        start: ['Space'],
        cancel: ['Escape'],
        end: ['Space'],
      },
      coordinateGetter: keyboardCoordinates,
    })
  );

  useEffect(() => {
    if (rehabNoteDate)
      reduxDispatch(
        openAddMedicalNotePanel({
          isAthleteSelectable: false,
          isDuplicatingNote: false,
        })
      );
  }, [rehabNoteDate]);

  useEffect(() => {
    if (getIsLocalStorageAvailable()) {
      setRehabDayMode(
        window.localStorage.getItem('REHAB_DAY_MODE') || defaultRehabDayMode
      );
      const storedStrValue = window.localStorage.getItem('REHAB_VIEW_NOTES');
      if (storedStrValue != null) {
        setViewNotes(JSON.parse(storedStrValue));
      } else {
        setViewNotes(false);
      }
    } else {
      setRehabDayMode(defaultRehabDayMode);
      setViewNotes(false);
    }
  }, []);

  // TODO: we may want to memo this
  const getRawSessions = (): Array<RehabSession> =>
    rehabState.sessions.map((session) => {
      return {
        ...session,
        sections: session.sections.map((id) => rehabState.sections[id]),
      };
    });

  useEffect(() => {
    const exerciseIds = [];
    Object.keys(rehabState.sections).forEach((key) => {
      const sectionItems = {
        ...rehabState.sections[parseInt(key, 10)],
      }; // need to reuse rehabState as dealing with mixed in loop
      sectionItems.exercise_instances.forEach((exercise) => {
        exerciseIds.push(exercise.id);
      });
    });

    setAllExercisesIds(exerciseIds);
  }, [rehabState.sections]);

  useEffect(() => {
    setDisplayEditAll((prev) => {
      // keep state when dragging an item
      if (rehabState.activeItem) {
        return prev;
      }
      return !allExercisesIds.every((exerciseId) =>
        rehabState.editingExerciseIds.includes(exerciseId)
      );
    });
  }, [
    allExercisesIds,
    rehabState.editingExerciseIds,
    rehabState.activeItem,
    displayEditAll,
  ]);

  useEffect(() => {
    refetchSessions();
  }, [
    props.issueOccurrenceId,
    props.issueType,
    rehabDayMode,
    activeDate,
    props.athleteId,
  ]);

  const copyExerciseToSession = (sessionId) => {
    const sessionIndex = rehabState.sessions.findIndex(
      (session) => session.id === sessionId
    );
    const data: SessionExerciseCopyData = {
      athlete_id: props.athleteId,
      exercise_instances_ids: rehabState.copyExerciseIds,

      insert_order_index: rehabState.lastOrderIndex,
      issue_type: props.isChronicIssue
        ? 'Emr::Private::Models::ChronicIssue'
        : props.issueType,
      issue_id: props.issueOccurrenceId,
    };

    /* add if sessionId is present and isn't negative number (i.e session needs to be created) */
    if (sessionId && sessionId > 0) {
      data.destination_session_ids = [sessionId];
    } else {
      // TODO: update BE to accept just a date portion rather than include time
      data.destination_session_dates = [
        rehabState.sessions[sessionIndex].end_time,
      ];
    }

    rehabNetworkCall.copyExercise(data);

    dispatch({
      type: 'SET_ACTIVE_ITEM',
      activeItem: null,
    });
  };

  const saveExerciseToSession = (
    orderIndex: number,
    session: RehabSession | RehabStateSession,
    makeEditable: boolean,
    sectionId: ?number
  ) => {
    if (!rehabState.activeItem || orderIndex === -1) {
      return;
    }
    const exerciseInstances: Array<ExerciseCreationStructure> = [
      {
        exercise_instance_id:
          typeof rehabState.activeItem.id === 'number'
            ? rehabState.activeItem.id
            : null,
        exercise_template_id: rehabState.activeItem.exercise_template_id,
        order_index: orderIndex,
        variations: rehabState.activeItem.variations,
        comment: rehabState.activeItem?.comment,
      },
    ];

    rehabNetworkCall.addToSession({
      data: {
        athleteId: props.athleteId,
        issueId: props.issueOccurrenceId,
        issueType: props.issueType,
        exerciseInstances,
        makeExerciseInstancesEditable: makeEditable,
        placeholderSessionId: session.isPlaceholderSession ? session.id : null,
        sessionId: session.isPlaceholderSession ? null : session.id,
        sessionDate: session.isPlaceholderSession ? session.start_time : null,
        sectionId: session.isPlaceholderSession ? null : sectionId,
        maintenance: props.inMaintenance,
      },
    });

    dispatch({
      type: 'SET_ACTIVE_ITEM',
      activeItem: null,
    });
  };

  const addClickedExerciseTemplateToSession = (template: ExerciseTemplate) => {
    let sessionIndex = 0;
    let sectionId;

    // If there is not clickModeTarget then use the first session and section available

    if (rehabState.clickModeTarget) {
      sessionIndex = rehabState.sessions.findIndex(
        (session) => session.id === rehabState.clickModeTarget?.targetSessionId
      );
      sectionId = rehabState.clickModeTarget?.targetSectionId;
    }

    // If the session from where click mode started is no longer in memory
    // We should close the exercise list panel
    if (sessionIndex === -1) {
      changeRehabMode('DEFAULT');
      return;
    }
    const session = rehabState.sessions[sessionIndex];

    if (sectionId == null) {
      if (session.sections.length > 0) {
        sectionId = session.sections[0];
      } else {
        return;
      }
    }

    const templateVariations = [template.defaultVariations];
    const updatedCreationIndex = creationIndex + 1;
    setCreationIndex(updatedCreationIndex);
    const templateDetails: ExerciseTemplate = {
      ...template,
      id: `${template.exercise_template_id}_${updatedCreationIndex}`,
      variations: templateVariations,
    };

    dispatch({
      type: 'SET_ACTIVE_ITEM',
      activeItem: templateDetails,
    });

    const endOfExercisesIndex =
      rehabState.sections[sectionId].exercise_instances.length + 1;
    const exerciseInstances: Array<ExerciseCreationStructure> = [
      {
        exercise_instance_id: null,
        exercise_template_id: templateDetails.exercise_template_id,
        order_index: endOfExercisesIndex,
        variations: templateVariations,
        comment: null,
      },
    ];
    rehabNetworkCall
      .addToSession({
        data: {
          athleteId: props.athleteId,
          issueId: props.issueOccurrenceId,
          issueType: props.issueType,
          exerciseInstances,
          makeExerciseInstancesEditable: true,
          placeholderSessionId: session.isPlaceholderSession
            ? session.id
            : null,
          sessionId: session.isPlaceholderSession ? null : session.id,
          sessionDate: session.isPlaceholderSession ? session.start_time : null,
          sectionId: session.isPlaceholderSession ? null : sectionId,
          maintenance: props.inMaintenance,
        },
        callback: {
          onSuccess: () => {
            if (session.isPlaceholderSession) {
              trackEvent(performanceMedicineEventNames.createdRehabSession, {
                ...determineMedicalLevelAndTab(),
                sessionDate: session.start_time,
                sessionType: props.inMaintenance ? 'Maintenance' : 'Rehab',
              });
            }
          },
        },
      })
      .then(
        () => {
          dispatch({
            type: 'SET_ACTIVE_ITEM',
            activeItem: null,
          });
        },
        () => {
          dispatch({
            type: 'SET_ACTIVE_ITEM',
            activeItem: null,
          });
        }
      );
  };

  const handleDragStart = (event) => {
    const { active } = event;

    if (
      active.data.current.type === 'exercise' ||
      active.data.current.type === 'exerciseTemplate'
    ) {
      // Is is an exercise template we are dragging ?
      // eslint-disable-next-line default-case
      switch (active.data.current.type) {
        case 'exerciseTemplate': {
          // As we are not yet calling the save endpoint but
          // need to be able to drag out same template multiple times
          // without an id clash, we increment a counter to use in a temporary id
          // NOTE: hope will not need this later or at minimum can reset counter when items saved
          const updatedCreationIndex = creationIndex + 1;
          setCreationIndex(updatedCreationIndex);
          const templateDetails: ExerciseTemplate = {
            type: 'exerciseTemplate',
            id: `${active.id}_${updatedCreationIndex}`,
            exercise_template_id: active.data.current.exercise_template_id,
            exercise_name: active.data.current.exercise_name,
            comment: null,
            variations: [active.data.current.defaultVariationsType],
            defaultVariations: active.data.current.defaultVariationsType,
            exerciseId: active.id,
            reason: active.data.current.reason || '',
          };
          dispatch({
            type: 'SET_ACTIVE_ITEM',
            activeItem: templateDetails,
          });

          break;
        }
        case 'exercise': {
          const sectionId = active.data.current.sortable.containerId;
          const index = active.data.current.sortable.index;
          dispatch({
            type: 'HIGHLIGHT_SESSION',
            sessionId: active.data.current.sessionId,
          });
          // NOTE: We can do any copying of the exercise we need in the reducer
          dispatch({
            type: 'ASSIGN_EXERCISE_AS_ACTIVE_ITEM',
            rehabCopyMode: rehabMode === 'COPY_TO_MODE',
            sectionId,
            index,
          });
          break;
        }
      }
    }
  };

  const handleDragOver = useDebouncedCallback((event) => {
    if (!event.over) {
      return;
    }

    // active is The thing being moved. Will be the same as activeItem in state. But this one has transform details.
    const active = event.active;
    const over = event.over;
    const overId = over.id;

    if (overId == null) {
      return;
    }

    if (overId === rehabState.activeItem?.id && rehabMode !== 'COPY_TO_MODE') {
      dispatch({
        type: 'HIGHLIGHT_SESSION',
        sessionId: over.data.current.sessionId,
      });
      return; // No need to do anything if over self
    }

    const overSectionId = over.data.current.sectionId;

    // NOTE template won't have sectionId but we consider it movingToAnotherSection
    // because the Exercise Template Side panel is not a section so any section for a template is 'new'
    const movingToAnotherSection =
      overSectionId !== active.data.current.sectionId ||
      rehabMode === 'COPY_TO_MODE';

    if (movingToAnotherSection) {
      let toPositionIndex = 0;

      if (over.data.current?.sortable) {
        // NOTE: toPositionIndex bellow is not 100% reliable
        // The sortable container may already contain the active item and so the index may be counting that
        // The MOVE_ACTIVE_ITEM_TO_NEW_SECTION reducer will correct for this if needed
        toPositionIndex = over.data.current.sortable.index; // Zero based index
        const sortableLength = over.data.current.sortable.items.length;
        const foundAlready = over.data.current.sortable.items.indexOf(
          rehabState.activeItem?.id
        );

        if (foundAlready !== -1 && foundAlready < toPositionIndex) {
          toPositionIndex -= 1;
        }

        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top +
            active.rect.current.translated.height * 0.5 >
            over.rect.top + over.rect.height * 0.5;

        toPositionIndex += isBelowOverItem ? 1 : 0;
        toPositionIndex = Math.max(
          0,
          Math.min(toPositionIndex, sortableLength)
        );
      }

      dispatch({
        type: 'HIGHLIGHT_SESSION',
        sessionId: over.data.current.sessionId,
      });
      if (typeof over.id === 'number') {
        dispatch({
          type: 'MOVE_ACTIVE_ITEM_TO_NEW_SECTION',
          rehabCopyMode: rehabMode === 'COPY_TO_MODE',
          sectionId: overSectionId,
          sessionId: over.data.current.sessionId,
          positionIndex: toPositionIndex,
        });
      }
    }
  }, 10); // Small delay just for safety to avoid possibility of fighting for array positions triggering excessive refreshes

  const handleDragMove = useDebouncedCallback((event) => {
    if (!event.over) {
      return;
    }
    if (
      event.over &&
      (rehabMode === 'COPY_TO_MODE' ||
        event.active.data.current.type === 'exerciseTemplate')
    ) {
      handleDragOver(event);
    }
  }, 10); // Small delay just for safety to avoid possibility of fighting for array positions triggering excessive refreshes

  const handleDragEnd = (event) => {
    dispatch({
      type: 'HIGHLIGHT_SESSION',
      sessionId: null,
    });

    if (!event.over) {
      // This would only happen if dragged away from any container, like up above the columns
      // We don't expect this to be common action so can just Re-fetch the sessions to reset things to how were last saved
      dispatch({
        type: 'SET_ACTIVE_ITEM',
        activeItem: null,
      });
      refetchSessions();
      return;
    }

    // ==================  OVER SOMETHING  ===================

    const active = event.active; // The thing being moved. Will be the same as activeItem. But has transform details.
    const over = event.over;
    const overSessionId = over.data.current.sessionId;
    const overSectionId = over.data.current.sectionId;

    const copyActiveItem = {
      ...rehabState.activeItem,
    };

    let itemUpdateDetails;
    if (copyActiveItem.reason) {
      const reasonUpdateDetails: ExerciseReasonUpdateDetails = {
        athlete_id: props.athleteId,
        exercise_template_id: copyActiveItem.exercise_template_id || null,
        exercise_instance_id: copyActiveItem.id,
        session_id: overSessionId,
        section_id: overSectionId,
        order_index: rehabState.lastOrderIndex || 1,
        reason: copyActiveItem.reason,
        previous_section_id: rehabState.originalSectionId,
        previous_session_id: rehabState.originalSessionId,
        session_date: '', // TODO: WHAT IS THIS?
        maintenance: rehabState.activeItem?.maintenance || false,
      };
      itemUpdateDetails = reasonUpdateDetails;
    } else {
      const exerciseUpdateDetails: ExerciseUpdateDetails = {
        exercise_template_id: copyActiveItem.exercise_template_id || null,
        exercise_instance_id:
          copyActiveItem.type === 'exerciseTemplate'
            ? undefined
            : copyActiveItem.id || null,
        athlete_id: props.athleteId,
        session_id: overSessionId,
        section_id: overSectionId,
        order_index: rehabState.lastOrderIndex || 1,
        previous_section_id: rehabState.originalSectionId,
        previous_session_id: rehabState.originalSessionId,
        variations: copyActiveItem.variations || null,
        maintenance: rehabState.activeItem?.maintenance || false,
        session_date: '', // TODO: WHAT IS THIS?
        comment: copyActiveItem.comment || undefined,
      };
      itemUpdateDetails = exerciseUpdateDetails;
    }

    const movingToAnotherSection =
      overSectionId !== active.data.current.sectionId;

    if (
      active.data.current.type === 'exerciseTemplate' ||
      rehabMode === 'COPY_TO_MODE'
    ) {
      const sessionIndex = rehabState.sessions.findIndex((session) =>
        session.sections.includes(overSectionId)
      );
      if (sessionIndex !== -1) {
        if (rehabMode === 'COPY_TO_MODE') {
          copyExerciseToSession(overSessionId);
          return;
        }
        saveExerciseToSession(
          itemUpdateDetails.order_index || 1,
          rehabState.sessions[sessionIndex],
          true,
          itemUpdateDetails.section_id
        );
      }
    }

    if (movingToAnotherSection) {
      dispatch({
        type: 'SET_ACTIVE_ITEM',
        activeItem: null,
      });
      return;
    }

    // ==================   NOT MOVING TO ANOTHER SECTION  ===================

    let updatedPositionIndex;
    if (over.data.current?.sortable) {
      updatedPositionIndex = over.data.current.sortable.index;
    }

    const currentIndex = active.data.current?.sortable?.index;

    if (currentIndex !== updatedPositionIndex) {
      dispatch({
        type: 'MOVE_ACTIVE_ITEM_IN_SECTION',
        sectionId: overSectionId,
        currentIndex,
        updatedPositionIndex,
      });
    }
    // updating the order index to the position the user has dragged to within the container
    itemUpdateDetails.order_index = parseInt(updatedPositionIndex, 10) + 1;
    const sessionIndex = rehabState.sessions.findIndex((session) =>
      session.sections.includes(overSectionId)
    );

    let emptySectionAfterAction = false;
    if (itemUpdateDetails.previous_section_id != null) {
      emptySectionAfterAction =
        rehabState.sections[itemUpdateDetails.previous_section_id]
          .exercise_instances.length === 0;
    }

    const currentSessionId = itemUpdateDetails.session_id;
    // If session is a placeholder we need to create the session with the exercise
    if (rehabState.sessions[sessionIndex].isPlaceholderSession) {
      itemUpdateDetails.session_date =
        rehabState.sessions[sessionIndex].start_time;
      delete itemUpdateDetails.section_id;
      delete itemUpdateDetails.session_id;

      rehabNetworkCall.updateExerciseValue({
        maintenance: props.inMaintenance,
        newExerciseDetails: itemUpdateDetails,
        refetchSessionsAfterAction: emptySectionAfterAction, // If true need to refetch sessions
        placeholderSessionId: currentSessionId,
        issueId: props.issueOccurrenceId,
        issueType: props.issueType,
      });
    } else {
      rehabNetworkCall.updateExerciseValue({
        maintenance: props.inMaintenance,
        newExerciseDetails: itemUpdateDetails,
        refetchSessionsAfterAction: emptySectionAfterAction, // If true need to refetch sessions
        issueId: props.issueOccurrenceId,
        issueType: props.issueType,
      });
    }

    dispatch({
      type: 'SET_ACTIVE_ITEM',
      activeItem: null,
    });
  };

  const UpdateRehabDayMode = (rehabModeId: RehabDayMode) => {
    if (getIsLocalStorageAvailable()) {
      window.localStorage.setItem('REHAB_DAY_MODE', rehabModeId);
    }
    setRehabDayMode(rehabModeId);
  };

  const toggleViewNotes = () => {
    setViewNotes((current) => {
      if (getIsLocalStorageAvailable()) {
        window.localStorage.setItem('REHAB_VIEW_NOTES', !current);
      }
      return !current;
    });
  };

  useEffect(() => {
    if (getIsLocalStorageAvailable()) {
      setRehabDayMode(
        window.localStorage.getItem('REHAB_DAY_MODE') || defaultRehabDayMode
      );
      const storedStrValue = window.localStorage.getItem('REHAB_VIEW_NOTES');
      if (storedStrValue != null) {
        setViewNotes(JSON.parse(storedStrValue));
      } else {
        setViewNotes(false);
      }
    } else {
      setRehabDayMode(defaultRehabDayMode);
      setViewNotes(false);
    }
  }, []);

  const onCancelDeleteModal = () => {
    dispatch?.({
      type: 'REHAB_DELETE_MODAL',
      deleteRehabItem: null,
      deleteRehabContent: '',
    });
  };

  const addToastMessage = (
    athleteName: string,
    injuryName: string,
    sessionExercise: SessionExerciseCopyData,
    linkType: LinkType
  ) => {
    const { linkTitle, linkText, linkValue } = getLinkDetails(
      athleteName,
      injuryName,
      sessionExercise,
      linkType,
      props.athleteId
    );

    toastDispatch({
      type: 'UPDATE_TOAST',
      toast: {
        id: 1,
        title: linkTitle,
        links: [
          {
            id: 1,
            text: linkText,
            link: linkValue,
            withHashParam: true,
          },
        ],
        status: 'SUCCESS',
      },
    });
  };

  const getLinkValueForRedirect = (
    athleteName: string,
    injuryName: string,
    sessionExercise: SessionExerciseCopyData,
    linkType: LinkType
  ) => {
    const { linkValue } = getLinkDetails(
      athleteName,
      injuryName,
      sessionExercise,
      linkType,
      props.athleteId
    );
    return linkValue;
  };

  const onCloseExerciseListCallback = useCallback(() => {
    if (rehabState.recentlyAddedExerciseIds.length > 0) {
      const firstRecentlyAddedId = rehabState.recentlyAddedExerciseIds[0];
      document
        .querySelector(`[data-rehab_item_id="${firstRecentlyAddedId}"]`)
        ?.focus();
    }
    changeRehabMode('DEFAULT');
  }, [dispatch, rehabState.recentlyAddedExerciseIds]);

  const renderSidePanels = () => {
    if (rehabState.actionStatus !== 'FAILURE' && permissions.rehab.canManage) {
      return (
        <>
          {(rehabMode === 'DEFAULT' ||
            rehabMode === 'ADDING_TO_FIRST_SESSION') && (
            <ExerciseListPanel
              organisationId={organisation.id}
              isOpen={exerciseListIsOpen}
              onClose={onCloseExerciseListCallback}
              disabled={
                rehabState.activeItem != null ||
                !permissions.rehab.canManage ||
                rehabState.actionStatus === 'PENDING'
              }
              onClickedExerciseTemplate={addClickedExerciseTemplateToSession}
            />
          )}
          {rehabMode === 'COPY_TO_MODE' && !exerciseListIsOpen && (
            <CopyExercisesPanel
              isOpen={rehabState.copyExerciseIds?.length > 0}
              inMaintenance={props.inMaintenance}
              selectedExercises={rehabState.copyExerciseIds || []}
              isAthleteSelectable
              athleteId={props.athleteId}
              issueType={props.issueType}
              issueOccurrenceId={props.issueOccurrenceId}
              addToastMessage={addToastMessage}
              getLinkValueForRedirect={getLinkValueForRedirect}
              isRehabCopyAutomaticallyRedirectEnabled={
                isRehabCopyAutomaticallyRedirectEnabled.value
              }
              onClose={() => {
                changeRehabMode('DEFAULT');
              }}
              onCopyComplete={() => {
                refetchSessions();
              }}
            />
          )}

          {rehabMode === 'GROUP_MODE' && !exerciseListIsOpen && (
            <RehabGroupsSidePanel
              isOpen={rehabState.groupExerciseIds?.length > 0}
              selectedExercises={rehabState.groupExerciseIds || []}
              onClose={() => {
                changeRehabMode('DEFAULT');
              }}
            />
          )}

          {rehabMode === 'LINK_TO_MODE' && !exerciseListIsOpen && (
            <LinkExercisesPanel
              isOpen={rehabState.linkExerciseIds?.length > 0}
              selectedExercises={rehabState.linkExerciseIds || []}
              athleteId={props.athleteId}
              issueType={props.issueType}
              issueOccurrenceId={props.issueOccurrenceId}
              addToastMessage={addToastMessage}
              onClose={() => {
                changeRehabMode('DEFAULT');
              }}
              onLinkComplete={() => {
                refetchSessions();
              }}
            />
          )}
        </>
      );
    }

    return undefined;
  };

  let deleteTitle = '';
  if (typeof rehabState.deleteRehabItem === 'number') {
    deleteTitle = props.t('Delete Session');
  } else {
    // eslint-disable-next-line no-unused-expressions
    rehabState.deleteRehabItem?.reason
      ? (deleteTitle = props.t('Delete Reason'))
      : (deleteTitle = props.t('Delete Exercise'));
  }

  const onlyRehabAnnotationsFilter = ({ type }) =>
    type === 'OrganisationAnnotationTypes::RehabSession';

  const renderRehabNoteSidepanel = () => {
    return window.featureFlags['rehab-note'] ? (
      <AddMedicalNoteSidePanel
        athleteId={props.athleteId}
        customAnnotationTypesFilter={onlyRehabAnnotationsFilter}
        defaultAnnotationType="OrganisationAnnotationTypes::RehabSession"
        annotationDate={rehabNoteDate}
        disableMaxAnnotationDate
        onSaveNote={() => {
          setRehabNoteDate(null);
          refetchSessions();
        }}
        oncloseAddMedicalNotePanel={() => {
          setRehabNoteDate(null);
        }}
      />
    ) : undefined;
  };

  if (rehabDayMode == null) {
    return <DelayedLoadingFeedback />;
  }

  if (fetchSessionsRequestStatus === 'FAILURE') {
    return <AppStatus status="error" isEmbed />;
  }

  return (
    <>
      {['1_DAY', '3_DAY', '5_DAY', '7_DAY'].includes(rehabDayMode) &&
        window.featureFlags['rehab-print-single'] &&
        rehabState.sessions.length > 0 && (
          <PrintView
            athleteName={props.athleteName}
            rawSessions={getRawSessions()}
            zeroIndexedDate={
              !window.featureFlags['rehab-post-injury-day-index']
            }
          />
        )}

      {rehabState.sessions != null && (
        <>
          <RehabFilters
            kitmanDesignSystem
            athleteId={props.athleteId}
            hiddenFilters={props.hiddenFilters}
            rehabDate={activeDate}
            dayMode={rehabDayMode}
            rehabMode={rehabMode}
            sidePanelIsOpen={
              rehabState.copyExerciseIds.length > 0 ||
              rehabState.linkExerciseIds.length > 0 ||
              rehabState.groupExerciseIds.length > 0
            }
            inMaintenance={props.inMaintenance}
            displayEditAll={displayEditAll}
            onSelectMode={UpdateRehabDayMode}
            numberOfSelections={(() => {
              let numSelections = -1;
              if (rehabMode === 'COPY_TO_MODE') {
                numSelections = rehabState.copyExerciseIds.length;
              }
              if (rehabMode === 'GROUP_MODE') {
                numSelections = rehabState.groupExerciseIds.length;
              } else {
                numSelections = rehabState.linkExerciseIds.length;
              }
              return numSelections;
            })()}
            numberOfEditedExercises={rehabState.editingExerciseIds.length}
            canViewNotes={permissions.medical.notes.canView}
            viewNotesToggledOn={viewNotes}
            onToggleViewNotes={toggleViewNotes}
            onClickCloseAll={() => {
              dispatch({
                type: 'CLEAR_EDITING_EXERCISE_IDS',
              });
            }}
            onClickCopyMode={() => {
              changeRehabMode('COPY_TO_MODE');
            }}
            onClickLinkToMode={() => changeRehabMode('LINK_TO_MODE')}
            onClickGroupMode={() => changeRehabMode('GROUP_MODE')}
            onClickSidePanelDone={() => changeRehabMode('DEFAULT')}
            onClickEditAllRehab={() => {
              dispatch({
                type: 'EDIT_ALL_EXERCISES',
              });
            }}
            onClickAddRehab={() => {
              changeRehabMode('ADDING_TO_FIRST_SESSION');
              dispatch({
                type: 'SET_CLICK_MODE_TARGET',
                target: {
                  targetSessionId: rehabState.sessions[0].id,
                  targetSectionId: rehabState.sessions[0].sections[0],
                },
              });
              setExerciseListIsOpen(true);
            }}
            onSelectRehabDate={(date) => {
              if (date) {
                setActiveDate(moment(date));
              }
            }}
            onClickToday={() => {
              setActiveDate(moment().startOf('day'));
            }}
            onChangeDateRight={() => {
              moveActiveDate(1);
            }}
            onChangeDateLeft={() => {
              moveActiveDate(-1);
            }}
          />
          <DndContext
            sensors={sensors}
            collisionDetection={collisionAlgorithm}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div css={style.wrapperStyle}>
              <RehabDispatchContext.Provider
                value={{
                  dispatch,
                  copyExerciseIds: rehabState.copyExerciseIds,
                  groupExerciseIds: rehabState.groupExerciseIds,
                  editExerciseIds: rehabState.editingExerciseIds,
                  linkExerciseIds: rehabState.linkExerciseIds,
                }}
              >
                <div css={style.dayColumns}>
                  {rehabState.sessions.map((rehabSession) => {
                    const fullObjectSections = rehabSession.sections.map(
                      (id) => rehabState.sections[id]
                    );
                    return (
                      <div
                        css={style.rehabContainer}
                        key={`rehabContainer_${rehabSession.id}`}
                        data-rehab_container_type="session_container"
                      >
                        <RehabContainer
                          hiddenFilters={props.hiddenFilters}
                          id={rehabSession.id}
                          sections={fullObjectSections}
                          startTime={rehabSession.start_time}
                          issueOccurrenceDate={props.issueOccurrenceDate}
                          issueType={props.issueType}
                          issueOccurrenceId={props.issueOccurrenceId}
                          // TODO: refactor to just accept rehabMode
                          rehabCopyMode={rehabMode === 'COPY_TO_MODE'}
                          rehabGroupMode={rehabMode === 'GROUP_MODE'}
                          linkToMode={rehabMode === 'LINK_TO_MODE'}
                          rehabDayMode={rehabDayMode}
                          inMaintenance={props.inMaintenance}
                          athleteId={props.athleteId}
                          highlightSession={
                            rehabSession.id ===
                              rehabState.highlightedSessionId ||
                            rehabSession.id ===
                              rehabState.clickModeTarget?.targetSessionId
                          }
                          annotations={rehabSession.annotations || []}
                          viewNotesToggledOn={viewNotes}
                          notesPermissions={permissions.medical.notes}
                          hasManagePermission={permissions.rehab.canManage}
                          callDeleteExercise={(exercise: Exercise) => {
                            const exerciseName =
                              exercise.exercise_name || exercise.reason || '';
                            const deleteMessage = exercise.reason
                              ? props.t(
                                  'Are you sure you want to delete the reason'
                                )
                              : props.t(
                                  'Are you sure you want to delete the exercise'
                                );
                            // eslint-disable-next-line no-unused-expressions
                            window.featureFlags[
                              'rehab-delete-exercise-confirmation'
                            ]
                              ? dispatch?.({
                                  type: 'REHAB_DELETE_MODAL',
                                  deleteRehabItem: exercise,
                                  deleteRehabContent: `${deleteMessage} ${exerciseName}?`,
                                })
                              : performDelete(exercise);
                          }}
                          callDeleteWholeSession={(
                            sessionNumber: number,
                            dayOfInjury: string
                          ) => {
                            // eslint-disable-next-line no-unused-expressions
                            window.featureFlags['rehab-delete-entire-session']
                              ? dispatch?.({
                                  type: 'REHAB_DELETE_MODAL',
                                  deleteRehabItem: sessionNumber,
                                  deleteRehabContent: `${props.t(
                                    'Delete the exercises for  '
                                  )} ${dayOfInjury}?`,
                                })
                              : performDelete(sessionNumber);
                          }}
                          onAddNoteClicked={() => {
                            changeRehabMode('DEFAULT');
                            setRehabNoteDate(
                              moment(rehabSession.start_time).format(
                                DateFormatter.dateTransferFormat
                              )
                            );
                          }}
                          onAddRehabToSectionClicked={(
                            target: ClickModeTargetDetails
                          ) => {
                            if (
                              rehabMode === 'DEFAULT' ||
                              rehabMode === 'ADDING_TO_FIRST_SESSION'
                            ) {
                              changeRehabMode('DEFAULT', true);
                              dispatch({
                                type: 'SET_CLICK_MODE_TARGET',
                                target,
                              });
                            }
                          }}
                          activeItem={rehabState.activeItem?.id}
                          isPlaceholderSession={
                            rehabSession.isPlaceholderSession
                          }
                          isEmptySession={fullObjectSections.every(
                            (section) => section.exercise_instances.length === 0
                          )}
                          onNoteUpdated={() => refetchSessions()}
                          readOnly={
                            rehabSession.constraints?.read_only || false
                          }
                          disabled={
                            rehabSession.constraints?.read_only ||
                            !permissions.rehab.canManage ||
                            rehabState.actionStatus === 'PENDING'
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </RehabDispatchContext.Provider>
            </div>
            {renderSidePanels()}
            <DragOverlay
              zIndex={zIndices.draggableItemZ}
              dropAnimation={
                rehabState.activeItem?.type === 'exerciseTemplate'
                  ? null
                  : dropAnimation
              }
            >
              {rehabState.activeItem && (
                <DragDummy
                  title={
                    rehabState.activeItem.reason
                      ? rehabState.activeItem.reason
                      : rehabState.activeItem.exercise_name
                  }
                  amountBeingDragged={
                    rehabMode === 'COPY_TO_MODE'
                      ? rehabState.copyExerciseIds.length
                      : null
                  }
                />
              )}
            </DragOverlay>
          </DndContext>
        </>
      )}

      {fetchSessionsRequestStatus === 'PENDING' && (
        <div css={style.loading} data-testid="Rehab|SessionsLoading">
          <DelayedLoadingFeedback />
        </div>
      )}

      <RehabDeleteModal
        isOpen={rehabState.deleteRehabItem !== null}
        deleteTitle={deleteTitle}
        deleteContent={
          rehabState.deleteRehabContent ? rehabState.deleteRehabContent : ''
        }
        onCancelDelete={() => {
          onCancelDeleteModal();
        }}
        onConfirmDelete={() => {
          performDelete(rehabState.deleteRehabItem);
          dispatch?.({
            type: 'REHAB_DELETE_MODAL',
            deleteRehabItem: null,
            deleteRehabContent: '',
          });
        }}
      />

      <ToastDialog toasts={toasts} onCloseToast={closeToast} />
      {renderRehabNoteSidepanel()}
      {rehabState.actionStatus === 'FAILURE' && (
        <AppStatus status="error" message={rehabState.displayMessage} />
      )}
    </>
  );
};

export const RehabTabTranslated: ComponentType<Props> =
  withNamespaces()(RehabTab);
export default RehabTab;
