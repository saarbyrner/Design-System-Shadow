import { rest } from 'msw';

const data = {
  id: 25,
  athlete_id: 22213,
  athlete: {
    id: 22213,
    firstname: 'Emile',
    lastname: 'Heskey',
    fullname: 'Heskey, Emile',
    shortname: 'E Heskey',
    availability: 'unavailable',
    position: 'Blindside Flanker',
  },
  display_name: 'Custom Allergy Name',
  allergen_type: 'DrfirstDrug',
  allergen: {
    rcopia_id: '21119',
    name: 'Celecoxib',
    groups: [
      { group_id: '21', name: 'Sulfa (Sulfonamide Antibiotics)' },
      { group_id: '11559', name: 'Sulfur, Elemental' },
    ],
  },
  name: 'Custom Allergy Name',
  ever_been_hospitalised: false,
  require_epinephrine: true,
  symptoms: 'Sore right foot.',
  severity: 'severe',
  restricted_to_doc: false,
  restricted_to_psych: false,
  diagnosed_on: null,
};

const handler = rest.put(
  '/medical/allergies/:allergyId/update',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
