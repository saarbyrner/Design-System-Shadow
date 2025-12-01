import { rest } from 'msw';

const data = {
  id: 1,
  title: 'Rehab update',
  content:
    'Collision during tackle in match against the Seahawks. Initial diagnoses suggested fracture. Game medic referred to local hospital. X-Ray was inconclusive, referred to CT. MRI performed as well, these both pointed towards Lateral Malleolus Fracture and mild Medial Malleolus Fracture, consulting surgeon recommended operating. Open reduction and internal fixation (ORIF) recommended by consultant. Three screws and plates fitted by surgeon for Lateral Malleolus Fracture. Bone graft required for Medial Malleolus Fracture and screws fixed to aid recovery. Allow 6 - 8 weeks for recovery, full p...',
  organisation_annotation_type: {
    id: 1,
    name: 'Medical note',
    type: 'OrganisationAnnotationTypes::Medical',
  },
  annotationable: {
    type: 'Athlete',
    id: 1,
    fullname: 'Marcius Vega',
    avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
    availability: 'available',
    athlete_squads: [
      {
        id: 1,
        name: 'Full roster',
      },
    ],
  },
  author: {
    id: 1,
    fullname: 'John Jones',
  },
  annotation_date: '2021-06-23T12:10:00Z',
  expiration_date: '2021-06-28T12:10:00Z',
  expired: true,
  created_at: '2021-06-24T13:18:31Z',
  restrict_to_doc: false,
  restrict_to_psych: false,
  attachments: [
    {
      filename: 'Gordon_Morales Rehab Plan Jan 2021.pdf',
      filetype: 'application/pdf',
      filesize: '12MB',
      url: '/fileurl.pdf',
    },
  ],
  illness_occurrences: [
    {
      id: 1,
      issue_type: 'illness',
      occurrence_date: '2021-06-23T12:10:00Z',
      full_pathology: 'Asthma and/or allergy',
    },
  ],
  injury_occurrences: [
    {
      id: 1,
      issue_type: 'injury',
      occurrence_date: '2021-06-23T12:10:00Z',
      full_pathology: 'Fracture tibia and fibula at ankle joint - [Left]',
    },
  ],
};

const handler = rest.put('/medical/notes/:noteId/expire', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
