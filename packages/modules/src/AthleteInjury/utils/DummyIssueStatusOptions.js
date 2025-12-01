/* eslint-disable flowtype/require-valid-file-annotation */
const DummyIssueStatusOptions = [
  {
    description: 'Not fit for training or match',
    id: 'option_1234',
    cause_unavailability: true,
    restore_availability: false,
    order: 1,
  },
  {
    description: 'Fit for rehab / non-team training',
    id: 'option_1235',
    cause_unavailability: false,
    restore_availability: false,
    order: 2,
  },
  {
    description: 'Fit for modified team training, but not match selection',
    id: 'option_1236',
    cause_unavailability: false,
    restore_availability: true,
    order: 3,
  },
  {
    description:
      'Fit for match selection, no training modifications. Recovered.',
    id: 'option_1237',
    cause_unavailability: false,
    restore_availability: true,
    order: 4,
  },
];

export default DummyIssueStatusOptions;
