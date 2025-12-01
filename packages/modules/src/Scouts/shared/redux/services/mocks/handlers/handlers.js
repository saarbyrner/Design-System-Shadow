import { handler as searchAdditionalUserHandler } from './searchScouts';
import { handler as updateAdditionalUserHandler } from './updateScout';
import { handler as createAdditionalUserHandler } from './createScout';
import { handler as fetchAdditionalUserHandler } from './fetchScout';

export default [
  searchAdditionalUserHandler,
  updateAdditionalUserHandler,
  createAdditionalUserHandler,
  fetchAdditionalUserHandler,
];
