import { rest } from 'msw';

const data = {
  events: [
    {
      athletes: [
        {
          id: 1644,
          firstname: "Niccolo'",
          lastname: 'Cannone',
          fullname: "Niccolo' Cannone",
        },
        {
          id: 28022,
          firstname: 'Fabi',
          lastname: 'Menghini',
          fullname: 'Fabi Menghini',
        },
        {
          id: 40211,
          firstname: 'Tomas',
          lastname: 'Albornoz',
          fullname: 'Tomas Albornoz',
        },
      ],
      non_setup_athletes_identifiers: ['someone_else', 'john_doe'],
    },
  ],
  success: true,
};

const handler = rest.post(
  '/workloads/import_workflow/parse_file',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
