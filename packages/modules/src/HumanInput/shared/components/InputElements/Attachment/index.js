// @flow
import { useRef, useState } from 'react';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type {
  FilePondError,
  FilePondWarning,
} from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FileUploader/types';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { QueuedItemType } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { AvatarInputTranslated as Avatar } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Attachment/components/Avatar';
import { SignatureInputTranslated as Signature } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Attachment/components/Signature';
import { Collapse, List, Typography, Box } from '@kitman/playbook/components';
import { MAX_FILES } from '@kitman/modules/src/HumanInput/shared/constants';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import { filePondSx } from '@kitman/modules/src/HumanInput/shared/utils/styles';
import { QueuedItemTranslated as QueuedItem } from '@kitman/modules/src/HumanInput/shared/components/UIElements/QueuedItem';
import { ATTACHMENT_TYPES } from '@kitman/modules/src/HumanInput/types/forms';
import { getIdleLabel } from './utils/helpers';

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename
);

type Props = {
  element: HumanInputFormElement,
  acceptedFilesTypes: Array<string>,
  onDeleteAttachment: () => void,
  onAddAttachment: (attachedFile: AttachedFile) => Promise<void>,
  onErrorAttachment: (error: FilePondError, attachedFile: AttachedFile) => void,
  onWarningAttachment: (warning: FilePondWarning, files: Array<File>) => void,
  queuedAttachment: ?QueuedItemType,
};

const Attachment = ({
  element,
  queuedAttachment,
  acceptedFilesTypes,
  onDeleteAttachment,
  onAddAttachment,
  onErrorAttachment,
  onWarningAttachment,
}: Props) => {
  const filePondRef = useRef(null);
  const [attachment, setAttachment] = useState([]);
  const maxSize = element.config.custom_params?.max_size || '10mb';

  const onDelete = () => {
    filePondRef.current?.removeFile();
    setAttachment(null);
    onDeleteAttachment();
  };

  const renderAttachmentElement = () => {
    switch (element.config.custom_params?.type) {
      case ATTACHMENT_TYPES.AVATAR:
        return (
          <Avatar
            element={element}
            queuedAttachment={queuedAttachment}
            onAddAttachment={onAddAttachment}
          />
        );
      case ATTACHMENT_TYPES.SIGNATURE:
        return (
          <Signature
            element={element}
            onAddAttachment={onAddAttachment}
            queuedAttachment={queuedAttachment}
          />
        );
      default:
        return (
          <Box
            sx={{
              ...(queuedAttachment ? { display: 'none' } : {}),
              ...filePondSx,
            }}
          >
            <FilePond
              allowFileSizeValidation
              allowFileTypeValidation
              allowReplace
              allowDrop
              allowMultiple
              dropOnPage
              removeFilesWithErrors
              files={attachment}
              allowProcess
              ref={filePondRef}
              instantUpload={false}
              acceptedFileTypes={acceptedFilesTypes}
              maxFiles={MAX_FILES}
              maxFileSize={maxSize}
              labelIdle={getIdleLabel(acceptedFilesTypes, maxSize)}
              onerror={onErrorAttachment}
              onaddfile={(error, file) => {
                if (error) {
                  onErrorAttachment(error, file);
                  filePondRef.current?.removeFile(file);
                } else {
                  onAddAttachment(file);
                }
              }}
              onupdatefiles={setAttachment}
              onwarning={onWarningAttachment}
            />
          </Box>
        );
    }
  };

  return (
    <>
      <Typography
        variant="subtitle1"
        mb={1}
        sx={{ color: 'text.primary', fontSize: '14px' }}
      >
        {element.config.text}
      </Typography>
      {renderAttachmentElement()}
      {queuedAttachment && (
        <Collapse in={!!queuedAttachment}>
          <List>
            <QueuedItem queuedItem={queuedAttachment} onDelete={onDelete} />
          </List>
        </Collapse>
      )}
    </>
  );
};

export default Attachment;
