import { rest } from 'msw';
import data, {
  rehabMedicalNote,
  telephoneNote,
  diagnosticNoteData,
} from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes/data.mock';

const handler = rest.post('/medical/notes/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data, diagnosticNoteData, rehabMedicalNote, telephoneNote };
