import { rest } from 'msw';

const data = {
  id: 1,
  athlete_id: 1,
  athlete: {
    id: 1,
    avatar_url: 'url-link',
    firstname: 'John Doe',
    lastname: 'Doe',
    fullname: 'John Doe',
    availability: 'unavailable',
    position: 'First Row',
  },
  display_name: 'Latex gloves',
  allergen_type: 'MiscAllergy',
  allergen: {
    id: 2,
    name: 'Latex',
    allergen_type: 'Latex and rubber allergy',
  },
  severity: 'severe',
  ever_been_hospitalized: true,
  diagnosed_on: null,
  archived: false,
  require_epinephrine: false,
  restricted_to_doc: false,
  restricted_to_psych: false,
  symptoms: 'dont like latex',
  created_at: '2023-05-01T15:56:36.000+01:00',
  updated_at: '2023-05-01T15:56:36.000+01:00',
  created_by: null,
};

const handler = rest.get(`/ui/medical/allergies/:allergyId`, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
