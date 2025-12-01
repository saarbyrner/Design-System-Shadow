import { rest } from 'msw';

const data = [
  {
    athlete_event: {
      id: 1,
      athlete: {
        id: 1,
        fullname: 'John Doe',
        avatar_url: '/john_doe_avatar.png',
        position: {
          id: 1,
          name: 'Back',
        },
      },
    },
    event_development_goals: [
      {
        checked: true,
        development_goal: {
          id: 1,
          description: 'Passing enhancement from defense',
          principles: [
            {
              id: 1,
              name: 'Long pass',
              principle_categories: [],
              principle_types: [
                {
                  name: 'Tecnical',
                },
              ],
              phases: [],
            },
          ],
          development_goal_types: [
            {
              id: 1,
              name: 'Tecnical',
            },
          ],
        },
        development_goal_completion_type_id: null,
      },
      {
        checked: false,
        development_goal: {
          id: 2,
          description: 'Improved dribbling defense',
          principles: [
            {
              id: 2,
              name: 'Catching skills',
              principle_categories: [],
              principle_types: [
                {
                  name: 'Tactical',
                },
              ],
              phases: [],
            },
          ],
          development_goal_types: [
            {
              id: 2,
              name: 'Tactical',
            },
          ],
        },
        development_goal_completion_type_id: 1,
      },
    ],
  },
  {
    athlete_event: {
      id: 2,
      athlete: {
        id: 2,
        fullname: 'Peter Grant',
        avatar_url: '/peter_grant_avatar.png',
        position: {
          id: 1,
          name: 'Back',
        },
      },
    },
    event_development_goals: [
      {
        checked: true,
        development_goal: {
          id: 3,
          description: 'Passing enhancement from defense',
          principles: [
            {
              id: 1,
              name: 'Long pass',
              principle_categories: [],
              principle_types: [
                {
                  name: 'Tecnical',
                },
              ],
              phases: [],
            },
          ],
          development_goal_types: [
            {
              id: 2,
              name: 'Tactical',
            },
          ],
        },
        development_goal_completion_type_id: 2,
      },
      {
        checked: true,
        development_goal: {
          id: 4,
          description: 'Clearing balls improvement',
          principles: [
            {
              id: 1,
              name: 'Long pass',
              principle_categories: [],
              principle_types: [
                {
                  name: 'Tecnical',
                },
              ],
              phases: [],
            },
            {
              id: 3,
              name: 'Defense skills',
              principle_categories: [],
              principle_types: [
                {
                  name: 'Tecnical',
                },
              ],
              phases: [],
            },
          ],
          development_goal_types: [
            {
              id: 1,
              name: 'Tactical',
            },
          ],
        },
        development_goal_completion_type_id: 3,
      },
    ],
  },
  {
    athlete_event: {
      id: 3,
      athlete: {
        id: 3,
        fullname: 'Philip Callahan',
        avatar_url: '/philip_callahan_avatar.png',
        position: {
          id: 2,
          name: 'Forward',
        },
      },
    },
    event_development_goals: [
      {
        checked: true,
        development_goal: {
          id: 4,
          description: 'Passing enhancement from attack',
          principles: [
            {
              id: 4,
              name: 'Short pass',
              principle_categories: [],
              principle_types: [
                {
                  name: 'Tecnical',
                },
              ],
              phases: [],
            },
          ],
          development_goal_types: [
            {
              id: 1,
              name: 'Tecnical',
            },
          ],
        },
        development_goal_completion_type_id: null,
      },
      {
        checked: false,
        development_goal: {
          id: 5,
          description: 'Improved dribbling attack',
          principles: [
            {
              id: 5,
              name: 'Attack skills',
              principle_categories: [],
              principle_types: [
                {
                  name: 'Tactical',
                },
              ],
              phases: [],
            },
          ],
          development_goal_types: [
            {
              id: 2,
              name: 'Tactical',
            },
          ],
        },
        development_goal_completion_type_id: 4,
      },
    ],
  },
];

const handler = rest.post(
  '/ui/planning_hub/events/:eventId/event_development_goals/search',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
