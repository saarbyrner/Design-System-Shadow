import { rest } from 'msw';

export const mockdata = {
  id: 1,
  organisation_annotation_type: {
    id: 1,
    name: 'Medical note',
    type: 'OrganisationAnnotationTypes::Medical',
  },
  document_note_category_ids: [],
  annotationable_type: 'Athlete',
  annotationable: {
    id: 1,
    fullname: 'An Athlete',
    avatar_url: 'img/url',
    availability: 'unavailable',
    athlete_squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    type: 'Athlete',
  },
  title: '1',
  content: '<p>My content</p>',
  annotation_date: '2022-07-14T23:00:00Z',
  annotation_actions: [],
  expiration_date: null,
  attachments: [
    {
      filetype: 'binary/octet-stream',
      filesize: 1010043,
      filename: 'file.xls',
      url: 'attachment/url',
    },
  ],
  archived: false,
  created_by: {
    id: 1,
    fullname: 'A Staff',
  },
  created_at: '2022-07-15T08:51:20Z',
  updated_by: null,
  updated_at: '2022-07-15T08:51:20Z',
  restricted_to_doc: false,
  restricted_to_psych: false,
  illness_occurrences: [
    {
      id: 11523,
      issue_type: 'illness',
      occurrence_date: 'Jul  5, 2022',
      full_pathology: 'Respiratory tract infection (bacterial or viral) [N/A]',
    },
  ],
  injury_occurrences: [],
  author: {
    id: 1,
    fullname: 'A Staff',
  },
  expired: false,
};

export const handler = rest.post('/medical/notes', (req, res, ctx) =>
  res(ctx.json(mockdata))
);
