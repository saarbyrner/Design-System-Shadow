// @flow
export const validData = [
  {
    FirstName: 'Jo',
    LastName: 'Blog',
    Email: 'j_b@mail.com',
    DOB: '2023/12/31',
    Language: 'en',
    Type: 'Scout',
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
