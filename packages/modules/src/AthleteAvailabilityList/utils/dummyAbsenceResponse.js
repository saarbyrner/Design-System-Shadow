/* eslint-disable flowtype/require-valid-file-annotation */
const absenceResponse = () => [
  {
    author: {
      firstname: 'Rory',
      fullname: 'Rory Thornburgh',
      id: 9,
      lastname: 'Thornburgh',
    },
    duration: 15,
    from: '2019-07-26T00:00:00Z',
    id: 3807,
    reason: {
      id: 26,
      reason: 'International Duty',
      order: 1,
    },
    to: '2019-08-09T00:00:00Z',
  },
  {
    author: {
      firstname: 'Rory',
      fullname: 'Rory Thornburgh',
      id: 9,
      lastname: 'Thornburgh',
    },
    duration: 29,
    from: '2019-07-03T00:00:00Z',
    id: 3809,
    reason: {
      id: 27,
      reason: 'Suspension (Ban)',
      order: 2,
    },
    to: null,
  },
];

export default absenceResponse;
