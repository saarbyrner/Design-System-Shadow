// @flow
import { type ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { QueuedItemType } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { styled } from '@mui/material/styles';
import { Box, Button, Avatar } from '@kitman/playbook/components';

type Props = {
  element: HumanInputFormElement,
  onAddAttachment: (attachedFile: AttachedFile) => Promise<void>,
  queuedAttachment: ?QueuedItemType,
};

const FileInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const AvatarInput = ({
  t,
  element,
  queuedAttachment,
  onAddAttachment,
}: I18nProps<Props>) => {
  const getButtonText = () => {
    if (queuedAttachment) return t('Select a different');
    return t('Select');
  };

  return (
    <Box display="flex">
      <Avatar
        src={
          queuedAttachment?.state === 'SUCCESS'
            ? queuedAttachment?.file?.blobUrl
            : ''
        }
        sx={{ mr: 1 }}
      />
      <Box>
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="contained"
          color="secondary"
        >
          {getButtonText()} {element.config.text}
          <FileInput
            type="file"
            onChange={(e) => {
              const [file] = [...e.target.files];
              e.target.value = null;

              const attachedFile: AttachedFile = {
                file,
                fileSize: file.size,
                fileType: file.type,
                filename: file.name,
                filenameWithoutExtension: file.name,
                id: element.id,
              };

              onAddAttachment(attachedFile);
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export const AvatarInputTranslated: ComponentType<Props> =
  withNamespaces()(AvatarInput);
export default AvatarInput;
