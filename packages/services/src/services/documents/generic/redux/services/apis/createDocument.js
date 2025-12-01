// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  type GenericDocument,
  type CreateDocumentRequestBody,
} from '@kitman/services/src/services/documents/generic/redux/services/types';

export const GENERIC_DOCUMENTS_CREATE_ENDPOINT = '/generic_documents';

export const createDocument = async (
  requestBody: CreateDocumentRequestBody
): Promise<{ document: GenericDocument }> => {
  try {
    const { data } = await axios.post(
      GENERIC_DOCUMENTS_CREATE_ENDPOINT,
      requestBody
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};
