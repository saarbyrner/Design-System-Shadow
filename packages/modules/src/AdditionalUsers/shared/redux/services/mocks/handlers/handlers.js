import { handler as searchAdditionalUsersHandler } from './searchAdditionalUsers';
import { handler as createAdditionalUsersHandler } from './createAdditionalUser';
import { handler as updateAdditionalUser } from './updateAdditionalUser';

export default [
  searchAdditionalUsersHandler,
  createAdditionalUsersHandler,
  updateAdditionalUser,
];
