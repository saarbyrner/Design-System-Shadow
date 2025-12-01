import { rest } from 'msw';

const data = [
  {
    id: 40211,
    rows: [
      {
        Firstname: {
          value: 'Tomas',
          editable: false,
        },
      },
      {
        Lastname: {
          value: 'Albornoz',
          editable: false,
        },
      },
      {
        '5m': {
          value: 2,
          id: 'f560de64-8990-46db-978e-2b6281d4dfbf',
          editable: true,
        },
      },
      {
        '6-0-5': {
          value: 5,
          id: 'ae148db2-e384-48bd-9d86-1821163b5587',
          editable: true,
        },
      },
    ],
  },
  {
    id: 1644,
    rows: [
      {
        Firstname: {
          value: "Niccolo'",
          editable: false,
        },
      },
      {
        Lastname: {
          value: 'Cannone',
          editable: false,
        },
      },
      {
        '5m': {
          value: 2,
          id: '0da1f347-ff3c-4c11-b56d-b26cb4441ed4',
          editable: true,
        },
      },
      {
        '6-0-5': {
          value: 5,
          id: 'd4402fb1-3a67-4c2b-8942-58d7e50f1eb1',
          editable: true,
        },
      },
    ],
  },
  {
    id: 28022,
    rows: [
      {
        Firstname: {
          value: 'Fabi',
          editable: false,
        },
      },
      {
        Lastname: {
          value: 'Menghini',
          editable: false,
        },
      },
      {
        '5m': {
          value: 2,
          id: '50748526-ee10-4fcf-a3cb-d293118d3d2a',
          editable: true,
        },
      },
      {
        '6-0-5': {
          value: null,
          id: null,
          editable: true,
        },
      },
    ],
  },
];

const handler = rest.get(
  'planning_hub/events/:eventId/third_party_imports/:integrationName',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
