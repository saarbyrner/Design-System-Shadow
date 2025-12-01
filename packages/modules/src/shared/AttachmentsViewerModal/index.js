// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  Dialog as MuiDialog,
  DialogContent,
  IconButton,
  CardMedia,
  Tabs,
  Tab,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  pdfFileType,
  isWebDisplayableMedia,
  getMediaContentClass,
} from '@kitman/common/src/utils/mediaHelper';
import { FileDisplayDetailsTranslated as FileDisplayDetails } from '@kitman/modules/src/shared/FileDisplayDetails';
import { PdfViewerTranslated as PdfViewer } from '@kitman/components/src/PdfViewer';
import { MODE_KEY } from '@kitman/components/src/PdfViewer/src/consts';

// Types:
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { Attachment as NotificationAttachment } from '@kitman/services/src/services/notifications/shared/types';
import type { BasicFileDetails } from '@kitman/modules/src/shared/FileDisplayDetails';

type Props = {
  open: boolean,
  onClose: () => void,
  attachments: Array<Attachment> | Array<NotificationAttachment>,
};

const AttachmentsViewerModal = ({
  t,
  attachments,
  open,
  onClose,
}: I18nProps<Props>) => {
  const [attachmentIndex, setAttachmentIndex] = useState<number>(0);

  const renderAttachment = () => {
    const attachment = attachments[attachmentIndex];

    const fileDetails: BasicFileDetails = {
      id: attachment.id,
      name: attachment.name || attachment.filename,
      type: attachment.filetype,
      size: attachment.filesize,
      url: attachment.url,
    };

    const fileDisplayDetails = (
      <FileDisplayDetails
        fileDetails={fileDetails}
        showFileStatus={false}
        tooltipText={t('Open file')}
      />
    );

    if (attachment.filetype === pdfFileType) {
      return (
        <>
          {fileDisplayDetails}
          <PdfViewer
            fileUrl={attachment.url || ''}
            height={700}
            mode={MODE_KEY.full}
          />
        </>
      );
    }

    const isWebDisplayable = isWebDisplayableMedia(attachment.filetype);
    const contentClass = isWebDisplayable
      ? getMediaContentClass(attachment.filetype)
      : 'file';

    if (
      contentClass === 'image' ||
      contentClass === 'audio' ||
      contentClass === 'video'
    ) {
      return (
        <>
          {fileDisplayDetails}
          <CardMedia
            component={contentClass === 'image' ? 'img' : contentClass}
            alt={attachment.name || attachment.filename}
            sx={{
              padding: '1em 1em 0 1em',
              objectFit: 'contain',
              maxHeight: 'calc(100vh - 200px) !important',
            }}
            src={attachment.url}
            title={attachment.name || attachment.filename}
            controls
          />
        </>
      );
    }

    return fileDisplayDetails;
  };

  const renderAttachmentTabs = () => {
    return (
      <Tabs
        value={attachmentIndex}
        onChange={(event, newValue) => {
          setAttachmentIndex(newValue);
        }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="attachment tabs"
        sx={{
          maxWidth: 'calc(100% - 70px)',
        }}
      >
        {attachments.map((attachment, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Tab label={attachment.name || attachment.filename} key={index} />
          );
        })}
      </Tabs>
    );
  };

  if (!attachments || attachments.length < 1) {
    return null;
  }

  return (
    <div data-testid="AttachmentsViewerModal">
      <MuiDialog open={open} fullWidth maxWidth="md" onClose={onClose}>
        {renderAttachmentTabs()}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            color: colors.grey_300_50,
          }}
        >
          <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
        </IconButton>
        <DialogContent dividers>{renderAttachment()}</DialogContent>
      </MuiDialog>
    </div>
  );
};

export const AttachmentsViewerModalTranslated: ComponentType<Props> =
  withNamespaces()(AttachmentsViewerModal);
export default AttachmentsViewerModal;
