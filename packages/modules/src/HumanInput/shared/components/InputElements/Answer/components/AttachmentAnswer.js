// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useState, type ComponentType } from 'react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { getQueueFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formAttachmentSelectors';
import type { QueuedItemType } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import moment from 'moment';
import {
  Box,
  Paper,
  ListItem,
  Typography,
  Avatar,
  ListItemIcon,
  ListItemText,
  Link,
} from '@kitman/playbook/components';
import { imageFileTypes } from '@kitman/common/src/utils/mediaHelper';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextCellTooltip } from '@kitman/components/src/TableCells';
import { AttachmentsViewerModalTranslated as AttachmentsViewerModal } from '@kitman/modules/src/shared/AttachmentsViewerModal';

type Props = {
  text?: string,
  elementId: number,
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
};
type AttachmentForModal = {
  id: number,
  name?: string,
  filetype: string,
  filesize: number,
  filename: string,
  url: string,
};

const AttachmentAnswer = ({
  text,
  elementId,
  t,
  repeatableGroupInfo,
}: I18nProps<Props>) => {
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  let attachment: QueuedItemType = useSelector(getQueueFactory(elementId));

  if (repeatableGroupInfo?.repeatable && Array.isArray(attachment)) {
    attachment = attachment[repeatableGroupInfo.groupNumber];
  }

  const isImageType = imageFileTypes.includes(attachment?.file.fileType);
  const attachmentUrl = attachment?.file?.blobUrl;
  const createdDate = attachment?.file?.createdDate
    ? DateFormatter.formatStandard({
        date: moment(attachment.file?.createdDate),
      })
    : '';

  const attachmentsForModal: Array<AttachmentForModal> = attachment
    ? [
        {
          id: Number(attachment.file.id),
          name: attachment.file.filename,
          filename: attachment.file.filename,
          filetype: attachment.file.fileType,
          filesize: attachment.file.fileSize,
          url: attachmentUrl,
        },
      ]
    : [];

  return attachment ? (
    <>
      <Typography
        variant="subtitle1"
        mb={2}
        sx={{ color: 'text.primary', fontSize: '14px' }}
      >
        {text}
      </Typography>
      <Paper elevation={1}>
        <ListItem>
          {isImageType ? (
            <Avatar
              variant="square"
              src={attachmentUrl || ''}
              sx={{ mr: 1, width: 50, height: 50 }}
            />
          ) : (
            <ListItemIcon>
              <KitmanIcon name={KITMAN_ICON_NAMES.InsertDriveFileOutlined} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <Box>
                <TextCellTooltip
                  longText={attachment.file.filename}
                  valueLimit={25}
                />
              </Box>
            }
            secondary={
              <Typography
                sx={{
                  display: 'inline',
                }}
                component="span"
                variant="body2"
              >
                {t('uploaded {{createdDate}}', { createdDate })}
              </Typography>
            }
            primaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
            secondaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body1"
              onClick={() => setOpenPreview(true)}
              sx={{ cursor: 'pointer' }}
            >
              {t('View')}
            </Typography>
            {attachmentUrl && (
              <Link href={attachmentUrl}>
                <KitmanIcon
                  name={KITMAN_ICON_NAMES.Download}
                  fontSize="small"
                />
              </Link>
            )}
          </Box>
        </ListItem>
      </Paper>

      <AttachmentsViewerModal
        open={!!attachment && openPreview}
        onClose={() => setOpenPreview(false)}
        attachments={attachmentsForModal}
      />
    </>
  ) : (
    <Typography component="span" variant="body2">
      {t('No attached file')}
    </Typography>
  );
};

export const AttachmentAnswerTranslated: ComponentType<Props> =
  withNamespaces()(AttachmentAnswer);
export default AttachmentAnswer;
