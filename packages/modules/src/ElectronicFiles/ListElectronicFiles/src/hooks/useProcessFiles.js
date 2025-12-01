// @flow
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { ProcessedFile } from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useManageFiles';
import { transformFilesForUpload } from '@kitman/common/src/utils/fileHelper';
import {
  useCreatePresignedAttachmentsMutation,
  useUploadFileToS3Mutation,
  useConfirmFileUploadMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';

type ProcessFilesReturnType = Promise<{
  attachmentIds: Array<number>,
  success: boolean,
}>;

export type ReturnType = {
  isLoading: boolean,
  processFiles: () => ProcessFilesReturnType,
};

const useProcessFiles = ({
  filesReadyToUpload = [],
  uploadedFiles = [],
  errorFileIds = [],
  setUploadedFiles,
  setErrorFileIds,
}: {
  filesReadyToUpload: Array<AttachedFile>,
  uploadedFiles: Array<ProcessedFile>,
  errorFileIds: Array<string>,
  setUploadedFiles: (
    ((Array<ProcessedFile>) => Array<ProcessedFile>) | Array<ProcessedFile>
  ) => void,
  setErrorFileIds: (((Array<string>) => Array<string>) | Array<string>) => void,
}): ReturnType => {
  const [
    createPresignedAttachments,
    { isLoading: areCreatePresignedAttachmentsLoading },
  ] = useCreatePresignedAttachmentsMutation();

  const [uploadFileToS3, { isLoading: isUploadToS3Loading }] =
    useUploadFileToS3Mutation();

  const [confirmFileUpload, { isLoading: isConfirmFileUploadLoading }] =
    useConfirmFileUploadMutation();

  const isLoading =
    areCreatePresignedAttachmentsLoading ||
    isUploadToS3Loading ||
    isConfirmFileUploadLoading;

  const uploadAndConfirmAttachment = (attachment) => {
    return new Promise((resolve, reject) => {
      uploadFileToS3(attachment).then((uploadFileToS3Response) => {
        if (uploadFileToS3Response.error) {
          reject(uploadFileToS3Response.error);
          return;
        }
        confirmFileUpload(attachment.attachmentId).then(
          (confirmFileUploadResponse) => {
            if (confirmFileUploadResponse.error) {
              reject(confirmFileUploadResponse.error);
            }
            resolve(confirmFileUploadResponse);
          }
        );
      });
    });
  };

  const uploadAndConfirmAttachments = (attachments) => {
    return Promise.allSettled(
      attachments.map((attachment, index) => {
        const attachmentId = attachment.id;
        const file = filesReadyToUpload[index].file;
        const fileId = filesReadyToUpload[index].id;
        const presignedPost = attachment.presigned_post;
        return uploadAndConfirmAttachment({
          file,
          fileId,
          attachmentId,
          presignedPost,
        });
      })
    );
  };

  const createAttachments = (filesToUpload) => {
    return createPresignedAttachments({
      attachments: transformFilesForUpload(filesToUpload),
    })
      .unwrap()
      .then(async ({ attachments }) => {
        return uploadAndConfirmAttachments(attachments);
      })
      .catch((error) => error);
  };

  const isUploadAndConfirmError = (attachments) =>
    attachments.some(
      (processedAttachment) => processedAttachment.status === 'rejected'
    );

  const getUploadedAttachmentIds = () => {
    return uploadedFiles.map((uploadedFile) => uploadedFile.attachmentId);
  };

  const getProcessedAttachmentIds = (attachments) => {
    return attachments
      .filter((attachment) => attachment.status === 'fulfilled')
      .map((attachment) => {
        return attachment.value.data.attachment.id;
      });
  };

  const getProcessedAttachmentIdMapping = (attachments, status) => {
    const fileIds = [];
    attachments.forEach((processedAttachment, index) => {
      if (processedAttachment.status === status) {
        if (status === 'fulfilled') {
          fileIds.push({
            fileId: filesReadyToUpload[index].id,
            attachmentId: processedAttachment.value.data.attachment.id,
          });
        } else {
          fileIds.push(filesReadyToUpload[index].id);
        }
      }
    });
    return fileIds;
  };

  const updateUploadedFiles = (files) => {
    setUploadedFiles((prevState) => [...prevState, ...files]);
  };

  const updateErrorFileIds = (fileIds) => {
    setErrorFileIds((prevState) => [...prevState, ...fileIds]);
  };

  const processFiles = async () => {
    if (errorFileIds.length) {
      return { success: false, attachmentIds: getUploadedAttachmentIds() };
    }

    if (!filesReadyToUpload.length) {
      return {
        success: true,
        attachmentIds: getUploadedAttachmentIds(),
      };
    }

    const processedAttachments = await createAttachments(filesReadyToUpload);

    // if creating presigned attachments failed
    if (processedAttachments.error) {
      updateErrorFileIds(filesReadyToUpload.map((file) => file.id.toString()));
      return { success: false, attachmentIds: [] };
    }

    // update uploaded fileIds
    updateUploadedFiles(
      getProcessedAttachmentIdMapping(processedAttachments, 'fulfilled')
    );

    // if uploading/confirming at least one attachment failed
    if (isUploadAndConfirmError(processedAttachments)) {
      updateErrorFileIds(
        getProcessedAttachmentIdMapping(processedAttachments, 'rejected')
      );
      return { success: false, attachmentIds: getUploadedAttachmentIds() };
    }

    return {
      success: true,
      attachmentIds: [
        ...getUploadedAttachmentIds(),
        ...getProcessedAttachmentIds(processedAttachments),
      ],
    };
  };

  return {
    isLoading,
    processFiles,
  };
};

export default useProcessFiles;
