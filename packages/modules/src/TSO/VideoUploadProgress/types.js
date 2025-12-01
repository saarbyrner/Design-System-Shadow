// @flow
type UploadItem = {
  id: string,
  percentage: number,
  fileName: string,
};
export type Uploads = Array<UploadItem>;

export type CustomMessageEvent = {
  ...MessageEvent,
  data: {
    type: string,
    message: {
      payload: {
        state: string,
        result: {
          uploadedFileSize: number,
          fileSize: number,
          fileName: string,
        },
        tracking_id: string,
        file: {
          lastModified: number,
          lastModifiedDate: Date,
          name: string,
          size: number,
          type: string,
          webkitRelativePath: string,
        },
        message: string,
      },
      type: string,
    },
  },
};
