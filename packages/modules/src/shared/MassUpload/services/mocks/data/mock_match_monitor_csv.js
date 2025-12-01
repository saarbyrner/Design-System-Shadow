// @flow
export const validData = [
  {
    FirstName: 'John',
    LastName: 'DOE',
    Email: 'john.doe@mail.com',
    DOB: '2023/12/31',
    SquadName: 'U13',
    Language: 'en',
    Type: 'match_monitor',
  },
];

export const invalidData = [
  {
    FirstName: '',
    LastName: '',
    Email: '',
    DOB: '1-3-23',
    SquadName: 'U47',
  },
];

export const data = {
  validData,
  invalidData,
};
