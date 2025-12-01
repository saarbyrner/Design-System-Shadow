// @flow
import { useState } from 'react';
import { getMedicalDocuments } from '@kitman/services';
import type {
  MedicalFile,
  FileRequestResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { FilesFilters } from '../types';

const useMedicalDocuments = () => {
  const [documents, setDocuments] = useState<Array<MedicalFile>>([]);
  const [nextPage, setNextPage] = useState(null);

  const fetchDocuments = async (filters: FilesFilters, resetList: boolean) => {
    const medicalDocuments: FileRequestResponse = await getMedicalDocuments(
      filters,
      resetList ? null : nextPage
    );

    setDocuments((prevDocuments) =>
      resetList
        ? medicalDocuments.documents
        : [...prevDocuments, ...medicalDocuments.documents]
    );

    setNextPage(medicalDocuments.meta?.next_page);
  };

  const resetDocuments = () => setDocuments([]);
  const resetNextPage = () => setNextPage(null);

  return {
    documents,
    fetchDocuments,
    resetDocuments,
    resetNextPage,
    nextPage,
  };
};

export default useMedicalDocuments;
