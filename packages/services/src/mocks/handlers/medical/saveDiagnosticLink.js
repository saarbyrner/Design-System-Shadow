import { rest } from 'msw';

const diagnostic = {
  attached_links: [
    { title: 'this is a test link to an MRI', uri: 'www.fakelink.com', id: 0 },
  ],
  attachments: [],
  diagnostic_date: '2022-06-02T23:00:00Z',
  id: 168865,
  is_medication: false,
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Bandage',
  prescriber: {
    id: 453522,
    name: 'Dr. Dolittle',
  },
};
const data = {
  diagnostic,
};

const handler = rest.post(
  `/athletes/${diagnostic.athleteId}/diagnostics/${diagnostic.diagnosticId}/attach_links`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
