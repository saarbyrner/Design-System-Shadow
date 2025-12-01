import { rest } from 'msw';

const data = {
  columns: [
    {
      row_key: 'athlete',
      datatype: 'object',
      name: 'Athlete',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: true,
      id: 87,
      active: true,
      default: true,
      container_id: null,
      order: 0,
      protected: false,
    },
    {
      row_key: 'rpe',
      datatype: 'plain',
      name: 'RPE',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: false,
      id: 88,
      active: true,
      default: true,
      container_id: null,
      order: 1,
      protected: false,
    },
    {
      row_key: 'minutes',
      datatype: 'plain',
      name: 'Minutes',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: false,
      id: 89,
      active: true,
      default: true,
      container_id: null,
      order: 2,
      protected: false,
    },
    {
      row_key: 'rpe_x_duration',
      datatype: 'plain',
      name: 'RPE x Duration',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: true,
      id: 90,
      active: true,
      default: true,
      container_id: null,
      order: 3,
      protected: false,
    },
  ],
  containers: [],
  next_id: null,
  rows: [
    {
      id: 30693,
      athlete: {
        id: 30693,
        fullname: 'Deco 10',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?markalign=left,bottom&markpad=0&markfit=max&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P3R4dGNscj1mZmYmdHh0c2l6ZT0xNiZ0eHRzaGFkPTImYmc9OTUyNDJmMzgmdHh0Zm9udD1BdmVuaXIgTmV4dCBDb25kZW5zZWQgTWVkaXVtJnR4dGFsaWduPWNlbnRlciZ0eHRwYWQ9NSZ3PTM2JnR4dDY0PU1UQQ&?ixlib=rails-4.2.0&auto=enhance&crop=faces&fit=crop&w=100&h=100',
      },
      rpe: null,
      minutes: null,
      rpe_x_duration: null,
    },
    {
      id: 39894,
      athlete: {
        id: 39894,
        fullname: 'Test Email Athlete',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?ixlib=rails-4.2.0&auto=enhance&crop=faces&fit=crop&w=100&h=100',
      },
      rpe: null,
      minutes: null,
      rpe_x_duration: null,
    },
  ],
};

const handler = rest.get(
  '/planning_hub/events/1/collections_tab',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
