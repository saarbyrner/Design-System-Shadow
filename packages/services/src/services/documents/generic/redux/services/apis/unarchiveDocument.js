// @flow
import { axios } from '@kitman/common/src/utils/services';

export const unarchiveDocument = async (documentId: number): Promise<{}> => {
  try {
    const { data } = await axios.post(
      `/generic_documents/${documentId}/unarchive`
    );

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw new Error(err);
  }
};

export default unarchiveDocument;
