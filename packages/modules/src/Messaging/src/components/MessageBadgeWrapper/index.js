// @flow
import { type Node } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from '@kitman/playbook/components';
import { getTotalUnreadCount } from '@kitman/modules/src/Messaging/src/redux/selectors';
import colors from '@kitman/common/src/variables/colors';

const style = {
  '& .MuiBadge-badge': {
    backgroundColor: colors.red_100,
    right: '19px',
    padding: '0 8px',
  },
};

type Props = {
  children: Node,
};

const MessageBadgeWrapper = ({ children }: Props) => {
  const totalUnreadMessages = useSelector(getTotalUnreadCount);

  const isEnabled =
    window.getFlag('cp-messaging-notifications') &&
    window.getFlag('single-page-application');

  if (isEnabled) {
    return (
      <Badge
        badgeContent={totalUnreadMessages || 0}
        color="primary"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={style}
      >
        {children}
      </Badge>
    );
  }

  return children;
};

export default MessageBadgeWrapper;
