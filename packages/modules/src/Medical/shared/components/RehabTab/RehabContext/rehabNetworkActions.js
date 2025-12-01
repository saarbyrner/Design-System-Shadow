// @flow
import {
  updateExercise,
  deleteExercise as deleteExerciseService,
  deleteSession,
  createRehabSession,
  copyRehabSessionExercises,
} from '@kitman/services';
import i18n from '@kitman/common/src/utils/i18n';
import type { ExerciseCreationStructure } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';
import type { SessionExerciseCopyData } from '@kitman/services/src/services/rehab/copyRehabSessionExercises';
import type { DeleteSession } from '@kitman/services/src/services/rehab/deleteSession';
import type { RehabDispatch } from '../hooks/useRehabReducer';
import type {
  ExerciseUpdateDetails,
  ExerciseReasonUpdateDetails,
} from '../types';
import type { IssueType } from '../../../types';

type ActionCallback = {
  onSuccess?: () => void,
};

const getErrorMessage = (xhr) => {
  let message;
  if (xhr.status === 403 || xhr.statusText === 'Forbidden') {
    if (xhr.responseJSON?.errors) {
      if (typeof xhr.responseJSON?.errors === 'string') {
        message = xhr.responseJSON.errors;
      } else if (
        Array.isArray(xhr.responseJSON.errors) &&
        xhr.responseJSON.errors.length > 0
      )
        message = xhr.responseJSON.errors[0];
    }
    message =
      message ||
      xhr.responseJSON?.message ||
      i18n.t('Organisation does not have access to this record');
  }
  return message;
};

const rehabNetworkActions = (
  dispatch: RehabDispatch,
  refetchSessions: Function
) => {
  // Will create a real session if placeholderSessionId supplied
  const addToSession = async ({
    data,
    callback,
  }: {
    data: {
      athleteId: number,
      issueId: ?number,
      issueType: ?IssueType,
      exerciseInstances: Array<ExerciseCreationStructure>,
      makeExerciseInstancesEditable: boolean,
      placeholderSessionId: ?number,
      sessionId: ?number,
      sessionDate: ?string,
      sectionId: ?number,
      maintenance: boolean,
    },
    callback?: ActionCallback,
  }) => {
    const {
      athleteId,
      issueId,
      issueType,
      exerciseInstances,
      makeExerciseInstancesEditable,
      placeholderSessionId,
      sessionId,
      sessionDate,
      sectionId,
      maintenance,
    } = data;

    dispatch({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'CREATE_SESSION',
    });

    return createRehabSession(
      athleteId,
      issueId,
      issueType,
      exerciseInstances,
      sessionId,
      sessionDate,
      sectionId,
      maintenance
    ).then(
      (updatedSession) => {
        dispatch({
          type: 'REPLACE_SESSION',
          previousIdForSession:
            placeholderSessionId != null ? placeholderSessionId : sessionId,
          session: updatedSession,
          makeExerciseInstancesEditable,
          initialExerciseInstances: exerciseInstances ?? [],
          sectionId,
        });

        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'SUCCESS',
          actionType: 'CREATE_SESSION',
        });

        callback?.onSuccess?.();
      },
      (xhr) => {
        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'FAILURE',
          actionType: 'CREATE_SESSION',
          message: getErrorMessage(xhr),
        });
      }
    );
  };

  const updateExerciseValue = async ({
    maintenance,
    newExerciseDetails,
    refetchSessionsAfterAction,
    placeholderSessionId,
    issueId = null,
    issueType = null,
  }: {
    maintenance: boolean,
    newExerciseDetails: ExerciseUpdateDetails | ExerciseReasonUpdateDetails,
    refetchSessionsAfterAction?: boolean,
    placeholderSessionId?: ?number, // only need previousSessionId on drag of exercise item
    issueId?: number,
    issueType?: string,
  }) => {
    const updateExerciseDetail = {
      maintenance,
      exercise_instances: [newExerciseDetails],
      issue_id: issueId,
      issue_type: issueType,
    };

    dispatch({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'UPDATE_EXERCISE',
    });

    return updateExercise(updateExerciseDetail).then(
      (updatedSessions) => {
        if (refetchSessionsAfterAction) {
          refetchSessions();
        } else if (placeholderSessionId != null) {
          updatedSessions.forEach((updatedSession) => {
            if (updatedSession.id !== newExerciseDetails?.previous_session_id) {
              dispatch({
                type: 'REPLACE_SESSION',
                previousIdForSession: placeholderSessionId,
                session: updatedSession,
                makeExerciseInstancesEditable: false,
                initialExerciseInstances: null,
                sectionId: null,
              });
            }
          });
        }

        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'SUCCESS',
          actionType: 'UPDATE_EXERCISE',
        });
      },
      (xhr) => {
        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'FAILURE',
          actionType: 'UPDATE_EXERCISE',
          message: getErrorMessage(xhr),
        });
      }
    );
  };

  const deleteExercise = async (
    rehabSessionId: number,
    exerciseId: number,
    sectionId: number,
    refetchSessionsAfterAction: boolean
  ) => {
    dispatch({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'DELETE_EXERCISE',
    });

    return deleteExerciseService(rehabSessionId, exerciseId, sectionId).then(
      () => {
        dispatch({
          type: 'DELETE_EXERCISE',
          exerciseId,
          sectionId,
        });

        if (refetchSessionsAfterAction) {
          refetchSessions();
        }

        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'SUCCESS',
          actionType: 'DELETE_EXERCISE',
        });
      },
      (xhr) => {
        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'FAILURE',
          actionType: 'DELETE_EXERCISE',
          message: getErrorMessage(xhr),
        });
      }
    );
  };

  const deleteEntireSession = (
    deleteParams: DeleteSession,
    callback?: ActionCallback
  ) => {
    dispatch({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'DELETE_SESSION',
    });
    return deleteSession(deleteParams).then(
      (response) => {
        dispatch({
          type: 'REPLACE_SESSION',
          previousIdForSession: deleteParams.rehab_sessions[0].id,
          session: response[0],
          initialExerciseInstances: null,
          sectionId: null,
          makeExerciseInstancesEditable: false,
        });

        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'SUCCESS',
          actionType: 'DELETE_SESSION',
        });

        callback?.onSuccess?.();
      },
      (xhr) => {
        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'FAILURE',
          actionType: 'DELETE_SESSION',
          message: getErrorMessage(xhr),
        });
      }
    );
  };

  const copyExercise = (data: SessionExerciseCopyData) => {
    dispatch({
      type: 'UPDATE_ACTION_STATUS',
      actionStatus: 'PENDING',
      actionType: 'COPY_EXERCISE',
    });
    return copyRehabSessionExercises(data).then(
      () => {
        refetchSessions();
        dispatch({
          type: 'CLEAR_COPY_SELECTIONS',
        });
        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'SUCCESS',
          actionType: 'COPY_EXERCISE',
        });
      },
      (xhr) => {
        dispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'FAILURE',
          actionType: 'COPY_EXERCISE',
          message: getErrorMessage(xhr),
        });
      }
    );
  };

  return {
    updateExerciseValue,
    deleteExercise,
    addToSession,
    copyExercise,
    deleteEntireSession,
  };
};

export default rehabNetworkActions;
