import { handler as searchOfficialsHandler } from './searchOfficials';
import { handler as updateOfficialHandler } from './updateOfficial';
import { handler as createOfficialHandler } from './createOfficial';

export default [
  searchOfficialsHandler,
  updateOfficialHandler,
  createOfficialHandler,
];
