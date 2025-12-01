import { rest } from 'msw';

const treatmentSessions = {
  id: 1,
  referring_physician: 'Mr Test Physician',
  user: {
    id: 1,
    firstname: 'firstname',
    lastname: 'lastname',
    fullname: 'firstname lastname',
  },
  athlete: {
    id: 2,
    firstname: 'firstname',
    lastname: 'lastname',
    fullname: 'firstname lastname',
    shortname: 'f lastname',
  },
  start_time: '2021-08-12T16:00:00Z',
  end_time: '2021-08-17T16:30:00Z',
  timezone: 'Europe/Dublin',
  title: 'Treatment Note',
  created_by: {
    id: 1,
    firstname: 'firstname',
    lastname: 'lastname',
    fullname: 'firstname lastname',
  },
  created_at: '2021-08-12T16:09:02Z',
  organisation_id: 37,
  treatments: [
    {
      id: 1,
      treatment_modality: {
        id: 38,
        name: 'Ice Pack',
        treatment_category: {
          id: 3,
          name: 'Cryotherapy/Compression',
        },
      },
      duration: null,
      reason: 'general',
      issue_type: null,
      issue: null,
      treatment_body_areas: [
        {
          id: 37150,
          treatable_area_type: 'Emr::Private::Models::BodyPart',
          treatable_area: {
            id: 93,
            name: 'Calcaneus',
            osics_body_area: {
              id: 1,
              name: 'Ankle',
            },
          },
          side: {
            id: 1,
            name: 'Left',
          },
          name: 'Left Calcaneus',
        },
        {
          id: 37151,
          treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
          treatable_area: {
            id: 1,
            name: 'Ankle',
          },
          side: {
            id: 1,
            name: 'Left',
          },
          name: 'Left Ankle',
        },
      ],
      issue_name: null,
      is_billable: false,
      billable_items: [
        {
          referring_physician: '',
          amount_charged: '',
          cpt_code: '',
          icd_code: '',
          discount: '',
          amount_due: '',
          date_paid: '',
          amount_paid_athlete: '',
          amount_paid_insurance: '',
        },
      ],
      note: 'Doggo ipsum most angery pupper I have ever seen dat tungg tho tungg length boy long doggo borking doggo',
    },
    {
      id: 2,
      treatment_modality: {},
      duration: null,
      reason: 'general',
      issue_type: null,
      issue: null,
      treatment_body_areas: [
        {
          id: 37150,
          treatable_area_type: 'Emr::Private::Models::BodyPart',
          treatable_area: {
            id: 93,
            name: 'Calcaneus',
            osics_body_area: {
              id: 1,
              name: 'Ankle',
            },
          },
          side: {
            id: 1,
            name: 'Left',
          },
          name: 'Left Calcaneus',
        },
        {
          id: 37151,
          treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
          treatable_area: {
            id: 1,
            name: 'Ankle',
          },
          side: {
            id: 1,
            name: 'Left',
          },
          name: 'Left Ankle',
        },
      ],
      is_billable: true,
      billable_items: [
        {
          amount_charged: '150.0',
          cpt_code: '12345',
          icd_code: 'abcdef',
          discount: '20.0',
          amount_due: '120.0',
          date_paid: '2021-08-11T23:00:00Z',
          amount_paid_athlete: '10.0',
          amount_paid_insurance: '120.0',
        },
      ],
      issue_name: null,
      note: 'Doggo ipsum most angery pupper I have ever seen dat tungg tho tungg length boy long doggo borking doggo',
    },
  ],
  annotation: {
    id: 3,
    organisation_annotation_type: null,
    annotationable_type: 'TreatmentSession',
    annotationable: null,
    title: 'Note Title 164476',
    content:
      'Doggo ipsum most angery pupper I have ever seen dat tungg tho tungg length boy long doggo borking doggo',
    annotation_date: '2021-08-11T23:00:00Z',
    annotation_actions: [],
    attachments: [
      {
        id: 1,
        url: 'url',
        filename: 'file.pdf.png',
        filetype: 'image/png',
        filesize: 9133,
        audio_file: false,
        confirmed: true,
        presigned_post: null,
        download_url: 'url',
        created_by: {
          id: 1,
          firstname: 'firstname',
          lastname: 'lastname',
          fullname: 'firstname lastname',
        },
      },
    ],
    archived: false,
    created_by: {
      id: 1,
      fullname: 'firstname lastname',
    },
    created_at: '2021-08-12T16:09:02Z',
    updated_by: null,
    updated_at: '2022-01-13T02:51:09Z',
  },
};

const data = {
  treatment_sessions: [treatmentSessions],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 6,
  },
};
const handler = rest.post('/treatment_sessions/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
