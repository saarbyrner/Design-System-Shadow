export const mockArchiveReasonOptions = [
  { label: 'Duplicate', value: 1 },
  { label: 'Incorrect athlete', value: 2 },
  { label: 'Note not relevant', value: 3 },
];

export const mockIssue = {
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
};

export default mockArchiveReasonOptions;
