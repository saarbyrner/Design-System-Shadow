// @flow
import type { EventDevelopmentGoal } from '@kitman/modules/src/PlanningHub/src/services/getEventDevelopmentGoals';

export const INITIAL_EVENT_DEVELOPMENT_GOALS: Array<EventDevelopmentGoal> = [
  {
    athlete_event: {
      athlete: {
        id: 0,
        firstname: '',
        lastname: '',
        fullname: '',
        shortname: '',
        user_id: 0,
        avatar_url: '',
        availability: '',
        position: {
          id: 0,
          name: '',
          abbreviation: '',
        },
      },
      id: 0,
      participation_level: {
        id: 0,
        name: '',
        canonical_participation_level: 'none',
        include_in_group_calculations: false,
        default: false,
      },
      include_in_group_calculations: false,
      duration: 0,
      rpe: null,
      rating: null,
    },
    event_development_goals: [
      {
        checked: false,
        development_goal: {
          id: 0,
          description: '',
          start_time: '',
          close_time: '',
          principles: [],
          development_goal_types: [],
        },
        development_goal_completion_type_id: null,
      },
    ],
  },
];

export const INITIAL_FILTER = {
  search: '',
  athlete_ids: [],
  position_ids: [],
  development_goal_type_ids: [],
  principle_ids: [],
};
