import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Medical note',
    type: 'OrganisationAnnotationTypes::Medical',
    creation_allowed: true,
  },
  {
    id: 2,
    name: 'Nutrition note',
    type: 'OrganisationAnnotationTypes::Nutrition',
    creation_allowed: true,
  },
  {
    id: 3,
    name: 'Rehab Note',
    type: 'OrganisationAnnotationTypes::RehabSession',
    creation_allowed: true,
  },
  {
    id: 4,
    name: 'Telephone Note',
    type: 'OrganisationAnnotationTypes::Telephone',
    creation_allowed: false,
  },
  {
    id: 5,
    name: 'Diagnostic note',
    type: 'OrganisationAnnotationTypes::Diagnostic',
    creation_allowed: true,
  },
  {
    id: 6,
    name: 'Document note',
    type: 'OrganisationAnnotationTypes::Document',
    creation_allowed: true,
  },
];
const handler = rest.get('/ui/annotations/medical_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
