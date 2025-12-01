// @flow
import { useState } from 'react';
import { getModificationNotes, expireModificationNote } from '@kitman/services';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { ModificationFilters } from '../types';

const useModificationNotes = ({
  withPagination,
}: {
  withPagination: boolean,
}) => {
  const [modificationNotes, setModificationNotes] = useState<
    Array<MedicalNote>
  >([]);
  const [nextPage, setNextPage] = useState(null);
  const [
    lastModificationNoteUpdatedByStatusId,
    setLastModificationNoteUpdatedByStatusId,
  ] = useState<number | null>(null);

  const fetchModificationNotes = (
    filters: ModificationFilters,
    resetList: boolean
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) =>
      getModificationNotes(filters, resetList ? null : nextPage).then(
        (data) => {
          setModificationNotes((prevNotes) =>
            resetList
              ? data.medical_notes
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

  const expireModification = (modificationNoteId: number): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      setLastModificationNoteUpdatedByStatusId(modificationNoteId);
      expireModificationNote(modificationNoteId).then(
        (updatedNote) => {
          setModificationNotes((prevNotes) =>
            prevNotes.map((prevNote) => {
              if (prevNote.id === updatedNote.id) {
                return updatedNote;
              }
              return prevNote;
            })
          );
          setLastModificationNoteUpdatedByStatusId(null);
          resolve();
        },
        () => reject()
      );
    });

  const resetModificationNotes = () => setModificationNotes([]);
  const resetNextPage = () => setNextPage(null);

  return {
    modificationNotes,
    fetchModificationNotes,
    expireModificationNote: expireModification,
    lastModificationNoteUpdatedByStatusId,
    resetModificationNotes,
    resetNextPage,
    nextPage,
  };
};

export default useModificationNotes;
