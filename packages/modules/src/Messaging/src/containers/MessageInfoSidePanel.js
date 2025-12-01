// @flow
import { useSelector, useDispatch } from 'react-redux';
import { MessageInfoSidePanelTranslated as MessageInfoSidePanel } from '../components/MessageInfoSidePanel';
import { closeMessageInfoSidePanel } from '../components/MessageInfoSidePanel/actions';

export default () => {
  const dispatch = useDispatch();
  const activeSidePanel = useSelector(
    (state) => state.messagingSidePanel.activeSidePanel
  );
  const isOpen = activeSidePanel === 'MessageInfo';
  const members = useSelector(
    (state) => state.athleteChat.currentChannelExtraData.members
  );
  const messageIndex = useSelector(
    (state) => state.athleteChat.selectedMessageIndex
  );

  const selectedMessageMediaChangedTime = useSelector(
    (state) => state.athleteChat.selectedMessageMediaChangedTime
  );

  const selectedMessage = useSelector((state) =>
    state.athleteChat.messages.find((message) => message.index === messageIndex)
  );
  const chatUserIdentity = useSelector((state) => state.athleteChat.username);
  const currentChannelSid = useSelector(
    (state) => state.athleteChat.currentChannel?.sid
  );

  return (
    isOpen && (
      <MessageInfoSidePanel
        onClose={() => {
          dispatch(closeMessageInfoSidePanel());
        }}
        chatUserIdentity={chatUserIdentity}
        message={selectedMessage}
        messageMediaChangedTime={selectedMessageMediaChangedTime}
        members={members || []}
        channelSid={currentChannelSid}
      />
    )
  );
};
