// @flow
import { Fragment, useState, useRef, useEffect } from 'react';
import _findLast from 'lodash/findLast';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { IconButton } from '@kitman/components';
import { acceptedFileTypes } from '@kitman/common/src/utils/mediaHelper';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import type {
  AthletesSelectorSquadData,
  AthletesAndStaffSelectorStaffMemberData,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { handleUpdateMediaExpires, handleNewMessage } from '../actions';
import { openChannelMembersSidePanel } from './ChannelMembersSidePanel/actions';
import {
  openChannelCreationSidePanel,
  closeChannelCreationSidePanel,
} from './ChannelCreationSidePanel/actions';
import { openChannelSettingsSidePanel } from './ChannelSettingsSidePanel/actions';
import { MessageBubbleTranslated as MessageBubble } from './MessageBubble';
import { ChatTextAreaTranslated as ChatTextArea } from './ChatTextArea';
import { ChatChannelCreationSidePanelTranslated as ChatChannelCreationSidePanel } from './ChannelCreationSidePanel';
import type {
  ChatMessage,
  ChatChannel,
  CurrentChannelExtraData,
  UserRole,
  CreatableChannelTypes,
  SearchableItemGroups,
  MessagingSidePanels,
  GeneralStatus,
} from '../types';
import { ChatChannelHeaderTranslated as ChatChannelHeader } from './ChatChannelHeader';
import ChatChannelSelector from './ChatChannelSelector';

type Props = {
  messages: Array<ChatMessage>,
  userChannels: Array<ChatChannel>,
  directChannels: Array<ChatChannel>,
  staff: Array<AthletesAndStaffSelectorStaffMemberData>,
  squads: Array<AthletesSelectorSquadData>,
  searchableItemGroups: SearchableItemGroups,
  inProgressMedia: Array<string>,
  currentChannel: ?ChatChannel,
  currentChannelExtraData: CurrentChannelExtraData,
  initialMessage?: string,
  generalStatus: GeneralStatus,
  userRole: UserRole,
  activeSidePanel: ?MessagingSidePanels,

  // Callbacks
  onMessageSend: Function,
  onSendMedia: Function,
  onSwitchedChannel: Function,
  onLeaveChannel: Function,
  onRequestNextPageOfMessages: Function,
  onRequestPreviousPageOfMessages: Function,
  onCreateChannel: Function,
  onRefreshChannelLists: Function,
  markMessagesRead: Function,
  showChannelMembersModal: Function,
  onFetchChannelMembers: Function,
  onViewMessageInfo: Function,
};

const Chat = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  // Use States
  const [haveScrolledToBottom, setHaveScrolledToBottom] = useState(true);
  const [haveScrolledToTop, setHaveScrolledToTop] = useState(false);
  const [scrollTargetMsgIndex, setScrollTargetMsgIndex] = useState(null);
  const [
    haveScrolledInitialChannelMessages,
    setHaveScrolledInitialChannelMessages,
  ] = useState(false);
  const [showChannelListsForMobile, setShowChannelListsForMobile] =
    useState(true);
  const [searchChannelMode, setSearchChannelMode] = useState(false);
  const [channelCreationChannelType, setChannelCreationChannelType] =
    useState('');

  // Use Refs
  const targetMessageRef = useRef(null);
  const scrollBottomRef = useRef(null);

  // Effect functions

  const scrollChatAndMarkMessagesRead = () => {
    // If we have a target scroll to that
    if (
      scrollTargetMsgIndex &&
      targetMessageRef.current &&
      targetMessageRef.current.scrollIntoView
    ) {
      targetMessageRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'nearest',
      });
      setScrollTargetMsgIndex(null);
    } else {
      // Check if we should scroll to the bottom

      let instantScroll = false;
      let scrollToBottom = false;

      if (!haveScrolledInitialChannelMessages && props.messages.length > 0) {
        // First load of messages comes in
        instantScroll = true;
        scrollToBottom = true;
        setHaveScrolledInitialChannelMessages(true);
      } else if (haveScrolledInitialChannelMessages && haveScrolledToBottom) {
        // Likely A new message has come in
        instantScroll = false;
        scrollToBottom = true;
      }

      // Perform the scroll to bottom
      if (
        scrollToBottom &&
        scrollBottomRef.current &&
        scrollBottomRef.current.scrollIntoView
      ) {
        scrollBottomRef.current.scrollIntoView({
          behavior: instantScroll ? 'instant' : 'smooth',
          block: 'start',
          inline: 'nearest',
        });

        setHaveScrolledToBottom(true);
      }
    }

    // Mark messages read
    if (
      props.currentChannel &&
      props.messages?.length > 0 &&
      scrollBottomRef.current
    ) {
      const messagesEndPosition =
        scrollBottomRef.current.getBoundingClientRect().top;
      const messagesEndInView =
        messagesEndPosition >= 0 && messagesEndPosition <= window.innerHeight;
      if (messagesEndInView) {
        const nonLogMessage = _findLast(
          props.messages,
          (message) => message.messageType !== 'LOG'
        );
        if (nonLogMessage) {
          const lastLoadedMessageIndex = nonLogMessage.index;
          props.markMessagesRead(lastLoadedMessageIndex);
        }
      }
    }
  };

  const channelId = props.currentChannel ? props.currentChannel.sid : null;

  const awaitingMessages = (): boolean => {
    let awaiting = true;
    if (
      props.currentChannelExtraData.fetchMessagesStatus === 'FETCH_COMPLETE' ||
      props.currentChannelExtraData.fetchMessagesStatus === 'FETCH_ERROR'
    ) {
      awaiting = false;
    }

    return awaiting;
  };

  // Use Effects

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      if (mounted) {
        dispatch(handleUpdateMediaExpires());
      }
    }, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // When the channel changes we clear the messages.
  // Later the messages for the channel will arrive and we only then scroll to the bottom
  useEffect(() => {
    setHaveScrolledInitialChannelMessages(false);
  }, [channelId]);

  useEffect(scrollChatAndMarkMessagesRead, [props.messages]); // runs when messages change. Will scroll if needed

  const canSendMessages = (): boolean => {
    if (
      props.currentChannel &&
      props.currentChannelExtraData &&
      (props.currentChannelExtraData.memberRole === 'channel user' ||
        props.currentChannelExtraData.memberRole === 'channel admin')
    ) {
      return true;
    }
    return false;
  };

  const beginSwitchChannel = (channelSid: string) => {
    setShowChannelListsForMobile(false);
    setSearchChannelMode(false);
    return props.onSwitchedChannel(channelSid).catch(() => {
      // TODO: Show Error AppStatus
    });
  };

  const directMessageUser = (
    targetIdentity: string,
    userId: string,
    userType: 'staff' | 'athlete',
    displayName: string
  ) => {
    const targetFriendlyName = displayName;
    const athletesAndStaffSelection =
      userType === 'staff'
        ? {
            athletes: [],
            staff: [userId],
          }
        : {
            athletes: [userId],
            staff: [],
          };

    // Any Error in retrieving the UserDescriptor
    // Never mind go ahead and create the channel as UserDescriptor not vital
    const promiseToCreate = props.onCreateChannel(
      'direct', // channelType
      '', // channelName
      undefined, // channelDescription
      athletesAndStaffSelection,
      true, // staffCanSend
      true, // athletesCanSend
      undefined, // SID
      targetFriendlyName || 'unknown'
    );
    if (promiseToCreate) {
      promiseToCreate.then(
        (channelSid: string) => {
          setSearchChannelMode(false);
          props.onSwitchedChannel(channelSid);
        },
        () => {
          // TODO: Show Error AppStatus
        }
      );
    }
  };

  const openChannelSettings = () => {
    dispatch(openChannelSettingsSidePanel());
  };

  const openCreateChannelSidePanel = (channelType: CreatableChannelTypes) => {
    setShowChannelListsForMobile(false);
    setChannelCreationChannelType(channelType);
    dispatch(openChannelCreationSidePanel());
  };

  // TODO: better state management for closing other panels ( Redux )
  const beginOpenChannelMembersSidePanel = () => {
    setShowChannelListsForMobile(false);
    props.onFetchChannelMembers(props.currentChannel?.sid).then(
      () => {
        dispatch(openChannelMembersSidePanel());
      },
      () => {
        // TODO: handle error
      }
    );
  };

  const updateScrollState = (event: SyntheticEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    // Check Scroll position: at bottom
    const scrollDif = element.scrollHeight - element.scrollTop;
    const atBottom = scrollDif === element.clientHeight;

    if (props.currentChannel) {
      // For now will mark as read only when reach scroll bottom of the page of messages
      // There could be more messages that will get loaded bellow that
      if (atBottom && props.messages.length > 0) {
        const nonLogMessage = _findLast(
          props.messages,
          (message) => message.messageType !== 'LOG'
        );
        if (nonLogMessage) {
          const lastLoadedMessageIndex = nonLogMessage.index;
          props.markMessagesRead(lastLoadedMessageIndex); // Note: props.messages.lastMessageIndex would mark all read
        }
      }

      if (atBottom && !haveScrolledToBottom) {
        setHaveScrolledToBottom(true);

        if (
          !awaitingMessages() &&
          props.currentChannelExtraData.hasUnretrievedNewerMessages
        ) {
          // eslint-disable-next-line max-depth
          if (props.messages.length > 0) {
            setScrollTargetMsgIndex(
              props.messages[props.messages.length - 1].index
            );
          }
          props.onRequestNextPageOfMessages().catch(() => {
            dispatch(
              handleNewMessage(props.t('Failed to fetch messages'), 'LOG')
            );
          });
          // Note: you could await result with .then here but currentChannel.fetchMessagesStatus will inform you
        }
      } else if (!atBottom && haveScrolledToBottom) {
        setHaveScrolledToBottom(false);
      }

      // Check Scroll position: at top
      if (!haveScrolledToTop && element.scrollTop === 0) {
        setHaveScrolledToTop(true);
        if (
          !awaitingMessages() &&
          props.currentChannelExtraData.hasUnretrievedOlderMessages
        ) {
          setScrollTargetMsgIndex(props.messages[0].index);
          props.onRequestPreviousPageOfMessages().catch(() => {
            dispatch(
              handleNewMessage(props.t('Failed to fetch messages'), 'LOG')
            );
          });
          // Note: you could await result with .then here but currentChannel.fetchMessagesStatus will inform you
        }
      } else {
        setHaveScrolledToTop(false);
      }
    }
  };

  const loadingStatus = () => {
    if (
      props.currentChannelExtraData &&
      props.currentChannelExtraData.fetchMessagesStatus === 'FETCHING'
    ) {
      return (
        <div className="chatMessaging__loadingStatus">
          {props.t('Loading Messages')}
        </div>
      );
    }
    return null;
  };

  const formatMessageDate = (messageDate: moment): string => {
    const today = moment().startOf('day');
    const yesterday = today.clone().subtract(1, 'days').startOf('day');
    if (messageDate.isSame(today, 'day')) {
      return props.t('Today');
    }
    if (messageDate.isSame(yesterday, 'day')) {
      return props.t('Yesterday');
    }

    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({ date: messageDate });
    }

    return messageDate.format('dddd, MMMM DD YYYY');
  };

  const getDateDivider = (previousDate: ?moment, message: ChatMessage) => {
    // Identify a change in the date
    // Show a date divider in the message list.
    if (message.date && message.date.isValid()) {
      const showDateDivider =
        !previousDate || !message.date.isSame(previousDate, 'day');

      if (showDateDivider) {
        return (
          <div
            className="chatMessaging__date"
            key={`date_message_${message.index}`}
          >
            {formatMessageDate(message.date)}
          </div>
        );
      }
    }
    return undefined;
  };

  const openChannelListsForMobile = () => {
    setSearchChannelMode(false);
    setShowChannelListsForMobile(true);
  };

  const shouldGeneralShowStatus = (): boolean => {
    if (
      !props.currentChannel ||
      props.generalStatus === 'ERROR' ||
      props.generalStatus === 'CONNECTING'
    ) {
      return true;
    }

    if (
      props.messages.length === 0 &&
      props.currentChannelExtraData &&
      props.currentChannelExtraData.fetchMessagesStatus !== 'FETCHING'
    ) {
      return true;
    }

    return false;
  };

  const getMessages = () => {
    if (
      !props.currentChannel ||
      props.generalStatus === 'ERROR' ||
      props.generalStatus === 'CONNECTING'
    ) {
      return null;
    }

    let previousAuthor: ?string;
    let previousDate: ?moment;
    return (
      props.messages.length > 0 &&
      props.messages.map((message) => {
        const dateDivider = getDateDivider(previousDate, message);
        previousDate = message.date;

        // Identify when the message is from a different user ( Starting a new chain ).
        // Or date has changed ( Using if dateDivider exists rather than duplicating date comparison )
        // As we style the first message in a chain from the same user differently.
        const firstMessageInChain =
          message.authorDetails?.authorName !== previousAuthor ||
          dateDivider !== undefined;
        if (message.authorDetails) {
          previousAuthor = message.authorDetails.authorName;
        }

        return (
          <Fragment key={`message_${message.index}_${message.messageType}`}>
            {dateDivider}
            <div
              ref={
                message.messageType !== 'LOG' &&
                message.index === scrollTargetMsgIndex
                  ? targetMessageRef
                  : null
              }
              className={classNames('chatMessaging__messageContainer', {
                'chatMessaging__messageContainer--me':
                  message.messageType === 'ME',
                'chatMessaging__messageContainer--them':
                  message.messageType === 'THEM',
                'chatMessaging__messageContainer--log':
                  message.messageType === 'LOG',
                'chatMessaging__messageContainer--firstInChainMe':
                  message.messageType === 'ME' && firstMessageInChain,
                'chatMessaging__messageContainer--firstInChainThem':
                  message.messageType === 'THEM' && firstMessageInChain,
              })}
            >
              <MessageBubble
                message={message}
                channelSid={props.currentChannel?.sid}
                channelMembers={props.currentChannelExtraData.members}
                firstMessageInChain={firstMessageInChain}
                displayReadStatus
                isDirectMessage={
                  props.currentChannel?.creationType === 'direct'
                }
                onViewMessageInfo={props.onViewMessageInfo}
              />
            </div>
          </Fragment>
        );
      })
    );
  };

  const getGeneralStatusText = () => {
    if (props.generalStatus === 'CONNECTING') {
      return (
        <div className="chatMessaging__generalStatus">
          {props.t('Connecting...')}
        </div>
      );
    }

    if (props.generalStatus === 'ERROR') {
      return (
        <div className="chatMessaging__generalStatus">
          {props.t('Failed to connect')}
        </div>
      );
    }

    if (!props.currentChannel) {
      return (
        <div className="chatMessaging__generalStatus">
          {props.t('Select a channel')}
        </div>
      );
    }

    if (
      props.messages.length === 0 &&
      props.currentChannelExtraData &&
      props.currentChannelExtraData.fetchMessagesStatus === 'FETCH_COMPLETE'
    ) {
      return (
        <div className="chatMessaging__generalStatus">
          {props.t('No messages yet')}
        </div>
      );
    }
    return null;
  };

  const getInputArea = () => {
    if (canSendMessages()) {
      return (
        <div className="chatMessaging__messageInputContainer">
          <ChatTextArea
            currentChannel={props.currentChannel}
            initialMessage={props.initialMessage}
            name="chatMessaging__textarea"
            canSendMessages={canSendMessages()}
            acceptedFileTypes={acceptedFileTypes}
            inProgressMedia={props.inProgressMedia}
            onMessageSend={props.onMessageSend}
            onSendMedia={props.onSendMedia}
            allowDropAttachments={props.activeSidePanel === null} // Don't allow user drop attachments if a sidePanel open
            connectionIssue={
              props.generalStatus !== 'CONNECTING' &&
              props.generalStatus !== 'CONNECTED'
            }
          />
        </div>
      );
    }
    return (
      <div className="chatMessaging__noInput">
        {props.currentChannel ? props.t('Read only') : ''}
      </div>
    );
  };

  return (
    <div className="chatContainer">
      <div
        className={classNames('chatContainer__channelLists', {
          'chatContainer__channelLists--open': showChannelListsForMobile,
        })}
      >
        <div className="chatContainer__channelListsHeader">
          {props.t('All messages')}
          <IconButton
            icon="icon-new-message"
            onClick={() => {
              setSearchChannelMode(!searchChannelMode);
              setShowChannelListsForMobile(false);
            }}
            isSmall
            isBorderless
          />
          <div className="chatContainer__channelListsClose">
            <IconButton
              icon="icon-close"
              onClick={() => {
                setShowChannelListsForMobile(false);
              }}
              isSmall
              isBorderless
            />
          </div>
        </div>
        <div className="chatContainer__channelListsOverflow">
          <div className="chatChannelSelector__unreadChannelList">
            <ChatChannelSelector
              title={props.t('Unread')}
              channels={[
                ...(props.userChannels || []),
                ...(props.directChannels || []),
              ]}
              userIdentity={props.userRole.identity}
              onSwitchedChannel={beginSwitchChannel}
              currentChannel={props.currentChannel}
              showUnreadCount
              showChannelCount
              bigIcons
              hideIfZeroChannels
              channelsFilter={(channel: ChatChannel) =>
                channel.unreadMessagesCount > 0
              }
            />
          </div>

          <div
            id="publicAllowedUserChannels"
            className="chatChannelSelector__userChannelList"
          >
            <ChatChannelSelector
              title={props.t('Channels')}
              plusButtonAction={
                props.userRole.permissions.canCreateDirectChannel
                  ? () => {
                      openCreateChannelSidePanel('private');
                    }
                  : undefined
              }
              channels={props.userChannels}
              userIdentity={props.userRole.identity}
              onSwitchedChannel={beginSwitchChannel}
              currentChannel={props.currentChannel}
              channelsFilter={(channel: ChatChannel) =>
                channel.unreadMessagesCount < 1
              }
            />
          </div>
          <div className="chatChannelSelector__directChannelList">
            <ChatChannelSelector
              title={props.t('Direct Messages')}
              plusButtonAction={
                props.userRole.permissions.canCreateDirectChannel
                  ? () => {
                      openCreateChannelSidePanel('direct');
                    }
                  : undefined
              }
              channels={props.directChannels}
              userIdentity={props.userRole.identity}
              onSwitchedChannel={beginSwitchChannel}
              currentChannel={props.currentChannel}
              channelsFilter={(channel: ChatChannel) =>
                channel.unreadMessagesCount < 1
              }
            />
          </div>
        </div>
      </div>
      <div className="chatMessaging">
        <ChatChannelHeader
          channel={props.currentChannel}
          currentChannelExtraData={props.currentChannelExtraData}
          showSearch={searchChannelMode}
          searchableItemGroups={props.searchableItemGroups}
          directChannels={props.directChannels}
          userRole={props.userRole}
          // Callbacks
          onLeaveChannel={props.onLeaveChannel}
          showChannelMembersModal={props.showChannelMembersModal}
          openChannelsListCallback={() => openChannelListsForMobile()}
          onSwitchedChannel={beginSwitchChannel}
          onDirectMessageUser={directMessageUser}
          showChannelMembersSidePanel={beginOpenChannelMembersSidePanel}
          showChannelSettingsSidePanel={openChannelSettings}
        />
        {loadingStatus()}
        <div
          className="chatMessaging__messageList"
          onScroll={updateScrollState}
        >
          {shouldGeneralShowStatus() && (
            <div className="chatMessaging__statusBackground">
              {getGeneralStatusText()}
            </div>
          )}
          {getMessages()}
          <div className="chatMessaging__bottom" />
          <span ref={scrollBottomRef} style={{ visibility: 'hidden' }} />
        </div>
        {getInputArea()}
      </div>
      {props.activeSidePanel === 'ChannelCreation' && (
        <ChatChannelCreationSidePanel
          userRole={props.userRole}
          staff={props.staff}
          squads={props.squads}
          isEditMode={false}
          channelType={channelCreationChannelType}
          onClose={() => dispatch(closeChannelCreationSidePanel())}
          onCreate={props.onCreateChannel}
          onSwitchedChannel={beginSwitchChannel}
          onRefreshChannelLists={props.onRefreshChannelLists}
        />
      )}
    </div>
  );
};

export const ChatTranslated = withNamespaces()(Chat);
export default Chat;
