// @flow
import { useReducer } from 'react';
import type { Annotation } from '@kitman/common/src/types/Annotation';
import type { RequestStatus } from '@kitman/common/src/types';
import type { ExerciseCreationStructure } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';
import type { Dispatch } from '../../../types';
import type {
  RehabSession,
  RehabSection,
  ActiveDraggingExercise,
  Exercise,
  ExerciseVariation,
  exerciseVariationTemp,
  ClickModeTargetDetails,
} from '../types';

// Same as RehabSession but sections are just ids here
export type RehabStateSession = {
  id: number,
  start_time: string,
  end_time: string,
  timezone?: string,
  title?: string,
  sections: Array<number>,
  isPlaceholderSession?: boolean, // If false this session is present on the backend
  annotations: Array<Annotation>,
  constraints?: {
    read_only: boolean,
  },
};

type RehabState = {
  sessions: RehabStateSession[],
  sections: { [sectionId: number]: RehabSection }, // Dictionary of sectionId to the section object
  copyExerciseIds: number[],
  linkExerciseIds: number[],
  groupExerciseIds: number[],
  editingExerciseIds: Array<number | string>,
  recentlyAddedExerciseIds: Array<number>,
  activeItem: ?ActiveDraggingExercise,
  originalSessionId: ?number,
  originalSectionId: ?number,
  lastMovedToNewSectionItemId: ?(number | string), // Id of the exercise / template that last got moved to a new section
  lastSectionAddedToId: ?number, // The id of that section lastMovedToNewSectionItemId when to
  lastOrderIndex: ?number,
  actionStatus: ?RequestStatus,
  actionType: ?string,
  displayMessage: ?string, // Error or Info message text
  deleteRehabItem: ?Exercise | ?number,
  deleteRehabContent: ?string, // Translated message used in the delete confirmation dialogue
  highlightedSessionId: ?number,
  clickModeTarget: ?ClickModeTargetDetails, // Clicking to add an exercise which session column & section should it go to
};

