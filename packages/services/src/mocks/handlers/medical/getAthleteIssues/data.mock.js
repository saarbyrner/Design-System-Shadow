import data from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue/data.mock';

const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 1,
};

const openIssues = [
  {
    id: 1,
    occurrence_date: '2020-11-12T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Ankle Fracture (Left)',
    closed: false,
    injury_status: {
      description: 'Causing unavailability',
      cause_unavailability: true,
      restore_availability: false,
    },
    issue: {
      id: 1,
      osics: {
        osics_code: 'FFC',
        pathology: {
          id: 321,
          name: 'Ankle Fracture (Left)',
        },
        classification: {
          id: 23,
          name: 'Ankle Fracture (Left)',
        },
        body_area: {
          id: 17,
          name: 'Ankle',
        },
        icd: null,
      },
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
  {
    id: 2,
    occurrence_date: '2020-08-07T00:00:00+01:00',
    issue_type: 'Illness',
    full_pathology: 'Asthma and/or allergy',
    closed: false,
    injury_status: {
      description: 'Not affecting availability',
      cause_unavailability: false,
      restore_availability: true,
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
  {
    id: 3,
    occurrence_date: '2020-05-24T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Fracture tibia and fibula at ankle joint - [Right]',
    closed: false,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
  {
    id: 11,
    occurrence_date: '2020-05-24T00:00:00+01:00',
    closed: false,
    injury_status: null,
    resolved_date: null,
    issue_type: 'Injury',
    full_pathology: null,
    issue_occurrence_title: null,
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
  {
    id: 400,
    occurrence_date: '2020-05-24T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Acute Concussion [N/A]',
    closed: false,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    issue: {
      id: 4,
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
      },
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
];

const chronicIssues = [
  {
    id: 1,
    title: 'Unique Open Chronic Title',
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    occurrence_date: '2021-01-17T15:53:17+01:00',
  },
  {
    id: 2,
    title: 'Test Chronic',
    pathology:
      'Wrist Synovitis - Metabolic (eg: gout, rheumatoid arthritis, pseudogout)',
    full_pathology:
      'Wrist Synovitis - Metabolic (eg: gout, rheumatoid arthritis, pseudogout)',
    occurrence_date: '2024-08-07T15:53:17+01:00',
  },
  {
    id: 3,
    title: null,
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    occurrence_date: '2020-01-07T15:53:17+01:00',
  },
  {
    id: 4,
    title: 'Test title',
    pathology: 'Elbow Osteoarthritis',
    full_pathology: 'Elbow Osteoarthritis',
    occurrence_date: '2021-08-07T15:53:17+01:00',
  },
  {
    id: 5,
    title: 'Test title II',
    pathology: 'Elbow Osteoarthritis',
    full_pathology: 'Elbow Osteoarthritis',
    occurrence_date: '2022-08-07T15:53:17+01:00',
  },
  {
    id: 6,
    title: null,
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    occurrence_date: '2024-08-04T15:53:17+01:00',
  },
  {
    id: 7,
    title: 'Chronic Injury II',
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    occurrence_date: '2024-08-17T15:53:17+01:00',
  },
];

const closedChronicIssues = [
  {
    id: 1,
    title: 'Unique Closed Chronic Title',
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    resolved_date: '2020-11-11T00:00:00+01:00',
  },
  {
    id: 2,
    title: 'Test Chronic',
    pathology:
      'Wrist Synovitis - Metabolic (eg: gout, rheumatoid arthritis, pseudogout)',
    full_pathology:
      'Wrist Synovitis - Metabolic (eg: gout, rheumatoid arthritis, pseudogout)',
    resolved_date: '2020-11-12T00:00:00+01:00',
  },
  {
    id: 3,
    title: null,
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    resolved_date: '2020-11-13T00:00:00+01:00',
  },
  {
    id: 4,
    title: 'Test title',
    pathology: 'Elbow Osteoarthritis',
    full_pathology: 'Elbow Osteoarthritis',
    resolved_date: '2020-11-14T00:00:00+01:00',
  },
  {
    id: 5,
    title: 'Test title II',
    pathology: 'Elbow Osteoarthritis',
    full_pathology: 'Elbow Osteoarthritis',
    resolved_date: '2020-11-12T00:00:00+01:00',
  },
  {
    id: 6,
    title: null,
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    resolved_date: '2020-11-12T00:00:00+01:00',
  },
  {
    id: 7,
    title: 'Chronic Injury II',
    pathology: 'Clavicle A-C Arthritis',
    full_pathology: 'Clavicle A-C Arthritis',
    resolved_date: '2020-11-12T00:00:00+01:00',
  },
];

const openIssuesWithPlayerLeftClub = [
  {
    id: 1,
    occurrence_date: '2020-11-12T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Ankle Fracture (Left)',
    closed: false,
    injury_status: {
      description: 'Causing unavailability',
      cause_unavailability: true,
      restore_availability: false,
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
    player_left_club: true,
  },
  {
    id: 2,
    occurrence_date: '2020-08-07T00:00:00+01:00',
    issue_type: 'Illness',
    full_pathology: 'Asthma and/or allergy',
    closed: false,
    injury_status: {
      description: 'Not affecting availability',
      cause_unavailability: false,
      restore_availability: true,
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
    player_left_club: true,
  },
  {
    id: 3,
    occurrence_date: '2020-05-24T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Fracture tibia and fibula at ankle joint - [Right]',
    closed: false,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
    player_left_club: true,
  },
  {
    id: 11,
    occurrence_date: '2020-05-24T00:00:00+01:00',
    closed: false,
    injury_status: null,
    resolved_date: null,
    issue_type: 'Injury',
    full_pathology: null,
    issue_occurrence_title: null,
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
    player_left_club: true,
  },
  {
    id: 400,
    occurrence_date: '2020-05-24T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Acute Concussion [N/A]',
    closed: false,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    issue: {
      id: 4,
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
      },
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
    player_left_club: false,
  },
];

const edgeCaseIssues = [
  {
    id: 100001,
    occurrence_date: '2020-11-12T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology:
      'Open Injury with undefined closed and player_left_club params',
    injury_status: {
      description: 'TESTING EDGE CASE SHOULDNT BREAK UI',
      cause_unavailability: true,
      restore_availability: false,
    },
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
];
const enrichedOpenIssues = openIssues.map((openIssue, index) => ({
  ...openIssue,
  issue: { ...data.issue, id: index + 1 },
}));

const enrichedDetailedOpenIssues = openIssues.map((openIssue, index) => ({
  ...openIssue,
  issue:
    index === 4
      ? { ...data.issueWithConcussionICDCoding, id: index + 1 }
      : { ...data.issueWithICD, id: index + 1 },
}));

const closedIssues = [
  {
    id: 1,
    occurrence_date: '2020-10-28T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Fracture tibia and fibula at ankle joint - [Left]',
    closed: true,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    resolved_date: '2020-11-01T00:00:00+01:00',
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
  {
    id: 2,
    occurrence_date: '2020-09-14T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Ankle Fracture (Left)',
    closed: true,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    resolved_date: '2020-10-16T00:00:00+01:00',
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
  },
  {
    id: 3,
    occurrence_date: '2020-02-05T00:00:00+01:00',
    issue_type: 'Illness',
    full_pathology: 'Emotional stress',
    closed: true,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    resolved_date: '2020-03-11T00:00:00+01:00',
    archived: false,
    archive_reason: null,
    archived_by: null,
    archived_date: null,
    player_left_club: true,
    org_last_transfer_record: {
      transfer_type: 'Trade',
      joined_at: null,
      left_at: '2024-01-11T10:43:49-05:00',
      data_sharing_consent: true,
    },
  },
];

const archivedIssues = [
  {
    id: 1,
    occurrence_date: '2020-10-28T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Fracture tibia and fibula at ankle joint - [Left]',
    closed: true,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    resolved_date: '2020-11-01T00:00:00+01:00',
    archived: true,
    archive_reason: {
      id: 1,
      name: 'Incorrect athlete',
    },
    archived_by: {
      id: 1,
      fullname: 'John Doe',
    },
    archived_date: '2020-11-02T00:00:00+01:00',
  },
  {
    id: 2,
    occurrence_date: '2020-09-14T00:00:00+01:00',
    issue_type: 'Injury',
    full_pathology: 'Ankle Fracture (Left)',
    closed: true,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    resolved_date: '2020-10-16T00:00:00+01:00',
    archived: true,
    archive_reason: {
      id: 2,
      name: 'Note not relevant',
    },
    archived_by: {
      id: 1,
      fullname: 'John Doe',
    },
    archived_date: '2020-11-018T00:00:00+01:00',
  },
  {
    id: 3,
    occurrence_date: '2020-02-05T00:00:00+01:00',
    issue_type: 'Illness',
    full_pathology: 'Emotional stress',
    closed: true,
    injury_status: {
      description: 'Resolved',
      cause_unavailability: false,
      restore_availability: true,
    },
    resolved_date: '2020-03-11T00:00:00+01:00',
    archived: true,
    archive_reason: {
      id: 2,
      name: 'Note not relevant',
    },
    archived_by: {
      id: 1,
      fullname: 'John Doe',
    },
    archived_date: '2020-11-018T00:00:00+01:00',
  },
];

const enrichedClosedIssues = closedIssues.map((closedIssue, index) => ({
  ...closedIssue,
  issue: { ...data.issue, id: index + 1 },
}));

const enrichedDetailedClosedIssues = closedIssues.map((closedIssue, index) => ({
  ...closedIssue,
  issue: { ...data.issueWithICDCoding, id: index + 1 },
}));

export default {
  openIssues: {
    meta,
    issues: openIssues,
  },
  closedIssues: {
    meta,
    issues: closedIssues,
  },
  archivedIssues: {
    meta,
    issues: archivedIssues,
  },
  allIssues: {
    meta,
    issues: [...openIssues, ...closedIssues],
  },
  allIssuesWithPlayerLeftClub: {
    meta,
    issues: [
      ...openIssues,
      ...openIssuesWithPlayerLeftClub,
      ...closedIssues,
      ...edgeCaseIssues,
    ],
  },
  groupedIssues: {
    open_issues: openIssues,
    closed_issues: closedIssues,
    chronic_issues: chronicIssues,
  },
  groupedEnrichedIssues: {
    open_issues: enrichedOpenIssues,
    closed_issues: enrichedClosedIssues,
    chronic_issues: chronicIssues,
  },
  groupedDetailedEnrichedIssues: {
    open_issues: enrichedDetailedOpenIssues,
    closed_issues: enrichedDetailedClosedIssues,
  },
  chronicIssues,
  closedChronicIssues,
  groupedChronicIssues: {
    active_chronic_issues: chronicIssues,
    resolved_chronic_issues: closedChronicIssues,
  },
  closedIssuesWithUnresolvedIssues: [
    {
      ...closedIssues[0],
      resolved_date: null,
      player_left_club: null,
    },
    ...closedIssues.slice(1, closedIssues.length),
  ],
};
