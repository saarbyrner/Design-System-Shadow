// @flow
import { axios } from '@kitman/common/src/utils/services';

export type SourceAttachment = {
  id: number,
  url: string,
  filename: string,
  filetype: string,
  filesize: ?number,
  name: string,
  confirmed: boolean,
  download_url: string,
};

const putFileToPresignedUrl = async (
  file: File,
  presignedUrl: string,
  headers: ?{ [string]: string }
): Promise<void> => {
  await axios.put(presignedUrl, file, {
    headers: headers || {
      'Content-Type': 'application/octet-stream',
    },
  });
};

export default putFileToPresignedUrl;
