// @flow
import { axios } from '@kitman/common/src/utils/services';

export const archiveDocument = async (documentId: number): Promise<{}> => {
  try {
    const { data } = await axios.post(
      `/generic_documents/${documentId}/archive`
    );

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw new Error(err);
  }
};

export default archiveDocument;