export type RehabAction =
  | { type: 'SET_REHAB_SESSIONS', rehabSessions: RehabSession[] }
  | {
      type: 'REPLACE_SESSION',
      previousIdForSession: ?number,
      session: RehabSession,
      makeExerciseInstancesEditable: boolean,
      initialExerciseInstances: ?Array<ExerciseCreationStructure>,
      sectionId: ?number, // Section id in session we added to
    }
  | {
      type: 'ASSIGN_EXERCISE_AS_ACTIVE_ITEM',
      sectionId: number,
      index: number,
      rehabCopyMode: boolean,
    }

  // When a we pickup an exercise template from the side panel we can assign here, or set to null
  | { type: 'SET_ACTIVE_ITEM', activeItem: ?ActiveDraggingExercise }
  | {
      type: 'REHAB_DELETE_MODAL',
      deleteRehabItem: ?Exercise | number,
      deleteRehabContent: string,
    }
  | {
      type: 'ADD_EXERCISE_TO_COPY_ARRAY',
      exerciseId: number,
      exerciseSelected: boolean,
    }
  | {
      type: 'ADD_EXERCISE_TO_GROUP_ARRAY',
      exerciseId: number,
      exerciseSelected: boolean,
    }
  | {
      type: 'ADD_EXERCISE_TO_LINK_ARRAY',
      exerciseId: number,
      exerciseSelected: boolean,
    }
  | {
      type: 'ADD_EXERCISE_TO_EDIT_ARRAY',
      exerciseId: number,
    }
  | {
      type: 'REMOVE_EXERCISE_FROM_EDIT_ARRAY',
      exerciseSelected?: boolean,
      exerciseId: number,
    }
  | {
      type: 'EDIT_ALL_EXERCISES',
    }
  | {
      type: 'CLEAR_COPY_SELECTIONS',
    }
  | {
      type: 'CLEAR_GROUP_SELECTIONS',
    }
  | {
      type: 'CLEAR_LINK_SELECTIONS',
    }
  | {
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    }
  | {
      type: 'CLEAR_RECENTLY_ADDED_EXERCISE_IDS',
    }
  | {
      type: 'ADD_EXERCISE_SESSION_TO_COPY_ARRAY',
      sessionId: string | number,
      exercisesSelected: boolean,
    }
  | {
      type: 'ADD_EXERCISE_SESSION_TO_LIST_ARRAY',
      sessionId: string | number,
      exercisesSelected: boolean,
    }
  | {
      type: 'HIGHLIGHT_SESSION',
      sessionId: ?number,
    }
  | {
      type: 'MOVE_ACTIVE_ITEM_IN_SECTION',
      sectionId: number,
      currentIndex: number,
      updatedPositionIndex: ?number, // Null will add to end of list
    }
  | {
      type: 'MOVE_ACTIVE_ITEM_TO_NEW_SECTION',
      rehabCopyMode: boolean,
      sectionId: number,
      sessionId: number,
      positionIndex: ?number, // Null will add to end of list
    }
  | {
      type: 'DELETE_EXERCISE',
      exerciseId: string | number,
      sectionId: number,
    }
  | {
      type: 'ADD_ANOTHER_VARIATION',
      exerciseId: string | number,
      sectionId: number,
      variation: ExerciseVariation,
    }
  | {
      type: 'REMOVE_EXERCISE_VARIATION',
      exerciseId: string | number,
      sectionId: number,
      variations: Array<ExerciseVariation>,
    }
  | {
      type: 'UPDATE_EXERCISE_VARIATION_TYPE',
      exerciseId: string | number,
      sectionId: number,
      variationIndex: number,
      variations: Array<ExerciseVariation>,
    }
  | {
      type: 'UPDATE_EXERCISE_PROPERTY',
      exerciseId: number | string,
      sectionId: number,
      propertyKey: 'comment' | 'reason',
      value: ?(number | string),
    }
  | {
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: RequestStatus,
      actionType:
        | 'UPDATE_EXERCISE'
        | 'DELETE_EXERCISE'
        | 'DELETE_SESSION'
        | 'CREATE_SESSION'
        | 'COPY_EXERCISE'
        | 'GET_DEFAULT_VARIATION',
      message?: ?string,
    }
  | {
      type: 'UPDATE_EXERCISE_VARIATION_PROPERTY',
      exerciseId: number | string,
      sectionId: number,
      variationIndex: number,
      parameterIndex: number,
      exerciseParameters: Array<exerciseVariationTemp>,
    }
  | {
      type: 'SET_CLICK_MODE_TARGET',
      target: ?ClickModeTargetDetails,
    };

export type RehabDispatch = Dispatch<RehabAction>;

const getInitialState = () => {
  return {
    sessions: [],
    sections: {},
    copyExerciseIds: [],
    groupExerciseIds: [],
    linkExerciseIds: [],
    editingExerciseIds: [],
    recentlyAddedExerciseIds: [],
    activeItem: null,
    originalSectionId: null,
    originalSessionId: null,
    lastMovedToNewSectionItemId: null,
    lastSectionAddedToId: null,
    lastOrderIndex: null,
    actionStatus: null,
    actionType: null,
    displayMessage: null,
    deleteRehabItem: null,
    deleteRehabContent: null,
    highlightedSessionId: null,
    clickModeTarget: null,
  };
};

const reIndexExercises = (exerciseInstances: Array<Exercise>) => {
  exerciseInstances.forEach((exercise, index) => {
    // eslint-disable-next-line no-param-reassign
    exercise.order_index = index + 1;
  });

  return exerciseInstances;
};

const moveWithinSectionExercises = (
  exerciseInstances: Array<Exercise>,
  currentIndex: number,
  updatedIndex: ?number
) => {
  const exercises = exerciseInstances.slice(); // Copy
  exercises.splice(
    updatedIndex == null
      ? exercises.length - 1
      : Math.min(exercises.length - 1, updatedIndex),
    0,
    exercises.splice(currentIndex, 1)[0]
  );

  return reIndexExercises(exercises);
};

