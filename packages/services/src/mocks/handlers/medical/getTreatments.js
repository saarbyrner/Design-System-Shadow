import { rest } from 'msw';

const treatment = {
  id: 13248,
  user: {
    id: 12286,
    firstname: 'Jonathan',
    lastname: 'Murphy',
    fullname: 'Jonathan Murphy',
  },
  athlete: {
    id: 30693,
    firstname: 'Deco',
    lastname: '10',
    fullname: 'Deco 10',
    shortname: 'D 10',
  },
  start_time: '2021-08-12T16:00:00Z',
  end_time: '2021-08-12T16:30:00Z',
  timezone: 'Europe/Dublin',
  title: 'Treatment Note',
  created_by: {
    id: 12286,
    firstname: 'Jonathan',
    lastname: 'Murphy',
    fullname: 'Jonathan Murphy',
  },
  created_at: '2021-08-12T16:09:02Z',
  treatments: [
    {
      id: 22790,
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
      note: "Now, remember. According to my theory, you interfered with your parents' first meeting. If they don't meet, they won't fall in love, they won't get married and they won't have kids. That's why your older brother's disappearing from that photograph. Your sister will follow, and unless you repair the damage, you'll be next. -- Ea id expedita veniam voluptates. Alias aut in.",
    },
    {
      id: 22791,
      treatment_modality: {
        id: 209,
        name: 'Rehab Exercises',
        treatment_category: {
          id: 19,
          name: 'AT Directed Rehab',
        },
      },
      duration: null,
      reason: 'general',
      issue_type: null,
      issue: null,
      treatment_body_areas: [
        {
          id: 37152,
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
      note: "I g-guess you guys aren't ready for that yet. But your kids are gonna love it. -- Eum architecto beatae tenetur cum et omnis aut.",
    },
  ],
  annotation: {
    id: 164476,
    organisation_annotation_type: null,
    annotationable_type: 'TreatmentSession',
    annotationable: null,
    title: 'Note Title 164476',
    content:
      'Hey, Dad! George! Hey, you on the bike! -- Delectus magni ut cum deserunt. Tempora et quidem non porro facere. Repellendus quasi qui fugiat dignissimos odio. Repudiandae non illum veritatis voluptatibus mollitia et optio. Id enim nihil praesentium libero qui dolor. Tenetur est vero repellendus voluptates.',
    annotation_date: '2021-08-11T23:00:00Z',
    annotation_actions: [],
    attachments: [],
    archived: false,
    created_by: {
      id: 12286,
      fullname: 'Jonathan Murphy',
    },
    created_at: '2021-08-12T16:09:02Z',
    updated_by: null,
    updated_at: '2022-01-13T02:51:09Z',
  },
};

const data = {
  treatment_sessions: [treatment],
  total_count: 1000,
  meta: {
    next_page: null,
  },
};
const handler = rest.post('/treatment_sessions/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
