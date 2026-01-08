// @flow
import { useRef, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  MAX_FILE_SIZE,
  MAX_FILES,
  type AttachedFile,
  type FilePondError,
  type FilePondWarning,
} from '@kitman/common/src/utils/fileHelper';
import { List, Zoom } from '@kitman/playbook/components';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { type AttachmentItem } from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';
import { QueuedItemTranslated as QueuedItem } from '@kitman/modules/src/HumanInput/shared/components/UIElements/QueuedItem';
import { AttachmentFilePondTranslated as AttachmentFilePond } from '@kitman/components/src/FilePond';
import {
  imageFileTypes,
  textFileTypes,
  docFileTypes,
} from '@kitman/common/src/utils/mediaHelper';

type Props = {
  filePondRef: React$ElementRef<any>,
  attachmentItem: ?AttachmentItem,
  disabled: boolean,
  setFile: Function,
  onUpdateAttachment: Function,
  onDeleteAttachment: Function,
};

const FileUploader = ({
  filePondRef,
  t,
  attachmentItem,
  setFile,
  disabled,
  onUpdateAttachment,
  onDeleteAttachment,
}: I18nProps<Props>) => {
  const containerRef = useRef(null);

  const handleAddAttachment = () => {
    const fileSize = attachmentItem?.file?.fileSize || -1;
    onUpdateAttachment({
      file: attachmentItem?.file,
      state: 'SUCCESS',
      message: `${fileSizeLabel(fileSize, true)} • ${t('Complete')}`,
    });
  };

  const handleLoadingAttachment = (file: AttachedFile) => {
    setFile(file);

    const attachment = {
      filename: file.filename,
      fileType: file.fileType,
      fileSize: file.fileSize,
      id: file.id,
    };

    onUpdateAttachment({
      file: attachment,
      state: 'PENDING',
      message: `${fileSizeLabel(attachment.fileSize, true)} • ${t('Loading')}`,
    });
  };

  const handleWarning = (warning: FilePondWarning, files: Array<File>) => {
    if (warning.type === 'warning' && warning.body === 'Max files') {
      const message = t(
        `The maximum number of files is one. You selected {{selectedFilesCount}} files.`,
        {
          selectedFilesCount: files.length,
        }
      );

      onUpdateAttachment({
        file: attachmentItem?.file,
        state: 'FAILURE',
        message: `${message} • ${t('Failed')}`,
      });
    }
  };

  const handleError = ({ main }: FilePondError) => {
    onUpdateAttachment({
      file: attachmentItem?.file,
      state: 'FAILURE',
      message: `${t(`Error: {{main}}`, {
        main,
      })} • ${t('Failed')}`,
    });
  };

  const handleDeleteAttachment = () => {
    filePondRef.current?.removeFile();
    setFile(null);
    onDeleteAttachment();
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
