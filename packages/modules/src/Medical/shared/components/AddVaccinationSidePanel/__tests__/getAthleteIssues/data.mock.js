// @flow
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
    },
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

    issue: {
      id: 2,
    },
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
    issue: {
      id: 3,
    },
  },
];

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
    issue: {
      id: 1,
    },
    resolved_date: '2020-11-01T00:00:00+01:00',
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
    issue: {
      id: 2,
    },
    resolved_date: '2020-10-16T00:00:00+01:00',
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
    issue: {
      id: 3,
    },
    resolved_date: '2020-03-11T00:00:00+01:00',
  },
];

const chronicIssues = [
  {
    id: 10,
    full_pathology: 'AC joint arthritis [Right]',
    title: 'Test Chronic 1',
    reported_date: '2023-02-18T00:00:00+01:00',
  },
  {
    id: 11,
    full_pathology: 'AC Joint instability/ recurrent sprains []',
    title: 'Test Chronic 2',
    reported_date: '2023-02-18T00:00:00+01:00',
  },
  {
    id: 12,
    full_pathology: '1st CMC joint instability [Right]',
    title: null,
    reported_date: '2023-02-18T00:00:00+01:00',
  },
];

export default {
  openIssues: {
    meta,
    issues: openIssues,
  },
  closedIssues: {
    meta,
    issues: closedIssues,
  },
  allIssues: {
    meta,
    issues: [...openIssues, ...closedIssues],
  },
  groupedIssues: {
    open_issues: openIssues,
    closed_issues: closedIssues,
    chronic_issues: chronicIssues,
  },
};
