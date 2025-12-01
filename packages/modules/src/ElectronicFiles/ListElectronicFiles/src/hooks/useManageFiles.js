// @flow
import type { ElementRef } from 'react';
import { type Translation } from '@kitman/common/src/types/i18n';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import {
  selectData,
  updateData,
  attachSelectedFiles,
  updateValidation,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';

export type ProcessedFile = { fileId: string, attachmentId: number };

export type ReturnType = {
  filesToUpload: Array<AttachedFile>,
  filesReadyToUpload: Array<AttachedFile>,
  uploadedFiles: Array<ProcessedFile>,
  errorFileIds: Array<string>,
  setUploadedFiles: (
    ((Array<ProcessedFile>) => Array<ProcessedFile>) | Array<ProcessedFile>
  ) => void,
  setErrorFileIds: (((Array<string>) => Array<string>) | Array<string>) => void,
  setFilesToUpload: any,
  setFilesReadyToUpload: any,
  handleAddFile: (file: AttachedFile) => void,
  handleAttachSelectedFiles: () => void,
  handleRemoveUploadedFile: (file: File, id: string) => void,
  handleRemoveAttachedFile: (fileId: number) => void,
};

const useManageFiles = ({
  filePondRef,
  selectedFilesRef,
  t,
}: {
  filePondRef: ElementRef<any>,
  selectedFilesRef: ElementRef<any>,
  t: Translation,
}): ReturnType => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);

  const [uploadedFiles, setUploadedFiles] = useState<Array<ProcessedFile>>([]);
  const [errorFileIds, setErrorFileIds] = useState<Array<string>>([]);
  const [filesToUpload, setFilesToUpload] = useState<Array<AttachedFile>>([]);
  const [filesReadyToUpload, setFilesReadyToUpload] = useState<
    Array<AttachedFile>
  >([]);

  useEffect(() => {
    setFilesReadyToUpload(
      filesToUpload.filter(
        (fileToUpload) =>
          !uploadedFiles
            .map((uploadedFile) => uploadedFile.fileId)
            .includes(fileToUpload.id) &&
          !errorFileIds.includes(fileToUpload.id)
      )
    );
  }, [filesToUpload, uploadedFiles, errorFileIds]);

  const handleAddFile = (file: AttachedFile) => {
    setFilesToUpload((prevState) => [...prevState, file]);
    dispatch(updateValidation({ files: [], filesToUpload: [] }));

    selectedFilesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAttachSelectedFiles = () => {
    dispatch(attachSelectedFiles());
    dispatch(updateValidation({ files: [], selectedFiles: [] }));

    setTimeout(() => {
      selectedFilesRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleRemoveUploadedFile = (file: File, id: string) => {
    setFilesToUpload((prevState) =>
      prevState.filter((fileToUpload) => fileToUpload.id !== id)
    );
    setUploadedFiles((prevState) =>
      prevState.filter((uploadedFile) => uploadedFile.fileId !== id)
    );
    setErrorFileIds((prevState) =>
      prevState.filter((errorFileId) => errorFileId !== id)
    );
    filePondRef.current?.removeFile(file);
    dispatch(
      updateValidation({
        files: [
          ...(!(filesToUpload.length - 1) && !data.attachedFiles.length
            ? [t('At least one file is required')]
            : []),
        ],
      })
    );
  };

  const handleRemoveAttachedFile = (fileId: number) => {
    dispatch(
      updateData({
        attachedFiles: data.attachedFiles.filter((file) => file.id !== fileId),
      })
    );
    dispatch(
      updateValidation({
        files: [
          ...(!filesToUpload.length && !(data.attachedFiles.length - 1)
            ? [t('At least one file is required')]
            : []),
        ],
      })
    );
  };

  return {
    filesToUpload,
    filesReadyToUpload,
    uploadedFiles,
    errorFileIds,
    setUploadedFiles,
    setErrorFileIds,
    setFilesToUpload,
    setFilesReadyToUpload,
    handleAddFile,
    handleAttachSelectedFiles,
    handleRemoveUploadedFile,
    handleRemoveAttachedFile,
  };
};

export default useManageFiles;
