// @flow
import {
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { DevelopmentGoalComment } from '@kitman/modules/src/AthleteReviews/src/shared/types';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import moment from 'moment-timezone';

type Props = {
  comment: DevelopmentGoalComment,
  onDeleteComment: (number) => void,
};

const Comment = ({
  comment: {
    id,
    text,
    user: { fullname, id: commentUserId, avatar_url: avatarUrl } = {},
    created_at: createdAt,
  },
  onDeleteComment,
}: Props) => {
  const { data: { id: currentUserId } = { id: null } } =
    useGetCurrentUserQuery();
  return (
    <Stack mt={1}>
      <Box>
        <Avatar
          variant="circular"
          sx={{ height: '24px', width: '24px', position: 'absolute', left: 0 }}
          src={avatarUrl}
        />
        <Typography variant="subtitle2" mr={1} sx={{ display: 'inline-block' }}>
          {fullname}
        </Typography>
        <Typography variant="caption" sx={{ display: 'inline-block' }}>
          {formatStandard({
            date: moment(createdAt),
            displayLongDate: true,
          })}
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="body2">{text}</Typography>
          {commentUserId === currentUserId && (
            <IconButton
              edge="end"
              sx={{ paddingTop: '0' }}
              size="small"
              onClick={() => onDeleteComment(+id)}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default Comment;
