// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type Attachment } from '@kitman/common/src/utils/fileHelper';

const confirmFileUpload = async (
  fileId: number,
  urlPrefix?: string
): Promise<Attachment> => {
  const { data } = await axios.patch(
    urlPrefix
      ? `${urlPrefix}/attachments/${fileId}/confirm`
      : `/attachments/${fileId}/confirm`
  );

  return data;
};

export default confirmFileUpload;
