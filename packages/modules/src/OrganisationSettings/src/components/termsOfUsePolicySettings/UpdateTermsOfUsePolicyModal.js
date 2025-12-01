// @flow
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onSave: Function,
  onClose: Function,
};

const UpdateTermsOfUsePolicyModal = (props: I18nProps<Props>) => {
  return (
    <Modal
      isOpen={props.isOpen}
      close={props.onClose}
      title={props.t('Update Terms of Use policy')}
      width={600}
      style={{ minHeight: 'auto' }}
    >
      <div className="termsOfUsePolicyModal">
        <div className="termsOfUsePolicyModal__content">
          {props.t(
            'You will create a new revision of your Terms of Use policy by clicking Save. The latest Terms of Use policy will be visible to your website users before logging in.'
          )}
        </div>
        <div className="termsOfUsePolicyModal__actions">
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

export default UpdateTermsOfUsePolicyModal;
export const UpdateTermsOfUsePolicyModalTranslated = withNamespaces()(
  UpdateTermsOfUsePolicyModal
);