const rehabReducer = (state: RehabState, action: RehabAction) => {
  switch (action.type) {
    case 'SET_REHAB_SESSIONS': {
      if (!action.rehabSessions) {
        return state;
      }
      const sectionsDict = {};
      const sessions = action.rehabSessions.map((session) => {
        const { sections, ...rest } = session; // rest now excludes section objects
        const sectionIds = [];
        if (sections) {
          sections.forEach((section) => {
            sectionsDict[section.id] = section;
            sectionIds.push(section.id);
          });
        }
        const mutatedSession = {
          ...rest,
          sections: sectionIds,
        };
        // NOTE: we may want to keep the original sections for undo feature but will tackle when required.
        return mutatedSession;
      });

      return {
        ...state,
        sessions,
        sections: sectionsDict,
      };
    }

    case 'REHAB_DELETE_MODAL': {
      return {
        ...state,
        deleteRehabItem: action.deleteRehabItem,
        deleteRehabContent: action.deleteRehabContent,
      };
    }

    case 'REPLACE_SESSION': {
      // When we click to add a template that replaces a placeholder session with a backend create one then
      // we should update the click mode target and highlighted session id with the new details

      const updatedClickModeTarget = state.clickModeTarget
        ? { ...state.clickModeTarget }
        : null;
      if (
        updatedClickModeTarget &&
        state.clickModeTarget?.targetSectionId === action.previousIdForSession
      ) {
        updatedClickModeTarget.targetSessionId = action.session.id;
        updatedClickModeTarget.targetSectionId = action.session.sections[0].id;
      }

      let updatedHighlightedSessionId = state.highlightedSessionId;
      if (state.highlightedSessionId === action.previousIdForSession) {
        updatedHighlightedSessionId = action.session.id;
      }

      // ===============================================================

      const sessionIndex = state.sessions.findIndex(
        (session) => session.id === action.previousIdForSession
      );

      if (sessionIndex === -1) {
        return state;
      }

      const updatedSessions = state.sessions.slice(); // Shallow copy

      const { sections, ...rest } = action.session; // rest now excludes section objects
      const sectionIds = [];
      const onlyNewSectionsDict = {};

      const editingExerciseIds = state.editingExerciseIds.slice(); // Copy
      const recentlyAddedExerciseIds = state.recentlyAddedExerciseIds.slice(); // Copy

      // We only have single sections per session right now.
      sections.forEach((section) => {
        if (
          action.makeExerciseInstancesEditable &&
          (section.id === action.sectionId || sections.length === 1) &&
          action.initialExerciseInstances
        ) {
          // Get ids of the newly added exercises and add to editingExerciseIds
          action.initialExerciseInstances.forEach((initialExercise) => {
            const positionIndex =
              initialExercise.order_index > 0
                ? initialExercise.order_index - 1
                : 0;
            if (section.exercise_instances.length > positionIndex) {
              const foundExercise = section.exercise_instances[positionIndex];
              // Do extra safety check on template id to try ensure this is the exercise we created

              if (
                typeof foundExercise.id === 'number' &&
                foundExercise.exercise_template_id ===
                  initialExercise.exercise_template_id
              ) {
                editingExerciseIds.push(foundExercise.id);
                if (typeof foundExercise.id === 'number') {
                  recentlyAddedExerciseIds.push(foundExercise.id);
                }
              }
            }
          });
        }

        onlyNewSectionsDict[section.id] = section;
        sectionIds.push(section.id);
      });
      const mutatedSession: RehabStateSession = {
        ...rest,
        annotations: updatedSessions[sessionIndex].annotations, // Replacement session won't have annotations, so keep old ones
        sections: sectionIds,
      };

      updatedSessions[sessionIndex] = mutatedSession;
      return {
        ...state,
        sessions: updatedSessions,
        sections: { ...state.sections, ...onlyNewSectionsDict },
        editingExerciseIds,
        recentlyAddedExerciseIds,
        clickModeTarget: updatedClickModeTarget,
        highlightedSessionId: updatedHighlightedSessionId,
      };
    }

    case 'UPDATE_ACTION_STATUS': {
      return {
        ...state,
        actionStatus: action.actionStatus,
        actionType: action.actionType,
        displayMessage: action.message || null,
      };
    }

    case 'UPDATE_EXERCISE_PROPERTY': {
      const originalSection = state.sections[action.sectionId];
      if (originalSection) {
        const originalExercises = originalSection.exercise_instances;

        const indexOfExercise = originalExercises.findIndex(
          (exercise) => exercise.id === action.exerciseId
        );

        // If found
        if (indexOfExercise !== -1) {
          const updatedExercises = originalSection.exercise_instances.slice(); // copy
          updatedExercises[indexOfExercise] = {
            ...originalExercises[indexOfExercise],
            // $FlowIgnore[invalid-computed-prop] Assign what is passed
            [action.propertyKey]: action.value,
          };
          return {
            ...state,
            sections: {
              ...state.sections,
              [originalSection.id]: {
                ...originalSection,
                exercise_instances: updatedExercises,
              },
            },
          };
        }
      }
      return state;
    }

    case 'CLEAR_COPY_SELECTIONS': {
      return { ...state, copyExerciseIds: [] };
    }

    case 'CLEAR_GROUP_SELECTIONS': {
      return { ...state, groupExerciseIds: [] };
    }

    case 'CLEAR_LINK_SELECTIONS': {
      return { ...state, linkExerciseIds: [] };
    }

    case 'CLEAR_EDITING_EXERCISE_IDS': {
      return { ...state, editingExerciseIds: [] };
    }

    case 'CLEAR_RECENTLY_ADDED_EXERCISE_IDS': {
      return { ...state, recentlyAddedExerciseIds: [] };
    }

    case 'ADD_EXERCISE_TO_COPY_ARRAY': {
      // Check id type to be sure We don't process templates that are not yet saved as exercises
      if (typeof action.exerciseId === 'string') {
        return state;
      }
      const selected = action.exerciseSelected;
      const updatedSelectedIds = selected
        ? [...state.copyExerciseIds, parseInt(action.exerciseId, 10)]
        : state.copyExerciseIds.filter(
            (exerciseId) => exerciseId !== action.exerciseId
          );
      return { ...state, copyExerciseIds: updatedSelectedIds };
    }

    case 'ADD_EXERCISE_TO_GROUP_ARRAY': {
      // Check id type to be sure We don't process templates that are not yet saved as exercises
      if (typeof action.exerciseId === 'string') {
        return state;
      }
      const selected = action.exerciseSelected;
      const updatedSelectedIds = selected
        ? [...state.groupExerciseIds, parseInt(action.exerciseId, 10)]
        : state.groupExerciseIds.filter(
            (exerciseId) => exerciseId !== action.exerciseId
          );
      return { ...state, groupExerciseIds: updatedSelectedIds };
    }

    case 'ADD_EXERCISE_TO_LINK_ARRAY': {
      // Check id type to be sure We don't process templates that are not yet saved as exercises
      if (typeof action.exerciseId === 'string') {
        return state;
      }
      const selected = action.exerciseSelected;
      const updatedSelectedIds = selected
        ? [...state.linkExerciseIds, parseInt(action.exerciseId, 10)]
        : state.linkExerciseIds.filter(
            (exerciseId) => exerciseId !== action.exerciseId
          );
      return { ...state, linkExerciseIds: updatedSelectedIds };
    }

    case 'ADD_EXERCISE_TO_EDIT_ARRAY': {
      const editExercises = state.editingExerciseIds.slice();
      editExercises.push(action.exerciseId);
      return { ...state, editingExerciseIds: editExercises };
    }

    case 'REMOVE_EXERCISE_FROM_EDIT_ARRAY': {
      const editExercises = state.editingExerciseIds.filter(
        (id) => id !== action.exerciseId
      );
      return { ...state, editingExerciseIds: editExercises };
    }

    case 'EDIT_ALL_EXERCISES': {
      const allExercisesId = [];
      Object.keys(state.sections).forEach((key) => {
        const section = state.sections[parseInt(key, 10)];

        section.exercise_instances.forEach((exercise) => {
          allExercisesId.push(exercise.id);
        });
      });

      const editExercisesId = state.editingExerciseIds.slice(); // copy
      const uniqueListOfEditIds = [
        ...new Set([].concat(...editExercisesId.concat(allExercisesId))),
      ];
      return {
        ...state,
        editingExerciseIds: uniqueListOfEditIds,
      };
    }

    case 'ADD_EXERCISE_SESSION_TO_COPY_ARRAY': {
      const selected = action.exercisesSelected;
      const sessionIndex = state.sessions.findIndex(
        (session) => session.id === action.sessionId
      );
      if (sessionIndex !== -1) {
        const sections = state.sessions[sessionIndex].sections; // Array of ids
        let newExerciseIds = state.copyExerciseIds.slice(); // copy
        if (selected) {
          sections.forEach((sectionId) => {
            state.sections[sectionId].exercise_instances.forEach((exercise) => {
              // Check id type to be sure We don't process templates that are not yet saved as exercises
              if (
                typeof exercise.id !== 'string' &&
                !newExerciseIds.includes(exercise.id)
              ) {
                newExerciseIds.push(parseInt(exercise.id, 10));
              }
            });
          });
        } else {
          sections.forEach((sectionId) => {
            state.sections[sectionId].exercise_instances.forEach((exercise) => {
              newExerciseIds = newExerciseIds.filter(
                (exerciseId) => exerciseId !== exercise.id
              );
            });
          });
        }
        return { ...state, copyExerciseIds: newExerciseIds };
      }
      return state;
    }

    case 'ADD_EXERCISE_SESSION_TO_LIST_ARRAY': {
      const selected = action.exercisesSelected;
      const sessionIndex = state.sessions.findIndex(
        (session) => session.id === action.sessionId
      );
      if (sessionIndex !== -1) {
        const sections = state.sessions[sessionIndex].sections; // Array of ids
        let newExerciseIds = state.linkExerciseIds.slice(); // copy
        if (selected) {
          sections.forEach((sectionId) => {
            state.sections[sectionId].exercise_instances.forEach((exercise) => {
              // Check id type to be sure We don't process templates that are not yet saved as exercises
              if (
                typeof exercise.id !== 'string' &&
                !newExerciseIds.includes(exercise.id)
              ) {
                newExerciseIds.push(parseInt(exercise.id, 10));
              }
            });
          });
        } else {
          sections.forEach((sectionId) => {
            state.sections[sectionId].exercise_instances.forEach((exercise) => {
              newExerciseIds = newExerciseIds.filter(
                (exerciseId) => exerciseId !== exercise.id
              );
            });
          });
        }
        return { ...state, linkExerciseIds: newExerciseIds };
      }
      return state;
    }

    case 'ADD_ANOTHER_VARIATION': {
      const originalSection = state.sections[action.sectionId];
      const originalExercises = originalSection.exercise_instances;

      const indexOfExercise = originalExercises.findIndex(
        (exercise) => exercise.id === action.exerciseId
      );

      // If found
      if (indexOfExercise !== -1) {
        const updatedExercises = originalSection.exercise_instances.slice(); // copy
        const updatedVariations =
          originalExercises[indexOfExercise].variations.slice(); // copy

        updatedVariations.push(action.variation);

        // Apply the variations change via a new exercise object
        updatedExercises[indexOfExercise] = {
          ...originalExercises[indexOfExercise],
          variations: updatedVariations,
        };
        return {
          ...state,
          sections: {
            ...state.sections,
            [originalSection.id]: {
              ...originalSection,
              exercise_instances: updatedExercises,
            },
          },
        };
      }

      return state;
    }

    case 'UPDATE_EXERCISE_VARIATION_PROPERTY': {
      const originalSection = state.sections[action.sectionId];
      const originalExercises = originalSection.exercise_instances;

      const indexOfExercise = originalExercises.findIndex(
        (exercise) => exercise.id === action.exerciseId
      );

      // If found
      if (indexOfExercise !== -1) {
        const updatedExercises = originalSection.exercise_instances.slice(); // copy
        const updatedVariations =
          originalExercises[indexOfExercise].variations.slice(); // copy

        // Assign new object at the array position
        updatedVariations[action.variationIndex] = {
          ...updatedVariations[action.variationIndex],
          parameters: action.exerciseParameters,
        };

        // Apply the variations change via a new exercise object
        updatedExercises[indexOfExercise] = {
          ...originalExercises[indexOfExercise],
          variations: updatedVariations,
        };

        return {
          ...state,
          sections: {
            ...state.sections,
            [originalSection.id]: {
              ...originalSection,
              exercise_instances: updatedExercises,
            },
          },
        };
      }

      return state;
    }

    case 'REMOVE_EXERCISE_VARIATION': {
      const originalSection = state.sections[action.sectionId];
      const originalExercises = originalSection.exercise_instances;

      const indexOfExercise = originalExercises.findIndex(
        (exercise) => exercise.id === action.exerciseId
      );

      if (indexOfExercise !== -1) {
        const updatedExercises = originalSection.exercise_instances.slice(); // copy
        // replaces variation with removed variation
        updatedExercises[indexOfExercise] = {
          ...originalExercises[indexOfExercise],
          variations: action.variations,
        };

        return {
          ...state,
          sections: {
            ...state.sections,
            [originalSection.id]: {
              ...originalSection,
              exercise_instances: updatedExercises,
            },
          },
        };
      }
      return state;
    }

    case 'UPDATE_EXERCISE_VARIATION_TYPE': {
      const originalSection = state.sections[action.sectionId];
      const originalExercises = originalSection.exercise_instances;

      const indexOfExercise = originalExercises.findIndex(
        (exercise) => exercise.id === action.exerciseId
      );

      // If found
      if (indexOfExercise !== -1) {
        const updatedExercises = originalSection.exercise_instances.slice(); // copy
        const updatedVariations =
          originalExercises[indexOfExercise].variations.slice(); // copy
        // Assign new object at the array position
        updatedVariations[action.variationIndex] = {
          ...action.variations[action.variationIndex],
        };
        // Apply the variations change via a new exercise object
        updatedExercises[indexOfExercise] = {
          ...originalExercises[indexOfExercise],
          variations: updatedVariations,
        };
        return {
          ...state,
          sections: {
            ...state.sections,
            [originalSection.id]: {
              ...originalSection,
              exercise_instances: updatedExercises,
            },
          },
        };
      }

      return state;
    }

    case 'DELETE_EXERCISE': {
      const originalSection = state.sections[action.sectionId];
      const updatedSection = {
        ...state.sections[action.sectionId],
        // The filter() method creates a shallow copy of a portion of a given array
        exercise_instances: reIndexExercises(
          originalSection.exercise_instances.filter(
            (exercise) => exercise.id !== action.exerciseId
          )
        ),
      };

      return {
        ...state,
        sections: { ...state.sections, [updatedSection.id]: updatedSection },
        deleteRehabItem: null,
      };
    }

    case 'ASSIGN_EXERCISE_AS_ACTIVE_ITEM': {
      const exercise = {
        ...state.sections[action.sectionId].exercise_instances[action.index],
      };

      // replace ID if duplicating item
      if (action.rehabCopyMode) {
        exercise.id = `DUPLICATE-${exercise.id}`;
        return {
          ...state,
          activeItem: exercise,
          lastMovedToNewSectionItemId: null,
          lastSectionAddedToId: null,
        };
      }

      return {
        ...state,
        activeItem: exercise,
        originalSessionId: exercise.session_id,
        originalSectionId: action.sectionId,
        lastMovedToNewSectionItemId: exercise.id,
        lastSectionAddedToId: action.sectionId,
        lastOrderIndex: exercise.order_index,
      };
    }

    case 'SET_ACTIVE_ITEM': {
      return {
        ...state,
        activeItem: action.activeItem,
        lastMovedToNewSectionItemId: null,
        lastSectionAddedToId: null,
      };
    }

    case 'MOVE_ACTIVE_ITEM_TO_NEW_SECTION': {
      if (!state.activeItem) {
        return state;
      }

      // ============== PSEUDO STEPS ==============
      // LOOKUP WHERE ARE WE GOING TO
      // WHERE WAS ACTIVE ITEM WITH SAME ID LAST ADDED (OR PICKED UP FROM) ?
      // IF (NOWHERE){
      //   INSERT WHERE REQUESTED
      // }
      // ELSE IF (WAS SAME SECTION WE ARE TARGETING ){
      //   IF (NEEDS A MOVE INSIDE SECTION) {
      //      DO THE MOVE
      //   }
      //   ELSE {
      //      THEN NO CHANGE TO STATE
      //   },
      // }
      // ELSE IF (WAS NOT SAME SECTION WE ARE TARGETING){
      //  FILTER OUT OF THERE
      //  INSERT WHERE REQUESTED
      // }
      // UPDATE LAST MOVED TO SECTION DETAILS IF NECESSARY
      // ==========================================

      // DO STEPS
      // LOOKUP WHERE ARE WE GOING TO

      const originalSection = state.sections[action.sectionId];

      // WHERE WAS ACTIVE ITEM WITH SAME ID LAST ADDED ?
      if (
        state.lastMovedToNewSectionItemId == null ||
        state.lastMovedToNewSectionItemId !== state.activeItem.id
      ) {
        // INSERT WHERE REQUESTED
        const originalExercises = originalSection.exercise_instances;

        const insertionIndex =
          action.positionIndex != null
            ? action.positionIndex
            : originalExercises.length - 1;

        // The slice() method returns a shallow copy of a portion of an array
        const updatedExercises = reIndexExercises([
          ...originalExercises.slice(0, insertionIndex),
          // Active item goes here
          // $FlowIgnore // We may have injected a template but it shares all the data with exercise
          {
            ...state.activeItem,
            session_id: action.sessionId,
            section_id: action.sectionId,
          },
          ...originalExercises.slice(insertionIndex, originalExercises.length),
        ]);

        return {
          ...state,
          sections: {
            ...state.sections,
            [originalSection.id]: {
              ...originalSection,
              exercise_instances: updatedExercises,
            },
          },
          // UPDATE LAST MOVED TO SECTION DETAILS IF NECESSARY
          lastMovedToNewSectionItemId: state.activeItem?.id,
          lastSectionAddedToId: action.sectionId,
          lastOrderIndex: insertionIndex + 1, // Service order_index begins at 1 ( not zero based index )
        };
      }

      if (state.lastSectionAddedToId === action.sectionId) {
        // WAS SAME SECTION WE ARE TARGETING
        // DOES IT NEEDS A MOVE INSIDE SECTION ?

        const exercises = originalSection.exercise_instances; // NO NEED TO Take copy yet

        if (exercises.length !== 1) {
          const insertionIndex =
            action.positionIndex != null
              ? action.positionIndex
              : exercises.length - 1;

          const existingEntryIndex = exercises.findIndex(
            (exercise) => exercise.id === state.activeItem?.id
          );

          // eslint-disable-next-line max-depth
          if (existingEntryIndex !== insertionIndex) {
            // DO MOVE
            return {
              ...state,
              sections: {
                ...state.sections,
                [originalSection.id]: {
                  ...originalSection,
                  // moveWithinSectionExercises returns a new array
                  exercise_instances: moveWithinSectionExercises(
                    exercises,
                    existingEntryIndex,
                    insertionIndex
                  ),
                },
              },
              // NOT REALLY NECESSARY TO UPDATE LAST MOVED TO SECTION DETAILS ( BUT LETS DO IT )
              lastMovedToNewSectionItemId: state.activeItem?.id,
              lastSectionAddedToId: action.sectionId,
              lastOrderIndex: insertionIndex + 1, // Service order_index begins at 1 ( not zero based index )
            };
          }
        }
        // FALL OUT TO LEAVE STATE AS IS
      } else {
        // WAS NOT SAME SECTION WE ARE TARGETING
        //  FILTER OUT OF THERE

        // Just a null check to keep flow happy
        if (state.lastSectionAddedToId == null) {
          return state;
        }

        const fromSectionUpdated = {
          ...state.sections[state.lastSectionAddedToId],
        }; // Shallow Copy

        if (
          !action.rehabCopyMode ||
          state.lastSectionAddedToId !== action.sectionId
        ) {
          // The filter() method creates a shallow copy of a portion of a given array
          fromSectionUpdated.exercise_instances = reIndexExercises(
            fromSectionUpdated.exercise_instances.filter(
              (exercise) => exercise.id !== state.activeItem?.id
            )
          );
        }
        //  INSERT WHERE REQUESTED
        const targetSectionUpdated = { ...originalSection }; // Shallow copy

        const insertionIndex =
          action.positionIndex != null
            ? action.positionIndex
            : originalSection.exercise_instances.length - 1;

        // The slice() method returns a shallow copy of a portion of an array into a new array object
        targetSectionUpdated.exercise_instances = reIndexExercises([
          ...originalSection.exercise_instances.slice(0, insertionIndex),
          // Active item goes here
          // $FlowIgnore // We may have injected a template but it shares all the data with exercise
          {
            ...state.activeItem,
            session_id: action.sessionId,
            section_id: action.sectionId,
          },
          ...originalSection.exercise_instances.slice(
            insertionIndex,
            originalSection.exercise_instances.length
          ),
        ]);

        return {
          ...state,
          sections: {
            ...state.sections,
            [fromSectionUpdated.id]: fromSectionUpdated,
            [targetSectionUpdated.id]: targetSectionUpdated,
          },
          // UPDATE LAST MOVED TO SECTION DETAILS IF NECESSARY
          lastMovedToNewSectionItemId: state.activeItem?.id,
          lastSectionAddedToId: action.sectionId,
          lastOrderIndex: insertionIndex + 1, // Service order_index begins at 1 ( not zero based index )
        };
      }

      return state;
    }
    case 'HIGHLIGHT_SESSION': {
      return {
        ...state,
        highlightedSessionId: action.sessionId,
      };
    }
    case 'MOVE_ACTIVE_ITEM_IN_SECTION': {
      if (!state.activeItem) {
        return state;
      }

      const originalSection = state.sections[action.sectionId]; // no copy

      if (action.currentIndex != null) {
        const updatedSection = { ...originalSection }; // copy
        // moveWithinSectionExercises returns a new array
        updatedSection.exercise_instances = moveWithinSectionExercises(
          originalSection.exercise_instances,
          action.currentIndex,
          action.updatedPositionIndex
        );

        return {
          ...state,
          sections: { ...state.sections, [updatedSection.id]: updatedSection },
        };
      }

      return state;
    }

    case 'SET_CLICK_MODE_TARGET': {
      return {
        ...state,
        clickModeTarget: action.target,
      };
    }

    default:
      return state;
  }
};

const useRehabReducer = () => {
  const initialState = getInitialState();
  const init = () => {
    return initialState;
  };

  const [rehabState, dispatch]: [RehabState, RehabDispatch] = useReducer(
    rehabReducer,
    initialState,
    init
  );

  return {
    rehabState,
    dispatch,
  };
};

export { useRehabReducer, getInitialState };
