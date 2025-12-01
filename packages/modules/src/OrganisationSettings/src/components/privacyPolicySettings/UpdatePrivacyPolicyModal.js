// @flow
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onSave: Function,
  onClose: Function,
};

const UpdatePrivacyPolicyModal = (props: I18nProps<Props>) => {
  return (
    <Modal
      isOpen={props.isOpen}
      close={props.onClose}
      title={props.t('Update privacy policy')}
      width={600}
      style={{ minHeight: 'auto' }}
    >
      <div className="privacyPolicyModal">
        <div className="privacyPolicyModal__content">
          {props.t(
            'This update will prompt all athletes to acknowledge the new privacy policy text in the Athlete app.'
          )}
        </div>
        <div className="privacyPolicyModal__actions">
          <TextButton
            text={props.t('Cancel')}
            type="secondary"
            onClick={props.onClose}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Save')}
            type="primary"
            onClick={props.onSave}
            kitmanDesignSystem
          />
        </div>
      </div>
    </Modal>
  );
};

export default UpdatePrivacyPolicyModal;
export const UpdatePrivacyPolicyModalTranslated = withNamespaces()(
  UpdatePrivacyPolicyModal
);
