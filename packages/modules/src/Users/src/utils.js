// @flow
import type { User, Users } from './types';

export const extractFullName = (user: User): string =>
  `${user.firstname} ${user.lastname}`;

export const updateUserById = (users: Users, usernameToFind: string) => {
  const userIndex = users.findIndex((item) => item.username === usernameToFind);

  if (userIndex !== -1) {
    // eslint-disable-next-line no-param-reassign
    users[userIndex].access_locked = false;
  }
  return users;
};
