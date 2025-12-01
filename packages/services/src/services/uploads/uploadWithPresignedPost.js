// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  FileStatus,
  PresignedPost,
} from '@kitman/common/src/utils/fileHelper';

export type ProgressCallbackData = {
  status: FileStatus,
  attachmentId: number,
  fileId: number | string,
  progressPercentage?: number,
};

export type PresignedPostParams = {
  file: File,
  attachmentId: number,
  fileId: number | string,
  presignedPost: PresignedPost,
  progressCallback?: (data: ProgressCallbackData) => void,
};

const uploadWithPresignedPost = async ({
  attachmentId,
  fileId,
  ...params
}: PresignedPostParams): Promise<{}> => {
  const formData = new FormData();

  Object.entries(params.presignedPost.fields).forEach(([key, value]) => {
    // $FlowIgnore[incompatible-call]
    formData.append(key, value);
  });

  formData.append('file', params.file);

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
    ...(params.progressCallback
      ? {
          onUploadProgress: (progressEvent) => {
            params.progressCallback?.({
              status: 'inprogress',
              attachmentId,
              fileId,
              progressPercentage:
                progressEvent.total && progressEvent.total > 0
                  ? Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )
                  : 0,
            });
          },
        }
      : {}),
  };

  try {
    const { data } = await axios.post(
      params.presignedPost.url,
      formData,
      config
    );
    params.progressCallback?.({
      status: 'uploaded',
      attachmentId,
      progressPercentage: 100,
      fileId,
    });
    return data;
  } catch (err) {
    params.progressCallback?.({
      status: 'errored',
      attachmentId,
      fileId,
    });
    throw err;
  }
};

export default uploadWithPresignedPost;
