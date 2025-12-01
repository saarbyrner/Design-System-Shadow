// @flow
import { useState } from 'react';
import { getMedicalNotes, expireNote } from '@kitman/services';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { NotesFilters } from '../types';

const useMedicalNotes = ({ withPagination }: { withPagination: boolean }) => {
  const [medicalNotes, setMedicalNotes] = useState<Array<MedicalNote>>([]);
  const [nextPage, setNextPage] = useState(null);
  const [
    lastMedicalNoteUpdatedByStatusId,
    setLastMedicalNoteUpdatedByStatusId,
  ] = useState<number | null>(null);

  const fetchMedicalNotes = (
    filters: NotesFilters,
    resetList: boolean
  ): Promise<any> => {
    return new Promise<void>((resolve: (value: any) => void, reject) =>
      getMedicalNotes(filters, resetList ? null : nextPage).then(
        (data) => {
          setMedicalNotes((prevNotes) =>
            resetList
              ? // $FlowFixMe
                data.medical_notes
              : [...prevNotes, ...data.medical_notes]
          );
          setNextPage(data.meta.next_page);
          if ((!data.meta.next_page && withPagination) || !withPagination) {
            resolve();
          }
        },
        () => reject()
      )
    );
  };

  const expireMedicalNote = (medicalNoteId: number): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      setLastMedicalNoteUpdatedByStatusId(medicalNoteId);
      expireNote(medicalNoteId).then(
        (updatedNote) => {
          setMedicalNotes((prevNotes) =>
            prevNotes.map((prevNote) => {
              if (prevNote.id === updatedNote.id) {
                return updatedNote;
              }
              return prevNote;
            })
          );
          setLastMedicalNoteUpdatedByStatusId(null);
          resolve();
        },
        () => reject()
      );
    });

  const resetMedicalNotes = () => setMedicalNotes([]);
  const resetNextPage = () => setNextPage(null);

  return {
    medicalNotes,
    fetchMedicalNotes,
    expireMedicalNote,
    lastMedicalNoteUpdatedByStatusId,
    resetMedicalNotes,
    resetNextPage,
    nextPage,
  };
};

export default useMedicalNotes;
