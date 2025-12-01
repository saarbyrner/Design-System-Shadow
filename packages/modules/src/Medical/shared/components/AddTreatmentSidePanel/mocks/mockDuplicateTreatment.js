const mockDuplicateTreatment = {
  id: 1,
  user: {
    id: 2,
    firstname: 'Matt',
    lastname: 'Murdock',
    fullname: 'Matt Murdock',
  },
  athlete: {
    id: 3,
    firstname: 'Wade',
    lastname: 'Wilson',
    fullname: 'Wade Wilson',
  },
  start_time: '2022-07-12T11:00:00Z',
  end_time: '2022-07-12T11:30:00Z',
  timezone: 'Europe/Dublin',
  title: 'Treatment Note',
  created_by: {
    id: 2,
    firstname: 'Matt',
    lastname: 'Murdock',
    fullname: 'Matt Murdock',
  },
  created_at: '2022-07-12T11:49:48Z',
  treatments: [
    {
      id: 45524,
      treatment_modality: {
        id: 38,
        name: 'Ice Pack',
        treatment_category: {
          id: 3,
          name: 'Cryotherapy/Compression',
        },
      },
      duration: '20',
      reason: 'general',
      issue_type: null,
      issue_id: null,
      issue: null,
      treatment_body_areas: [
        {
          id: 65686,
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
      note: 'Natus quod qui explicabo et nisi.',
      cpt_code: null,
      is_billable: false,
      billable_items: [
        {
          cpt_code: null,
          icd_code: null,
          is_billable: false,
          amount_charged: null,
          discount: null,
          amount_paid_insurance: null,
          amount_due: null,
          amount_paid_athlete: null,
          date_paid: null,
        },
      ],
      amount_paid_athlete: null,
      amount_paid_insurance: null,
    },
  ],
  annotation: {
    id: 2640424,
    organisation_annotation_type: null,
    annotationable_type: 'TreatmentSession',
    annotationable: null,
    title: 'Note Title 2640424',
    content:
      "You want a Pepsi, pal, you're gonna pay for it. -- Molestiae est enim dolorem voluptas.",
    annotation_date: '2022-07-11T23:00:00Z',
    annotation_actions: [],
    expiration_date: null,
    attachments: [],
    archived: false,
    created_by: {
      id: 2,
    },
    created_at: '2022-07-12T11:49:48Z',
    updated_by: null,
    updated_at: '2022-07-13T04:51:12Z',
  },
};

export default mockDuplicateTreatment;
