// @flow
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import ChatAvatar from '../ChatAvatar';
import type { MessagingMember } from '../../types';

type Props = {
  isOpen: boolean,
  close: Function,
  members: Array<MessagingMember>,
};

const MessagingMembersModal = (props: I18nProps<Props>) => {
  const getTitle = () => {
    return props.t('Channel members');
  };

  const displayMembers = () => {
    return (
      props.members &&
      props.members.map((member: MessagingMember) => {
        return (
          <div
            key={member.messagingIdentity}
            className="row messagingMembersModal__row"
          >
            <ChatAvatar
              userIdentity={member.messagingIdentity}
              friendlyName={member.friendlyName}
            />
            <span>
              {member.friendlyName
                ? member.friendlyName
                : member.messagingIdentity}
              {member.channelRole === 'channel admin' &&
                ` (${props.t('Channel admin')})`}
            </span>
          </div>
        );
      })
    );
  };

  return (
    <Modal isOpen={props.isOpen} close={props.close} title={getTitle()}>
      <div className="messagingMembersModal">
        <div className="row messagingMembersModal__titleRow">
          <div className="col-md-4">{props.t('Member')}</div>
        </div>
        <div className="messagingMembersModal__membersSection">
          {displayMembers()}
        </div>
        <div className="messagingMembersModal__footer" />
      </div>
    </Modal>
  );
};

export const MessagingMembersModalTranslated = withNamespaces()(
  MessagingMembersModal
);
export default MessagingMembersModal;
