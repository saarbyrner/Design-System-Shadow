// @flow
export const validData = [
  {
    FirstName: 'John',
    LastName: 'DOE',
    Email: 'john.doe@mail.com',
    DOB: '2023/12/31',
    Language: 'en',
  },
];

export const invalidData = [
  {
    FirstName: '',
    LastName: '',
    Email: '',
    DOB: '1-3-23',
    Language: 'abc',
  },
];

export const data = {
  validData,
  invalidData,
};
