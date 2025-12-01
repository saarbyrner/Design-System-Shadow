// @flow

export const generateUniqueNumberId = () =>
  Math.floor(new Date().valueOf() * Math.random());
