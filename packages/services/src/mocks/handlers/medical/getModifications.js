import { rest } from 'msw';

const modifications = [
  {
    id: 1,
    title: 'Bruno’s rehab update',
    content:
      'Bruno’s return to play is progressing as expected. He is back to walking and working on jogging during rehab. He shouldn’t attempt to jog during any sessions but may attend tactical sessions in a walking capacity.',
    organisation_annotation_type: {
      id: 2564,
      name: 'Modification note',
      type: 'OrganisationAnnotationTypes::Modification',
    },
    annotationable: {
      type: 'Athlete',
      id: 1,
      fullname: 'Bruno Bullard',
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
    expiration_date: null,
    expired: false,
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
    squad: {
      id: 1,
      name: 'Full roster',
    },
  },
  {
    id: 2,
    title: 'Kosta’s Rehab update 02',
    content:
      'Kosta has been experiencing discomfort in his left hamstring. We are concerned about the load it is taking and wish for him to rest it for the next 6 weeks. Will review weekly and update as needed.',
    organisation_annotation_type: {
      id: 2564,
      name: 'Modification note',
      type: 'OrganisationAnnotationTypes::Modification',
    },
    annotationable: {
      type: 'Athlete',
      id: 2,
      fullname: 'Kosta Aaron',
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
    expiration_date: null,
    expired: false,
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
    squad: {
      id: 1,
      name: 'Full roster',
    },
  },
];

const data = {
  medical_notes: modifications,
  total_count: 1000,
  meta: {
    next_page: null,
  },
};
const handler = rest.post('/medical/notes/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
