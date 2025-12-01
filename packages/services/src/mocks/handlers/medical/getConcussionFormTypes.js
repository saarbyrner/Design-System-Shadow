import { rest } from 'msw';

// category: concussion, key: baseline
const concussionBaselineForms = [
  {
    id: 68,
    category: 'concussion',
    group: 'scat5',
    key: 'baseline',
    name: 'Baseline',
    fullname: 'Concussion Assessment - Baseline DK',
    form_type: 'baseline',
    config: null,
    enabled: true,
    created_at: '2022-08-31T11:58:25Z',
    updated_at: '2022-08-31T11:58:25Z',
  },
  {
    id: 71,
    category: 'concussion',
    group: 'king_devick',
    key: 'baseline',
    name: 'Baseline',
    fullname: 'King Devick - Baseline',
    form_type: 'baseline',
    config: null,
    enabled: true,
    created_at: '2022-08-31T11:58:25Z',
    updated_at: '2022-08-31T11:58:25Z',
  },
  {
    id: 75,
    category: 'concussion',
    group: 'npc',
    key: 'baseline',
    name: 'Baseline',
    fullname: 'Near Point of Convergence - Baseline',
    form_type: 'baseline',
    config: null,
    enabled: true,
    created_at: '2022-08-31T11:58:25Z',
    updated_at: '2022-08-31T11:58:25Z',
  },
];

// group: npc
const groupNPCConcussionForms = [
  {
    id: 21,
    category: 'concussion',
    group: 'npc',
    key: 'baseline',
    name: 'Baseline',
    enabled: true,
    created_at: '2022-07-07T14:55:34Z',
    updated_at: '2022-07-07T14:55:34Z',
  },
  {
    id: 22,
    category: 'concussion',
    group: 'npc',
    key: 'initial_assessment',
    name: 'Initial assessment',
    enabled: true,
    created_at: '2022-07-07T14:55:34Z',
    updated_at: '2022-07-07T14:55:34Z',
  },
  {
    id: 23,
    category: 'concussion',
    group: 'npc',
    key: 'start_of_rtp',
    name: 'Start of RTP',
    enabled: true,
    created_at: '2022-07-07T14:55:34Z',
    updated_at: '2022-07-07T14:55:34Z',
  },
  {
    id: 24,
    category: 'concussion',
    group: 'npc',
    key: 'rtp_recurring',
    name: 'RTP recurring',
    enabled: true,
    created_at: '2022-07-07T14:55:34Z',
    updated_at: '2022-07-07T14:55:34Z',
  },
];

// group: king_devick
const groupKingDevickConcussionForms = [
  {
    id: 5,
    category: 'concussion',
    group: 'king_devick',
    key: 'baseline',
    name: 'Baseline',
    fullname: 'King Devick - Baseline',
    form_type: 'baseline',
    config: '{}',
    enabled: true,
    created_at: '2022-05-10T15:50:08Z',
    updated_at: '2022-08-29T17:45:52Z',
  },
  {
    id: 6,
    category: 'concussion',
    group: 'king_devick',
    key: 'initial_assessment',
    name: 'Initial assessment',
    fullname: 'King Devick - Initial assessment',
    form_type: 'initial_assessment',
    config: '{}',
    enabled: true,
    created_at: '2022-05-10T15:50:08Z',
    updated_at: '2022-08-29T17:45:52Z',
  },
  {
    id: 7,
    category: 'concussion',
    group: 'king_devick',
    key: 'start_of_rtp',
    name: 'Start of RTP',
    fullname: 'King Devick - Start of RTP',
    form_type: 'start_of_rtp',
    config: '{}',
    enabled: true,
    created_at: '2022-05-10T15:50:08Z',
    updated_at: '2022-08-29T17:45:52Z',
  },
  {
    id: 8,
    category: 'concussion',
    group: 'king_devick',
    key: 'rtp_recurring',
    name: 'RTP recurring',
    fullname: 'King Devick - RTP recurring',
    form_type: 'rtp_recurring',
    config: '{}',
    enabled: true,
    created_at: '2022-05-10T15:50:08Z',
    updated_at: '2022-08-29T17:45:52Z',
  },
];

// group: pac_12 category: medical
const pac12Forms = [
  {
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
  {
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
  {
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
  {
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
];

// group: isu category: legal
const ISUForms = [
  [
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
  ],
];

// group: nba category: medical
const NBAForms = [
  [
    {
      id: 100,
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
  ],
];

// group: pl category: medical
const PLForms = [
  [
    {
      id: 100,
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
  ],
];

const handler = rest.get('/ui/concussion/forms', (req, res, ctx) => {
  let response;

  const query = req.url.searchParams;
  const group = query.get('group');
  const category = query.get('category');
  const key = query.get('key');

  if (key === 'baseline' && category === 'concussion') {
    response = concussionBaselineForms;
  } else {
    switch (group) {
      case 'isu': {
        response = category === 'legal' ? ISUForms : null;
        break;
      }
      case 'pac_12': {
        response = category === 'medical' ? pac12Forms : null;
        break;
      }
      case 'npc': {
        response = groupNPCConcussionForms;
        break;
      }
      case 'king_devick': {
        response = groupKingDevickConcussionForms;
        break;
      }
      case 'nba': {
        response = category === 'medical' ? NBAForms : null;
        break;
      }
      case 'pl': {
        response = category === 'medical' ? PLForms : null;
        break;
      }

      default:
        response = null;
    }
  }

  return res(ctx.json(response));
});

export {
  handler,
  concussionBaselineForms,
  groupNPCConcussionForms,
  groupKingDevickConcussionForms,
  pac12Forms,
  ISUForms,
  NBAForms,
  PLForms,
};
