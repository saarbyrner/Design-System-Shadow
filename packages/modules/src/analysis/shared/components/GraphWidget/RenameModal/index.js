// @flow
import { withNamespaces } from 'react-i18next';
import { AppStatus, ChooseNameModal } from '@kitman/components';
import type { ModalStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isRenameModalOpen: boolean,
  closeRenameModal: Function,
  value: ?string,
  onConfirm: Function,
  onChange: Function,
  feedbackModalStatus: ModalStatus,
  feedbackModalMessage: ?string,
  hideFeedbackModal: Function,
};

const RenameModal = (props: I18nProps<Props>) => (
  <div>
    <ChooseNameModal
      title={props.t('Rename Graph')}
      label={props.t('Graph Name')}
      isOpen={props.isRenameModalOpen}
      closeModal={() => props.closeRenameModal()}
      value={props.value || ''}
      onChange={(value) => props.onChange(value)}
      onConfirm={(value) => props.onConfirm(value)}
      actionButtonText={props.t('Confirm')}
      customEmptyMessage={props.t('A name is required.')}
      maxLength={255}
    />
    <AppStatus
      status={props.feedbackModalStatus}
      message={props.feedbackModalMessage}
      hideConfirmation={props.hideFeedbackModal}
      close={props.hideFeedbackModal}
    />
  </div>
);

export default RenameModal;
export const RenameModalTranslated = withNamespaces()(RenameModal);
