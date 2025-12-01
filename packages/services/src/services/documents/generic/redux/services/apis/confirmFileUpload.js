// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type Attachment } from '@kitman/services/src/services/documents/generic/redux/services/types';

export const confirmFileUpload = async (
  fileId: number,
  urlPrefix?: '/medical/scanning' // Other allowed values can be added with union type
): Promise<Attachment> => {
  try {
    const { data } = await axios.patch(
      urlPrefix
        ? `${urlPrefix}/attachments/${fileId}/confirm`
        : `/attachments/${fileId}/confirm`
    );

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

export default confirmFileUpload;
