// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  type GenericDocument,
  type SearchRequestBody,
} from '@kitman/services/src/services/documents/generic/redux/services/types';

export const GENERIC_DOCUMENTS_SEARCH_ENDPOINT = '/generic_documents/search';

const searchDocuments = async (
  requestBody: SearchRequestBody
): Promise<{ documents: Array<GenericDocument> }> => {
  try {
    const { data } = await axios.post(
      GENERIC_DOCUMENTS_SEARCH_ENDPOINT,
      requestBody
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default searchDocuments;
