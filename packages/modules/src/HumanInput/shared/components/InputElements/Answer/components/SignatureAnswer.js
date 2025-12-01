// @flow
import { useSelector } from 'react-redux';
import { Box, Typography } from '@kitman/playbook/components';
import type { QueuedItemType } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { getQueueFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formAttachmentSelectors';

type Props = {
  text?: string,
  elementId: number,
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
};

const SignatureAnswer = ({ text, elementId, repeatableGroupInfo }: Props) => {
  let attachment: ?QueuedItemType = useSelector(getQueueFactory(elementId));

  if (repeatableGroupInfo?.repeatable && Array.isArray(attachment)) {
    attachment = attachment[repeatableGroupInfo.groupNumber];
  }
  const attachmentUrl = attachment?.file?.blobUrl;

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
        <img
          loading="lazy"
          width="360"
          height="120"
          src={attachmentUrl}
          alt=""
        />
      </Box>
    </>
  );
};

export default SignatureAnswer;
