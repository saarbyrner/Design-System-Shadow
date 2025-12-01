// @flow
const emailRegexW3C = new RegExp(
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]){1}(?:\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
);

const isEmail = (email: string) => {
  return emailRegexW3C.test(email);
};

export const isEmailValid = (email: ?string) => {
  return !!(email && isEmail(email));
};

export default isEmailValid;
