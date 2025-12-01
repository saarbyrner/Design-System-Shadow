// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type ComponentType } from 'react';
import {
  Box,
  Typography,
  Avatar,
  ListItemText,
} from '@kitman/playbook/components';
import type { QueuedItemType } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { getQueueFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formAttachmentSelectors';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  text?: string,
  elementId: number,
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
};

const AvatarAnswer = ({
  text,
  elementId,
  repeatableGroupInfo,
  t,
}: I18nProps<Props>) => {
  let attachment: QueuedItemType = useSelector(getQueueFactory(elementId));

  if (repeatableGroupInfo?.repeatable && Array.isArray(attachment)) {
    attachment = attachment[repeatableGroupInfo.groupNumber];
  }
  const avatarUrl = attachment?.file?.blobUrl;

  return (
    <>
      <Typography
        variant="subtitle1"
        mb={1}
        sx={{ color: 'text.primary', fontSize: '14px' }}
      >
        {text}
      </Typography>
      <Box display="flex" alignItems="center">
        <Avatar src={avatarUrl} sx={{ mr: 1 }} />
        <ListItemText
          secondary={!avatarUrl ? t('No image selected') : ''}
          secondaryTypographyProps={{ color: 'text.secondary' }}
        />
      </Box>
    </>
  );
};

export const AvatarAnswerTranslated: ComponentType<Props> =
  withNamespaces()(AvatarAnswer);
export default AvatarAnswer;
