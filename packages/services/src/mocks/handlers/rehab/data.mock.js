const rehabSession = [
  {
    id: 1,
    start_time: '2022-10-27T12:00:00.000+01:00',
    end_time: '2022-10-27T12:00:00.000+01:00',
    timezone: 'Europe/Dublin',
    title: 'General',
    sections: [
      {
        id: 1,
        title: 'General',
        theme_color: null,
        order_index: 1,
        exercise_instances: [
          {
            id: 1,
            exercise_template_id: 161,
            variations:
              '[{"key":"sets-reps-weight","params":[{"key":"sets","value":"3","config":{}},{"key":"reps","value":"3","config":{}},{"key":"weight","value":"10","config":{"unit":"lb"}}]},{"key":"duration","params":[{"key":"duration","value":"30","config":{"unit":"min"}},{"key":"reps","value":"3","config":{}},{"key":"weight","value":"10","config":{"unit":"lb"}}]}]',
            comment: null,
            order_index: 1,
            section_id: 1,
          },
          {
            id: 2,
            exercise_template_id: 172,
            variations:
              '[{"key":"range-of-motion","params":[{"key":"range-of-motion","value":"3","config":{"unit":"in"}}]}]',
            comment: null,
            order_index: 2,
            section_id: 1,
          },
        ],
      },
    ],
  },
];

export const rehabGroups = [
  {
    id: 22,
    name: 'Warm down',
    scope: 'default',
    theme_colour: '#1f9bff',
    tagging_count: 2,
  },
  {
    id: 23,
    name: 'Cardio',
    scope: 'default',
    theme_colour: '#9505f6',
    tagging_count: 2,
  },
  {
    id: 24,
    name: 'Group test',
    scope: 'Default',
    theme_colour: '#4c8c93',
    tagging_count: 1,
  },
];

export const tagData = {
  id: 1,
  name: 'Test Tag',
  scope: 'Default',
  theme_colour: '#FFFFFF',
  tagging_count: 0,
};

export const tagAnExercisesResponseData = { success: true };

export default rehabSession;
