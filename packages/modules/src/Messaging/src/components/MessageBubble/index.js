// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import type { MediaDetails, TwilioMedia } from '@kitman/common/src/types/Media';
import { InfoTooltip } from '@kitman/components';
import {
  getContentTypeIcon,
  checkExpirationFromUrl,
} from '@kitman/common/src/utils/mediaHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { refreshMediaMessage, handleNewMessage } from '../../actions';
import styling from './style';
import type {
  MessagingMember,
  ChatMessage,
  ChatAuthorDetails,
} from '../../types';

export type Props = {
  message: ChatMessage,
  channelSid: string,
  channelMembers?: Array<MessagingMember>,
  isDirectMessage?: boolean,
  displayReadStatus: boolean,
  firstMessageInChain: boolean,
  messageMediaChangedTime?: ?string,
  allRoundCorners?: boolean,
  onViewMessageInfo?: Function,
};

const MessageBubble = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const handleFileClick = (event: SyntheticMouseEvent<HTMLAnchorElement>) => {
    if (checkExpirationFromUrl(event.currentTarget.href)) {
      // Link is expired and needs refresh
      event.preventDefault();

      dispatch(
        refreshMediaMessage(props.channelSid, event.currentTarget.dataset.sid)
      )
        .then((url) => {
          window.open(url, '_blank');
        })
        .catch(() => {
          dispatch(
            handleNewMessage(props.t('Failed to update media message'), 'LOG')
          );
        });
    }
  };

  const handleMediaPlayEvent = (event: SyntheticEvent<HTMLMediaElement>) => {
    if (checkExpirationFromUrl(event.currentTarget.src)) {
      // Link is expired and needs refresh
      event.preventDefault();
      dispatch(
        refreshMediaMessage(props.channelSid, event.currentTarget.dataset.sid)
      ).catch(() => {
        dispatch(
          handleNewMessage(props.t('Failed to update media message'), 'LOG')
        );
      });
    }
  };

  const handleExpiredMediaClicked = (event: SyntheticEvent<HTMLDivElement>) => {
    // Link is expired and needs refresh
    event.preventDefault();
    dispatch(
      refreshMediaMessage(props.channelSid, event.currentTarget.dataset.sid)
    ).catch(() => {
      dispatch(
        handleNewMessage(props.t('Failed to update media message'), 'LOG')
      );
    });
  };

  const style = styling(props);

  const addMedia = (
    messageSid: string,
    media: TwilioMedia,
    mediaDetails: MediaDetails
  ) => {
    let icon;
    switch (mediaDetails.contentClass) {
      case 'office':
      case 'file':
        icon = undefined;
        break;
      default:
        icon = <span className={getContentTypeIcon(media.contentType)} />;
    }

    let contentBlock;

    if (mediaDetails.isWebDisplayable) {
      switch (mediaDetails.contentClass) {
        case 'image':
          contentBlock = (
            <img
              src={mediaDetails.url}
              alt={media.filename}
              css={style.messageImage}
            />
          );
          break;
        case 'video':
          if (mediaDetails.hasExpired) {
            contentBlock = (
              <div
                css={style.expiredVideo}
                data-sid={messageSid}
                onClick={handleExpiredMediaClicked}
              >
                <span css={style.mediaIcon} className="icon-restore" />
                {props.t('Load Video')}
              </div>
            );
          } else {
            contentBlock = (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={mediaDetails.url}
                controls
                data-sid={messageSid}
                onPlay={handleMediaPlayEvent}
              />
            );
          }
          break;
        case 'audio':
          if (mediaDetails.hasExpired) {
            contentBlock = (
              <div
                css={style.expiredAudio}
                data-sid={messageSid}
                onClick={handleExpiredMediaClicked}
              >
                <span css={style.mediaIcon} className="icon-restore" />
                {props.t('Load Audio')}
              </div>
            );
          } else {
            contentBlock = (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio
                src={mediaDetails.url}
                controls
                data-sid={messageSid}
                onPlay={handleMediaPlayEvent}
              />
            );
          }
          break;
        default:
          contentBlock = (
            <a
              css={style.mediaLink}
              href={mediaDetails.url}
              download={media.filename}
              target="_blank"
              rel="noopener noreferrer"
              data-sid={messageSid}
              onClick={handleFileClick}
            >
              <div
                css={style.mediaIcon}
                className={`${getContentTypeIcon(media.contentType)}`}
              />
            </a>
          );
      }
    } else {
      contentBlock = (
        <a
          css={style.mediaLink}
          href={mediaDetails.url}
          download={media.filename}
          target="_blank"
          rel="noopener noreferrer"
          data-sid={messageSid}
          onClick={handleFileClick}
        >
          <div
            css={style.mediaIcon}
            className={`${getContentTypeIcon(media.contentType)}`}
          />
        </a>
      );
    }

    return (
      <>
        <div css={style.mediaHeader}>
          <a
            css={style.mediaLink}
            href={mediaDetails.url}
            download={media.filename}
            target="_blank"
            rel="noopener noreferrer"
            data-sid={messageSid}
            onClick={handleFileClick}
          >
            {icon}
            <span css={style.mediaName}>{media.filename}</span>
          </a>

          <InfoTooltip
            content={`${props.t('Size')} : ${mediaDetails.friendlyMediaSize}`}
          >
            <span className="icon-info" />
          </InfoTooltip>
        </div>
        <div css={style.mediaHolder}>{contentBlock}</div>
      </>
    );
  };

  const getDisplayableAuthorName = (
    authorDetails: ChatAuthorDetails
  ): string => {
    if (authorDetails.friendlyName === 'REMOVED_MEMBER') {
      // TODO: later will async fetch the correct userDescriptor and build up a dict for identity to friendlyName lookup
      return props.t('Removed member');
    }

    return authorDetails.friendlyName || authorDetails.authorName;
  };

  const getMessageReadStatus = (messageIndex: number) => {
    const membersCount = props.channelMembers?.length || 1;
    if (membersCount < 2) {
      return undefined; // Single member channels dont need read status
    }
    let readByMembersCount = 0;

    if (props.channelMembers) {
      readByMembersCount = props.channelMembers.reduce(
        (previousValue, member) =>
          previousValue +
          (member.lastReadMessageIndex &&
          member.lastReadMessageIndex >= messageIndex
            ? 1
            : 0),
        0
      );
    }

    readByMembersCount = Math.max(readByMembersCount, 1); // Sending user has to have read it, so avoid impact of a delay in getting update.

    const readByAll = readByMembersCount === membersCount;
    if (props.isDirectMessage) {
      return (
        <span
          onClick={() =>
            props.onViewMessageInfo && props.onViewMessageInfo(messageIndex)
          }
          css={style.messageReadStatus}
          className={readByAll ? 'icon-check' : undefined}
        />
      );
    }

    return readByAll ? (
      <span
        onClick={() =>
          props.onViewMessageInfo && props.onViewMessageInfo(messageIndex)
        }
        css={style.messageReadStatus}
        className="icon-check"
      />
    ) : (
      <span
        onClick={() =>
          props.onViewMessageInfo && props.onViewMessageInfo(messageIndex)
        }
        css={style.messageReadStatus}
      >{`(${readByMembersCount - 1}/${membersCount - 1})`}</span>
    );
  };

  return (
    <div css={style.message}>
      <div css={style.messageHeader}>
        {props.message.messageType !== 'LOG' &&
          props.message.messageType !== 'ME' &&
          props.firstMessageInChain &&
          props.message.authorDetails && (
            <span css={style.messageAuthor}>
              {getDisplayableAuthorName(props.message.authorDetails)}
            </span>
          )}
      </div>
      <span css={style.messageBody}>
        {props.message.body}
        {props.message.sid &&
          props.message.mediaDetails &&
          props.message.media &&
          addMedia(
            props.message.sid,
            props.message.media,
            props.message.mediaDetails
          )}
      </span>
      <span css={style.messageFooter}>
        {props.message.time && (
          <span css={style.messageTime}>{props.message.time}</span>
        )}
        {props.displayReadStatus &&
          props.message.messageType !== 'LOG' &&
          getMessageReadStatus(props.message.index)}
      </span>
    </div>
  );
};

export const MessageBubbleTranslated = withNamespaces()(MessageBubble);
export default MessageBubble;
