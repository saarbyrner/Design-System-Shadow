// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  type GenericDocument,
  type UpdateDocumentRequestBody,
} from '@kitman/services/src/services/documents/generic/redux/services/types';

export const GENERIC_DOCUMENTS_UPDATE_ENDPOINT = '/generic_documents';

export const buildGenericDocumentsUpdateEndpoint = (id: number) => {
  return `${GENERIC_DOCUMENTS_UPDATE_ENDPOINT}/${id}`;
};

export const updateDocument = async ({
  id,
  ...restBody
}: UpdateDocumentRequestBody): Promise<{ document: GenericDocument }> => {
  try {
    const url = buildGenericDocumentsUpdateEndpoint(id);
    const { data } = await axios.put(url, restBody);

    return data;
  } catch (err) {
    throw new Error(err);
  }
};
