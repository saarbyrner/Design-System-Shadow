import { rest } from 'msw';

export const mockdata = {
  organisation_annotation_type_id: 11446,
  annotationables: [
    {
      annotationable_type: 'Athlete',
      annotationable_id: 39894,
    },
    {
      annotationable_type: 'Athlete',
      annotationable_id: 39894,
    },
  ],
  title: 'Daily status note',
  annotation_date: 'Sun Apr 14 2024 18:00:00 GMT+0000',
  content: '<p></p><p>injured1</p>',
  scope_to_org: true,
};

export const handler = rest.post(
  '/medical/notes/create_bulk',
  (req, res, ctx) => res(ctx.json(mockdata))
);
