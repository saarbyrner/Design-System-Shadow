// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Drawer,
  Typography,
  Stack,
  Box,
  Divider,
  IconButton,
  Link,
  Chip,
  Paper,
  Button,
} from '@kitman/playbook/components';
import type {
  EmailResponse,
  Attachment,
} from '@kitman/services/src/services/notifications/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import colors from '@kitman/common/src/variables/colors';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { AttachmentsViewerModalTranslated as AttachmentsViewerModal } from '@kitman/modules/src/shared/AttachmentsViewerModal';
import { formatDateToUserTimezone } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import RichTextPrintDisplay from '@kitman/printing/src/components/RichTextPrintDisplay/index';

const Subject = ({
  subject,
  onClose,
  t,
}: I18nProps<{
  subject: string,
  onClose: () => void,
}>) => (
  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
    <Typography
      variant="h6"
      sx={{
        fontSize: 20,
        fontWeight: 600,
        colors: colors.grey_300,
        width: '90%',
        whiteSpace: 'normal',
      }}
    >
      {t(subject)}
    </Typography>
    <IconButton aria-label="close-details-panel" onClick={onClose}>
      <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
    </IconButton>
  </Stack>
);

const Recipient = ({
  recipient,
  messageStatus,
  t,
}: I18nProps<{
  recipient: string,
  messageStatus: string,
}>) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{recipient}</Typography>
    <Chip
      label={t(messageStatus === 'errored' ? 'Failure' : 'Sent')}
      color={messageStatus === 'errored' ? 'error' : 'success'}
    />
  </Stack>
);

const SentDateTime = ({
  createdAt,
  t,
}: I18nProps<{
  createdAt: string,
}>) => (
  <Stack direction="row" gap={1}>
    <Box component="span" sx={{ fontWeight: 600 }}>
      {t('Sent data and time: ')}
    </Box>
    <Box component="span">
      {formatDateToUserTimezone({
        date: moment(createdAt),
        showTimezone: true,
      })}
    </Box>
  </Stack>
);

const DistributionType = ({
  distributionType,
  t,
}: I18nProps<{
  distributionType: string,
}>) =>
  distributionType && (
    <Stack direction="row" gap={1}>
      <Box component="span" sx={{ fontWeight: 600 }}>
        {t('Distribution type: ')}
      </Box>
      <Box component="span" sx={{ textTransform: 'capitalize' }}>
        {distributionType}
      </Box>
    </Stack>
  );

const Message = ({
  message,
  t,
}: I18nProps<{
  message: string,
}>) => (
  <Stack direction="column" gap={2}>
    <Box component="span" sx={{ fontWeight: 600 }}>
      {t('Message: ')}
    </Box>
    <Box component="p" sx={{ whiteSpace: 'pre-wrap' }}>
      {RichTextPrintDisplay({ value: t(message) })}
    </Box>
  </Stack>
);

const AttachmentList = ({
  attachments,
  createdAt,
  onView,
  t,
}: I18nProps<{
  attachments: Array<Attachment>,
  createdAt: string,
  onView: (Array<Attachment>) => void,
}>) => (
  <>
    {attachments.map((attachment, index) => (
      <Paper key={attachment.id} sx={{ padding: '16px' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '70%',
              overflow: 'hidden',
            }}
          >
            <Typography noWrap>{attachment.filename}</Typography>
            <Box component="span" sx={{ fontSize: '14px' }}>
              {formatDateToUserTimezone({
                date: moment(createdAt),
              })}
            </Box>
          </Box>
          <Button
            aria-label={`view-attachment-${index + 1}`}
            variant="text"
            color="primary"
            onClick={() => onView([attachment])}
          >
            {t('View')}
          </Button>
          <Link
            sx={{ cursor: 'pointer' }}
            color="inherit !important"
            underline="none"
            href={attachment.url}
            target="_blank"
            download={attachment.filename}
          >
            <KitmanIcon
              name={KITMAN_ICON_NAMES.DownloadOutlined}
              fontSize="small"
            />
          </Link>
        </Stack>
      </Paper>
    ))}
  </>
);

type Props = {
  isOpen: boolean,
  onClose: () => void,
  email: EmailResponse | null,
};

const EmailDetailsPanel = ({ isOpen, onClose, email, t }: I18nProps<Props>) => {
  const theme = useTheme();
  const [selectedAttachments, setSelectedAttachments] = useState<
    Array<Attachment>
  >([]);

  const {
    created_at: createdAt = '',
    trigger_kind: distributionType = '',
    message_status: messageStatus = '',
    message = '',
    subject = '',
    recipient = '',
    attachments = [],
  } = email ?? {};

  return (
    <>
      <Drawer
        open={isOpen}
        anchor="right"
        onClose={onClose}
        sx={drawerMixin({ theme, isOpen })}
      >
        <Stack direction="column" gap={1} sx={{ px: 3, pb: 1, pt: 2 }}>
          <Subject subject={subject} onClose={onClose} t={t} />
        </Stack>
        <Divider />
        <Stack direction="column" gap={1} sx={{ px: 3, py: 2 }}>
          <Recipient
            recipient={recipient}
            messageStatus={messageStatus}
            t={t}
          />
          <SentDateTime createdAt={createdAt} t={t} />
          <DistributionType distributionType={distributionType} t={t} />
          <Message message={message} t={t} />
          <AttachmentList
            attachments={attachments}
            createdAt={createdAt}
            onView={setSelectedAttachments}
            t={t}
          />
        </Stack>
      </Drawer>

      <AttachmentsViewerModal
        open={selectedAttachments.length > 0}
        onClose={() => setSelectedAttachments([])}
        attachments={selectedAttachments}
      />
    </>
  );
};

export const EmailDetailsPanelTranslated = withNamespaces()(EmailDetailsPanel);
export default EmailDetailsPanel;
