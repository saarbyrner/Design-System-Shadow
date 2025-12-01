// @flow
import type { FilesFilters } from '@kitman/modules/src/Medical/shared/types';
import type { FileRequestResponse } from '@kitman/modules/src/Medical/shared/types/medical';
import { axios } from '@kitman/common/src/utils/services';

const getMedicalDocuments = async (
  filters: FilesFilters,
  nextPage: ?number
): Promise<FileRequestResponse> => {
  const { data } = await axios.post('/medical/document_v2s/search', {
    filters,
    page: nextPage,
  });

  return data;
};

export default getMedicalDocuments;
