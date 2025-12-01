// @flow

import { useState } from 'react';
import { transformFilesForUpload } from '@kitman/common/src/utils/fileHelper';

// Types:
import type { ElementRef } from 'react';
import type {
  FileStatus,
  AttachedFile,
  AttachedMedicalFile,
  AttachedTransformedFile,
  UpdateFileStatus,
} from '@kitman/common/src/utils/fileHelper';

export type ProcessedFile = { fileId: string, attachmentId: number };
export type SupportedFile = AttachedFile | AttachedMedicalFile;
export type ManagedFile = {
  file: SupportedFile,
  status: FileStatus,
  progressPercentage?: number,
};

export type ReturnType = {
  filesToUpload: Array<ManagedFile>,
  updateFileStatus: UpdateFileStatus,
  clearAndResetManagedFiles: () => void,
  getFilesToUploadDescriptors: () => Array<AttachedTransformedFile>,
  handleAddFile: (file: SupportedFile) => void,
  handleRemoveFile: (fileId: string) => void,
};
const useManageFilesForUpload = ({
  filePondRef,
  filesDockRef,
}: {
  filePondRef?: ElementRef<any>,
  filesDockRef?: ElementRef<any>,
}): ReturnType => {
  const [filesToUpload, setFilesToUpload] = useState<Array<ManagedFile>>([]);

  const updateFileStatus = (
    fileId: string | number,
    status: FileStatus,
    progressPercentage?: number
  ) => {
    setFilesToUpload((prevState) => {
      const index = prevState.findIndex(
        (managedFile) => managedFile.file.id === fileId
      );
      if (index === -1) {
        return prevState;
      }
      const shallowCopy = [...prevState];
      const element = shallowCopy[index];
      shallowCopy.splice(index, 1, {
        ...element,
        status,
        progressPercentage:
          progressPercentage != null
            ? progressPercentage
            : element.progressPercentage,
      });
      return shallowCopy;
    });
  };

  const handleAddFile = (file: SupportedFile) => {
    setFilesToUpload((prevState) => [
      ...prevState,
      {
        file,
        status: 'pending',
        progressPercentage: 0,
      },
    ]);
    filesDockRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFilesToUploadDescriptors = (): Array<AttachedTransformedFile> => {
    return transformFilesForUpload(
      // $FlowIgnore[incompatible-call] Will match attachedFiles param
      filesToUpload.map((managedFile: ManagedFile) => managedFile.file)
    );
  };

  const clearAndResetManagedFiles = () => {
    setFilesToUpload([]);
    filePondRef?.current?.removeFiles?.();
  };

  const handleRemoveFile = (fileId: string) => {
    setFilesToUpload((prevState) =>
      prevState.filter(
        (managedFile: ManagedFile) => managedFile.file.id.toString() !== fileId
      )
    );
    filePondRef?.current?.removeFile?.(fileId);
  };

  return {
    filesToUpload,
    updateFileStatus,
    getFilesToUploadDescriptors,
    clearAndResetManagedFiles,
    handleAddFile,
    handleRemoveFile,
  };
};

export default useManageFilesForUpload;
