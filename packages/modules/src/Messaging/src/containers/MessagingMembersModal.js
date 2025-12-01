// @flow
import { useSelector, useDispatch } from 'react-redux';
import { MessagingMembersModalTranslated as MessagingMembersModal } from '../components/MessagingMembersModal';
import { closeMessagingMembersModal } from '../components/MessagingMembersModal/actions';

export default () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.athleteChat.channelMembersModal.isOpen
  );
  const members = useSelector(
    (state) => state.athleteChat.currentChannelExtraData.members
  );

  return (
    <MessagingMembersModal
      isOpen={isOpen}
      close={() => {
        dispatch(closeMessagingMembersModal());
      }}
      members={members}
    />
  );
};
