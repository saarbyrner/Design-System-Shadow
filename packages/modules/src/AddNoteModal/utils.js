// @flow
import type { NoteData } from './types';

const prepareNoteData = (noteData: NoteData) => {
  const preparedNoteData = Object.assign({}, noteData);

  if (preparedNoteData.injury_ids && preparedNoteData.injury_ids.length === 0) {
    delete preparedNoteData.injury_ids;
  }

  if (
    preparedNoteData.illness_ids &&
    preparedNoteData.illness_ids.length === 0
  ) {
    delete preparedNoteData.illness_ids;
  }

  preparedNoteData.restricted_to_psych = preparedNoteData.psych_only;
  delete preparedNoteData.psych_only;

  return preparedNoteData;
};

export default prepareNoteData;
