// @flow
import { axios } from '@kitman/common/src/utils/services';

export const uploadFileToS3 = async (
  file: File,
  fileId: number,
  presignedPost: Object
): Promise<{}> => {
  const formData = new FormData();

  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    // $FlowFixMe
    formData.append(key, value);
  });

  formData.append('file', file);

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  try {
    const { data } = await axios.post(presignedPost.url, formData, config);
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
};

export default uploadFileToS3;
