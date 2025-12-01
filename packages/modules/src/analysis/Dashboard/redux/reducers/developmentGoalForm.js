/* eslint-disable flowtype/require-valid-file-annotation */
import _cloneDeep from 'lodash/cloneDeep';

export const getEmptyDevelopmentGoalForm = () =>
  _cloneDeep({
    id: null,
    athlete_id: null,
    description: '',
    development_goal_type_ids: [],
    principle_ids: [],
    start_time: null,
    close_time: null,
    copy_to_athlete_ids: [],
  });

export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_DEVELOPMENT_GOAL_FORM': {
      return {
        ...state,
        isOpen: true,
        initialFormData: action.payload.developmentGoal
          ? {
              id: action.payload.developmentGoal.id,
              athlete_id: action.payload.developmentGoal.athlete.id,
              description: action.payload.developmentGoal.description,
              development_goal_type_ids:
                action.payload.developmentGoal.development_goal_types.map(
                  ({ id }) => id
                ),
              principle_ids: action.payload.developmentGoal.principles.map(
                ({ id }) => id
              ),
              start_time: action.payload.developmentGoal.start_time,
              close_time: action.payload.developmentGoal.close_time,
              copy_to_athlete_ids: [],
            }
          : {
              ...getEmptyDevelopmentGoalForm(),
              athlete_id:
                action.payload.pivotedAthletes.length > 0
                  ? action.payload.pivotedAthletes[0]
                  : null,
              copy_to_athlete_ids:
                action.payload.pivotedAthletes.length > 1
                  ? action.payload.pivotedAthletes.slice(1)
                  : [],
            },
      };
    }
    case 'CLOSE_DEVELOPMENT_GOAL_FORM': {
      return {
        ...state,
        isOpen: false,
      };
    }
    case 'SAVE_DEVELOPMENT_GOAL_SUCCESS': {
      return {
        ...state,
        isOpen: false,
        status: null,
      };
    }
    case 'SAVE_DEVELOPMENT_GOAL_FAILURE': {
      return {
        ...state,
        status: 'FAILURE',
      };
    }
    case 'SAVE_DEVELOPMENT_GOAL_LOADING': {
      return {
        ...state,
        status: 'LOADING',
      };
    }
    default:
      return state;
  }
}
