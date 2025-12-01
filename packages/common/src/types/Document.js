// @flow

export type Document = {
  id: number,
  attachment: {
    id: number,
    url: string,
    filename: string,
    filetype: string,
    filesize: number,
    audio_file: boolean,
    confirmed: boolean,
    presigned_post: any,
    download_url: string,
    created_by?: {
      id: number,
      firstname: string,
      lastname: string,
      fullname: string,
    },
  },
  updated_at: string,
};

export type DocumentResponse = {
  document: Document,
};

export type DocumentsResponse = {
  documents: Document[],
  permitted_extensions: string[],
};
