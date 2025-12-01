// @flow
import { withNamespaces } from 'react-i18next';
import { SlidingPanel } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ChatMessage, MessagingMember } from '../../types';
import ChatAvatar from '../ChatAvatar';
import { MessageBubbleTranslated as MessageBubble } from '../MessageBubble';

type Props = {
  chatUserIdentity: string,
  message: ChatMessage,
  members: Array<MessagingMember>,
  channelSid: ?string,
  messageMediaChangedTime: ?string,
  onClose: Function,
};

const MessageInfoSidePanel = (props: I18nProps<Props>) => {
  // Split members who have read from unread the message
  const readUnreadMembersDict = props.members.reduce(
    (acc, member) => {
      if (member.messagingIdentity !== props.chatUserIdentity) {
        if (
          member.lastReadMessageIndex &&
          member.lastReadMessageIndex >= props.message.index
        ) {
          acc.read.push(member);
        } else {
          acc.unread.push(member);
        }
      }
      return acc;
    },
    { unread: [], read: [] }
  );

  const sortByName = (a: MessagingMember, b: MessagingMember) =>
    (a.friendlyName || a.messagingIdentity).localeCompare(
      b.friendlyName || b.messagingIdentity
    );

  readUnreadMembersDict.unread.sort(sortByName);
  readUnreadMembersDict.read.sort(sortByName);
  const mapMember = (member) => (
    <div key={member.messagingIdentity} className="chatMessageInfo__memberRow">
      <ChatAvatar
        userIdentity={member.messagingIdentity}
        friendlyName={member.friendlyName}
      />
      <span>
        {member.friendlyName ? member.friendlyName : member.messagingIdentity}
      </span>
    </div>
  );

  const membersRead = readUnreadMembersDict.read.map(mapMember);
  const membersUnread = readUnreadMembersDict.unread.map(mapMember);

  return (
    <div className="chatMessageInfo">
      <SlidingPanel
        cssTop={50}
        width={460}
        isOpen
        title={props.t('Message info')}
        togglePanel={() => {
          props.onClose();
        }}
        kitmanDesignSystem
      >
        <div className="slidingPanel__content">
          {props.channelSid && (
            <div className="slidingPanel__indent">
              <div className="chatMessageInfo__message">
                <MessageBubble
                  message={props.message}
                  channelSid={props.channelSid}
                  channelMembers={props.members}
                  firstMessageInChain
                  allRoundCorners
                  displayReadStatus={false}
                  messageMediaChangedTime={props.messageMediaChangedTime}
                />
              </div>
              {readUnreadMembersDict.read.length > 0 && (
                <div className="col-md-7 slidingPanel__row chatMessageInfo__readGroup">
                  <div className="text_header">{props.t('Read')}</div>
                  {membersRead}
                </div>
              )}
              {readUnreadMembersDict.unread.length > 0 && (
                <div className="col-md-7 slidingPanel__row chatMessageInfo__unreadGroup">
                  <div className="text_header">{props.t('Unread')}</div>
                  {membersUnread}
                </div>
              )}
            </div>
          )}
        </div>
      </SlidingPanel>
    </div>
  );
};

export default MessageInfoSidePanel;
export const MessageInfoSidePanelTranslated =
  withNamespaces()(MessageInfoSidePanel);
