// @flow
import { useDispatch } from 'react-redux';
import { useRef, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { List, Zoom } from '@kitman/playbook/components';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  onUpdateAttachment,
  onDeleteAttachment,
  type AttachmentItem,
} from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';
import { QueuedItemTranslated as QueuedItem } from '@kitman/modules/src/HumanInput/shared/components/UIElements/QueuedItem';
import { AttachmentFilePondTranslated as AttachmentFilePond } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FilePond';
import {
  type FilePondError,
  type FilePondWarning,
} from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FileUploader/types';
import {
  MAX_FILE_SIZE,
  MAX_FILES,
} from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FileUploader/consts';
import {
  imageFileTypes,
  textFileTypes,
  docFileTypes,
  dicomFileTypes,
} from '@kitman/common/src/utils/mediaHelper';

type Props = {
  filePondRef: React$ElementRef<any>,
  attachmentItem: AttachmentItem | null,
  disabled: boolean,
  setFile: Function,
};

const FileUploader = ({
  filePondRef,
  t,
  attachmentItem,
  setFile,
  disabled,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const handleAddAttachment = () => {
    const fileSize = attachmentItem?.file?.fileSize || -1;

    dispatch(
      onUpdateAttachment({
        file: attachmentItem?.file,
        state: 'SUCCESS',
        message: `${fileSizeLabel(fileSize, true)} • ${t('Complete')}`,
      })
    );
  };

  const handleLoadingAttachment = (file: AttachedFile) => {
    setFile(file);

    const attachment = {
      filename: file.filename,
      fileType: file.fileType,
      fileSize: file.fileSize,
      id: file.id,
    };

    dispatch(
      onUpdateAttachment({
        file: attachment,
        state: 'PENDING',
        message: `${fileSizeLabel(attachment.fileSize, true)} • ${t(
          'Loading'
        )}`,
      })
    );
  };

  const handleWarning = (warning: FilePondWarning, files: Array<File>) => {
    if (warning.type === 'warning' && warning.body === 'Max files') {
      const message = t(
        `The maximum number of files is one. You selected {{selectedFilesCount}} files.`,
        {
          selectedFilesCount: files.length,
        }
      );

      dispatch(
        onUpdateAttachment({
          file: attachmentItem?.file,
          state: 'FAILURE',
          message: `${message} • ${t('Failed')}`,
        })
      );
    }
  };

  const handleError = ({ main }: FilePondError) => {
    dispatch(
      onUpdateAttachment({
        file: attachmentItem?.file,
        state: 'FAILURE',
        message: `${t(`Error: {{main}}`, {
          main,
        })} • ${t('Failed')}`,
      })
    );
  };

  const handleDeleteAttachment = () => {
    filePondRef.current?.removeFile();
    setFile(null);
    dispatch(onDeleteAttachment());
  };

  return (
    <>
      <AttachmentFilePond
        hideFilePond={!!attachmentItem}
        filePondRef={filePondRef}
        acceptedFileTypes={[
          ...imageFileTypes,
          ...docFileTypes,
          ...textFileTypes,
          ...dicomFileTypes,
        ]}
        onAddFile={handleAddAttachment}
        onLoadingAttachment={handleLoadingAttachment}
        onWarning={handleWarning}
        onError={handleError}
        maxFiles={MAX_FILES}
        maxFileSize={MAX_FILE_SIZE}
        disabled={disabled}
      />
      {attachmentItem && (
        <Zoom in={!!attachmentItem} container={containerRef.current}>
          <List>
            <QueuedItem
              hideDeleteButton={disabled}
              queuedItem={attachmentItem}
              onDelete={handleDeleteAttachment}
            />
          </List>
        </Zoom>
      )}
    </>
  );
};

export const FileUploaderTranslated: ComponentType<Props> =
  withNamespaces()(FileUploader);
export default FileUploader;
