// @flow
import uploadWithPresignedPost from '@kitman/services/src/services/uploads/uploadWithPresignedPost';
import confirmFileUpload from '@kitman/services/src/services/uploads/confirmFileUpload';

// Types
import type {
  ProgressCallbackData,
  PresignedPostParams,
} from '@kitman/services/src/services/uploads/uploadWithPresignedPost';
import type {
  Attachment,
  UpdateFileStatus,
  AttachedFile,
  AttachedMedicalFile,
} from '@kitman/common/src/utils/fileHelper';

type FilesArray = Array<AttachedFile> | Array<AttachedMedicalFile>;
type SettledDetails =
  | {|
      +status: 'fulfilled',
      +value: Attachment,
    |}
  | {|
      +status: 'rejected',
      +reason: any,
    |};

export type ReturnType = {
  uploadAndConfirmAttachments: (
    attachments: Array<Attachment>,
    filesToUpload: FilesArray,
    updateFileStatus: UpdateFileStatus
  ) => Promise<Array<SettledDetails>>,
};

const useManageUploads = (): ReturnType => {
  const uploadAndConfirmAttachment = (
    presignedPostParams: PresignedPostParams
  ) => {
    return new Promise((resolve, reject) => {
      uploadWithPresignedPost(presignedPostParams).then(
        () => {
          confirmFileUpload(presignedPostParams.attachmentId).then(
            (confirmFileUploadResponse) => {
              presignedPostParams.progressCallback?.({
                status: 'confirmed',
                attachmentId: presignedPostParams.attachmentId,
                progressPercentage: 100,
                fileId: presignedPostParams.fileId,
              });
              resolve(confirmFileUploadResponse);
            },
            (err) => {
              // 'CONFIRM ERROR'
              presignedPostParams.progressCallback?.({
                status: 'errored',
                attachmentId: presignedPostParams.attachmentId,
                fileId: presignedPostParams.fileId,
              });
              reject(err);
            }
          );
        },
        (err) => {
          // 'UPLOAD ERROR'
          presignedPostParams.progressCallback?.({
            status: 'errored',
            attachmentId: presignedPostParams.attachmentId,
            fileId: presignedPostParams.fileId,
          });
          reject(err);
        }
      );
    });
  };

  const uploadAndConfirmAttachments = (
    attachments: Array<Attachment>,
    filesToUpload: FilesArray,
    updateFileStatus?: UpdateFileStatus
  ) => {
    const filteredAttachments = attachments.filter(
      (attachment) => attachment.presigned_post && !attachment.confirmed
    );
    return Promise.allSettled(
      filesToUpload.map((fileToUpload) => {
        const attachmentIndex = filteredAttachments.findIndex(
          (attachment) => attachment.filename === fileToUpload.filename
        );
        if (attachmentIndex === -1) {
          return Promise.reject();
        }
        const attachment = filteredAttachments.splice(attachmentIndex, 1)[0];
        if (attachment?.presigned_post) {
          return uploadAndConfirmAttachment({
            file: fileToUpload.file,
            attachmentId: attachment.id,
            fileId: fileToUpload.id,
            presignedPost: attachment.presigned_post,
            progressCallback: updateFileStatus
              ? (progressData: ProgressCallbackData) => {
                  updateFileStatus?.(
                    progressData.fileId,
                    progressData.status,
                    progressData.progressPercentage
                  );
                }
              : undefined,
          });
        }
        return Promise.reject();
      })
    );
  };
  return {
    uploadAndConfirmAttachments,
  };
};

export default useManageUploads;
