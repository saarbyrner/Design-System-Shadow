// @flow

export type FileStatus =
  | 'pending'
  | 'inprogress'
  | 'uploaded'
  | 'confirmed'
  | 'errored'
  | 'queued';

export type UpdateFileStatus = (
  fileId: string | number,
  status: FileStatus,
  progressPercentage?: number
) => void;

export type PresignedPost = {
  fields: {
    'Content-Type'?: string,
    acl?: string,
    key?: string,
    policy?: string,
    success_action_status?: string,
    // Bellow are S3 specific fields
    'x-amz-algorithm'?: string,
    'x-amz-credential'?: string,
    'x-amz-date'?: string,
    'x-amz-signature'?: string,
    // Non exact type so other keys allowed
    ...
  },
  url: string,
};

export type AttachmentCategory = {
  id: number,
  name: string,
};

type User = {
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
};

export type Attachment = {
  id: number,
  url: string,
  name: string,
  filename: string,
  filetype: string,
  filesize: number,
  audio_file: boolean,
  confirmed: boolean,
  presigned_post: ?PresignedPost,
  download_url: string,
  created_by: User,
  medical_attachment_categories?: Array<AttachmentCategory>,
  archived_at?: ?string,
  archived_reason?: ?{
    id: number,
    name: string,
  },
  attachment_date?: string, // Date
  created?: string, // Date
  versions?: Array<{
    changeset: {
      name: [string, string], // [‘old attachment title, ‘attachment title’]
      medical_attachment_categories: [
        Array<AttachmentCategory>,
        Array<AttachmentCategory>
      ], // [ [categories removed], [categories added] ]
    },
    updated_at: string, // Date
    updated_by?: ?User,
  }>,
};

export type AttachedFile = {|
  filename: string,
  fileType: string,
  fileSize: number,
  fileTitle?: string,
  file: File,
  id: number | string,
  filenameWithoutExtension: string,
  presigned_post?: PresignedPost,
|};

export type AttachedMedicalFile = {|
  ...AttachedFile,
  medical_attachment_category_ids: Array<number>,
|};

export type AttachedTransformedFile = {
  original_filename: string,
  filetype: string,
  filesize: number,
  name?: string,
  medical_attachment_category_ids?: Array<number>,
};

export type AttachedEventFile = {
  event_attachment_category_ids: Array<number>,
  ...AttachedFile,
};

export type AttachedTransformedEventFile = {
  event_attachment_category_ids: Array<number>,
  attachment: AttachedTransformedFile,
};

export type FilePondWarning = { type: string, code: number, body: string };

export type FilePondError = { main: string, sub: string };

export type UploadingState = 'IDLE' | 'PENDING' | 'FAILURE' | 'SUCCESS';

export type AttachmentItem = {
  state: UploadingState,
  file: AttachedFile,
  message: ?string,
};

export const MAX_FILE_SIZE = '3mb';

export const MAX_FILES = 1;

export const transformEventFilesForUpload = (
  attachedFiles: AttachedEventFile[]
): AttachedTransformedEventFile[] =>
  attachedFiles.map((fileInformation) => {
    return {
      event_attachment_category_ids:
        fileInformation.event_attachment_category_ids,
      attachment: {
        original_filename: fileInformation.filename,
        filetype: fileInformation.fileType,
        filesize: fileInformation.fileSize,
        name: fileInformation.fileTitle,
      },
    };
  });

export const transformFilesForUpload = (
  attachedFiles: Array<AttachedFile> | Array<AttachedMedicalFile>
): Array<AttachedTransformedFile> =>
  attachedFiles.map((file) => {
    const transformed = {
      original_filename: file.filename,
      filetype: file.fileType,
      filesize: file.fileSize,
      name: file.fileTitle,
    };
    if (file.medical_attachment_category_ids) {
      return {
        ...transformed,
        medical_attachment_category_ids: [
          ...file.medical_attachment_category_ids,
        ],
      };
    }
    return transformed;
  });

export const convertBlobToFile = (
  files: Object[],
  preExistingFormattedFiles?: AttachedFile[]
): AttachedFile[] => {
  const getFileTitle = (
    currentFile: Object,
    attachedFiles?: AttachedFile[]
  ) => {
    const foundFile = attachedFiles?.find((file) => file.id === currentFile.id);
    if (foundFile) return foundFile.fileTitle;
    return currentFile.filenameWithoutExtension;
  };

  return files.map((currFile) => {
    const newFile = new File([currFile.file], currFile.file.name, {
      type: currFile.file.type,
    });
    return {
      file: newFile,
      filename: newFile.name,
      filenameWithoutExtension: currFile.filenameWithoutExtension,
      ...((window.featureFlags['files-titles'] ||
        window.featureFlags['event-attachments']) && {
        fileTitle: getFileTitle(currFile, preExistingFormattedFiles),
      }),
      fileSize: currFile.source.size,
      fileType: newFile.type,
      id: currFile.id,
    };
  });
};

export const checkInvalidFileTitles = (
  attachedFiles: Array<AttachedFile> | Array<AttachedMedicalFile>
) =>
  window.featureFlags['files-titles'] &&
  attachedFiles.some((file) => file.fileTitle === '');

export const convertFileToUrl = (attachedFiles: AttachedFile[]): Object[] =>
  attachedFiles.map((currentFile) => ({
    ...currentFile,
    file: URL.createObjectURL(currentFile.file),
  }));

export const convertUrlToFile = async (
  url: string,
  name: string,
  type: string
) => {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.blob();
    return new File([data], name, {
      type,
    });
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

export const convertUrlToAttachedFile = async (
  url: string,
  fileName: string,
  type: string,
  fileId: number
): Promise<AttachedFile> => {
  const file = await convertUrlToFile(url, fileName, type);

  return {
    file,
    fileSize: file.size,
    fileType: file.type,
    filename: file.name,
    filenameWithoutExtension: file.name,
    id: fileId,
  };
};
