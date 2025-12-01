import { rest } from 'msw';

// non null athlete, category: concussion, form_type: baseline
const concussionBaselinesData = [
  {
    athlete: {
      id: 2942,
      fullname: 'Conway Adam',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    baselines: [
      {
        form_id: 1,
        test: 'King Devick - Baseline',
        date_completed: '2022-02-03T00:00:00.000+00:00',
        expiry_date: '2023-08-29T11:00:48.000+01:00',
        status: {
          description: 'Complete',
          key: 'complete',
        },
        examiner: 'Stefano Santomauro',
      },
      {
        test: 'Near Point of Convergence - Baseline',
        status: {
          description: 'Outstanding',
          key: 'outstanding',
        },
      },
      {
        test: 'Near Point of Convergence - Baseline',
        status: {
          description: 'Outstanding',
          key: 'outstanding',
        },
      },
      {
        test: 'Baseline (Neurological Section Optional)',
        status: {
          description: 'Outstanding',
          key: 'outstanding',
        },
      },
      {
        test: 'Concussion Assessment - Baseline',
        status: {
          description: 'Outstanding',
          key: 'outstanding',
        },
      },
    ],
  },
];

// non null athlete, category: concussion injury_occurrence_id: 1
const concussionIncidentFormsData = [
  {
    id: 56,
    organisation_id: 6,
    form: {
      id: 26,
      category: 'concussion',
      group: 'incident',
      key: 'incident',
      name: 'Concussion incident',
      fullname: 'Concussion incident - FUll NAME',
      enabled: true,
      created_at: '2022-07-13T07:56:59Z',
      updated_at: '2022-07-13T07:56:59Z',
    },
    date: '2022-07-12T00:00:00Z',
    expiry_date: '2023-07-12T00:00:00Z',
    status: 'Complete',
    editor: {
      id: 93972,
      firstname: 'Stefano',
      lastname: 'Santomauro',
      fullname: 'Stefano Santomauro',
    },
    athlete: {
      id: 2942,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Conway Adam',
      position: {
        id: 77,
        name: 'Scrum Half',
        order: 8,
      },
      availability: 'unavailable',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: {
      injury: {
        id: 91251,
        athlete_id: 2942,
        osics: {
          osics_code: 'HNCA',
          pathology: {
            id: 417,
            name: 'Acute Concussion',
          },
          classification: {
            id: 20,
            name: 'Concussion/ Brain Injury',
          },
          body_area: {
            id: 7,
            name: 'Head',
          },
          icd: null,
          bamic: null,
        },
      },
      injury_occurrence: {
        id: 1,
        occurrence_date: '2022-08-19T00:00:00+01:00',
      },
    },
    concussion_diagnosed: {
      description: 'Unknown',
      key: 'unknown',
    },
  },
];

// athleteId would be null, category: concussion, form_type: baseline
const rosterConcussionBaselinesData = {
  meta: {
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 14,
    total_count: 140,
  },
  athlete_baselines: [
    {
      athlete: {
        id: 188,
        fullname: 'Heasip Jamie',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
        availability: 'available',
        position: {
          id: 72,
          name: 'Loose-head Prop',
          order: 1,
        },
      },
      baselines: [
        {
          test: 'King Devick - Baseline',
          group: 'king_devick',
          expiry_date: '2023-09-14T19:54:54.000+01:00',
          date_completed: '2022-01-04T00:00:00.000+00:00',
          status: {
            description: 'Completed',
            key: 'complete',
          },
        },
      ],
    },
    {
      athlete: {
        id: 191,
        fullname: 'Cowman Jason',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
        availability: 'available',
        position: {
          id: 70,
          name: 'Tight-head Prop',
          order: 3,
        },
      },
      baselines: [
        {
          test: 'King Devick - Baseline',
          group: 'king_devick',
          expiry_date: '2022-09-14T19:54:54.000+01:00',
          date_completed: '2021-01-04T00:00:00.000+00:00',
          status: {
            description: 'Expired',
            key: 'expired',
          },
        },
      ],
    },
    {
      athlete: {
        id: 189,
        fullname: 'Nathan Philip',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
        availability: 'available',
        position: {
          id: 76,
          name: 'No. 8',
          order: 7,
        },
      },
      baselines: [
        {
          test: 'King Devick - Baseline',
          group: 'king_devick',
          status: {
            description: 'Outstanding',
            key: 'outstanding',
          },
        },
      ],
    },
  ],
};

// athleteId would be null, category: medical, group: pac_12
const rosterFormsData = [
  {
    id: 799,
    organisation_id: 6,
    form: {
      id: 50,
      category: 'medical',
      group: 'pac_12',
      key: 'care_demographics',
      name: 'CARE demographics',
      fullname: 'PAC-12 - CARE demographics',
      form_type: 'demographics',
      config: null,
      enabled: true,
      created_at: '2022-09-21T18:23:20Z',
      updated_at: '2022-09-21T18:23:20Z',
    },
    date: '2023-05-09T23:46:26Z',
    editor: {
      id: 114885,
      firstname: 'Sean',
      lastname: 'Carty',
      fullname: 'Sean Carty',
    },
    athlete: {
      id: 2942,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: {
        id: 77,
        name: 'Scrum Half',
        order: 8,
      },
      availability: 'unavailable',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_6658?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 795,
    organisation_id: 6,
    form: {
      id: 22,
      category: 'medical',
      group: 'pac_12',
      key: 'concussion_history',
      name: 'Concussion history',
      fullname: null,
      form_type: 'history',
      config: '{}',
      enabled: true,
      created_at: '2022-08-09T14:28:02Z',
      updated_at: '2022-08-18T10:55:19Z',
    },
    date: '2023-05-09T21:59:21Z',
    editor: {
      id: 114885,
      firstname: 'Sean',
      lastname: 'Carty',
      fullname: 'Sean Carty',
    },
    athlete: {
      id: 40211,
      firstname: 'Tomas',
      lastname: 'Albornoz',
      fullname: 'Tomas Albornoz',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'unavailable',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189778?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: {
      description: 'No concussion found',
      key: 'no_concussion_found',
    },
    extra: null,
  },
  {
    id: 794,
    organisation_id: 6,
    form: {
      id: 49,
      category: 'medical',
      group: 'pac_12',
      key: 'concussion_rtp',
      name: 'Concussion RTP',
      fullname: 'PAC-12 - Concussion RTP',
      form_type: 'return_to_play',
      config: null,
      enabled: true,
      created_at: '2022-09-21T18:23:20Z',
      updated_at: '2022-09-21T18:23:20Z',
    },
    date: '2023-05-09T21:57:02Z',
    editor: {
      id: 114885,
      firstname: 'Sean',
      lastname: 'Carty',
      fullname: 'Sean Carty',
    },
    athlete: {
      id: 67736,
      firstname: 'Lorenzo',
      lastname: 'Cannone',
      fullname: 'Lorenzo Cannone',
      position: {
        id: 81,
        name: 'Wing',
        order: 12,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189853?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 785,
    organisation_id: 6,
    form: {
      id: 48,
      category: 'medical',
      group: 'pac_12',
      key: 'concussion_incident',
      name: 'Concussion incident',
      fullname: 'PAC-12 - Concussion incident',
      form_type: 'incident',
      config: null,
      enabled: true,
      created_at: '2022-09-21T18:23:20Z',
      updated_at: '2022-09-21T18:23:20Z',
    },
    date: '2023-04-21T08:07:58Z',
    editor: {
      id: 116757,
      firstname: 'Lauren',
      lastname: 'Robinson',
      fullname: 'Lauren Robinson',
    },
    athlete: {
      id: 3525,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: {
        id: 83,
        name: 'Other',
        order: 14,
      },
      availability: 'injured',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_5703?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: {
      description: 'No concussion found',
      key: 'no_concussion_found',
    },
    extra: {
      association: {
        type: 'injury',
        id: '95005',
      },
    },
  },
  {
    id: 279,
    organisation_id: 6,
    form: {
      id: 49,
      category: 'medical',
      group: 'pac_12',
      key: 'concussion_rtp',
      name: 'Concussion RTP',
      fullname: 'PAC-12 - Concussion RTP',
      form_type: 'return_to_play',
      config: null,
      enabled: true,
      created_at: '2022-09-21T18:23:20Z',
      updated_at: '2022-09-21T18:23:20Z',
    },
    date: '2022-09-25T23:00:00Z',
    editor: {
      id: 119085,
      firstname: 'Adam',
      lastname: 'Singer',
      fullname: 'Adam Singer',
    },
    athlete: {
      id: 3525,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: {
        id: 83,
        name: 'Other',
        order: 14,
      },
      availability: 'injured',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_5703?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
];

// athleteId would be null, category: legal, group: isu
const legalFormsData = [
  {
    id: 816,
    organisation_id: 6,
    form: {
      id: 87,
      category: 'legal',
      group: 'isu',
      key: 'insurance_information_2023',
      name: 'Insurance Information and Verification',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-22T21:44:50Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 815,
    organisation_id: 6,
    form: {
      id: 86,
      category: 'legal',
      group: 'isu',
      key: 'health_history_2023',
      name: 'Pre-Participation Medical History Questionnaire',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-22T16:08:29Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 814,
    organisation_id: 6,
    form: {
      id: 84,
      category: 'legal',
      group: 'isu',
      key: 'consent_treatment_minor',
      name: 'Consent for Treatment of a Minor',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-19T20:17:49Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 813,
    organisation_id: 6,
    form: {
      id: 83,
      category: 'legal',
      group: 'isu',
      key: 'authorization_release_medical_information',
      name: 'Authorization for Release of Medical Information',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-19T20:07:23Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 812,
    organisation_id: 6,
    form: {
      id: 82,
      category: 'legal',
      group: 'isu',
      key: 'verification_medical_policies_procedures',
      name: 'Verification of Medical Policies and Procedures',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-19T19:50:10Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 811,
    organisation_id: 6,
    form: {
      id: 81,
      category: 'legal',
      group: 'isu',
      key: 'supplement_notification',
      name: 'Student-athlete Supplement/Ergogenic Aid Notification Form',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-19T19:41:02Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 810,
    organisation_id: 6,
    form: {
      id: 80,
      category: 'legal',
      group: 'isu',
      key: 'release_and_indemnification_feb_2023',
      name: 'Release and Indemnification Feb 2023',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-19T19:36:59Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
  {
    id: 809,
    organisation_id: 6,
    form: {
      id: 79,
      category: 'legal',
      group: 'isu',
      key: 'demographics_and_information_feb_2023',
      name: 'Demographics and Information Feb 2023',
      fullname: null,
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-05-19T10:58:06Z',
      updated_at: '2023-05-19T10:58:06Z',
    },
    date: '2023-05-19T19:33:53Z',
    editor: {
      id: 151211,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
    },
    athlete: {
      id: 87741,
      firstname: 'Kirsten',
      lastname: 'Sorton',
      fullname: 'Kirsten Sorton',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
];

const nbaFormsData = [
  {
    id: 799,
    organisation_id: 6,
    form: {
      id: 50,
      category: 'medical',
      group: 'nba',
      key: 'game_availability',
      name: 'Prophylactic Ankle Support',
      fullname: 'Prophylactic Ankle Support',
      form_type: 'registration',
      config: null,
      enabled: true,
      created_at: '2023-07-03T15:59:08Z',
      updated_at: '2023-07-03T15:59:08Z',
    },
    date: '2023-07-03T15:59:08Z',
    editor: {
      id: 114885,
      firstname: 'Sean',
      lastname: 'Carty',
      fullname: 'Sean Carty',
    },
    athlete: {
      id: 2942,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: {
        id: 77,
        name: 'Scrum Half',
        order: 8,
      },
      availability: 'unavailable',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_6658?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
];

const plFormsData = [
  {
    id: 799,
    organisation_id: 6,
    form: {
      id: 50,
      category: 'medical',
      group: 'pl',
      key: 'pl_form',
      name: 'Some PL form',
      fullname: 'Some PL form',
      form_type: 'medical',
      config: null,
      enabled: true,
      created_at: '2023-07-03T15:59:08Z',
      updated_at: '2023-07-03T15:59:08Z',
    },
    date: '2023-07-03T15:59:08Z',
    editor: {
      id: 114885,
      firstname: 'Sean',
      lastname: 'Carty',
      fullname: 'Sean Carty',
    },
    athlete: {
      id: 2942,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: {
        id: 77,
        name: 'Scrum Half',
        order: 8,
      },
      availability: 'unavailable',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_6658?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
    },
    concussion_injury: null,
    concussion_diagnosed: null,
    extra: null,
  },
];

const handler = rest.get(
  '/ui/concussion/form_answers_sets',
  (req, res, ctx) => {
    let response;
    const query = req.url.searchParams;
    const athleteId = query.get('athlete_id');
    const category = query.get('category');
    const group = query.get('group');
    const formType = query.get('form_type');
    const injuryOccurrenceId = query.get('injury_occurrence_id');

    if (formType === 'incident' && category === 'concussion') {
      response = concussionIncidentFormsData;
    } else {
      switch (category) {
        case 'concussion': {
          if (injuryOccurrenceId != null) {
            response = concussionIncidentFormsData;
            break;
          }

          response =
            athleteId != null
              ? concussionBaselinesData
              : rosterConcussionBaselinesData;

          break;
        }
        case 'medical': {
          if (group === 'pac_12') {
            response =
              athleteId != null ? concussionBaselinesData : rosterFormsData;
            break;
          }

          if (group === 'nba') {
            response = nbaFormsData;
            break;
          }

          if (group === 'pl') {
            response = plFormsData;
            break;
          }

          break;
        }
        case 'legal': {
          response = group === 'isu' ? legalFormsData : null;
          break;
        }
        default:
          response = null;
      }
    }
    return res(ctx.json(response));
  }
);

// Injury data for concussion
const concussionInjuryData = [
  {
    id: 4,
    occurrence_date: '2022-08-17T00:00:00+01:00',
    examination_date: '2022-08-17T00:00:00+01:00',
    issue_type: 'Injury',
    injury_status: {
      description: 'Causing unavailability (time-loss)',
      cause_unavailability: true,
      restore_availability: false,
    },
    resolved_date: null,
    full_pathology: 'Concussion  [Left]',
    created_by: 133800,
    created_at: '2022-08-17T19:46:07+01:00',
    closed: false,
    unavailability_duration: 0,
    athlete: {
      id: 2942,
      fullname: 'Conway Adam',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
      position: 'Scrum Half',
    },
    latest_note: null,
    issue: {
      id: 91132,
      athlete_id: 2942,
      osics: {
        osics_code: 'HNCX',
        pathology: {
          id: 420,
          name: 'Concussion ',
        },
        classification: {
          id: 20,
          name: 'Concussion/ Brain Injury',
        },
        body_area: {
          id: 7,
          name: 'Head',
        },
        icd: 'NA07.0',
        bamic: null,
      },
      side_id: 1,
      injury_type_id: 3,
      bamic_grade_id: null,
      bamic_site_id: null,
      coding: null,
    },
  },
];

export {
  handler,
  concussionBaselinesData,
  rosterConcussionBaselinesData,
  concussionIncidentFormsData,
  concussionInjuryData,
  rosterFormsData,
  legalFormsData,
};
