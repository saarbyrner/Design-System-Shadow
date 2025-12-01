// @flow
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onClickCloseModal: Function,
  onClickUnlink: Function,
  isOpen: boolean,
};

function UnlinkIntegrationModal(props: I18nProps<Props>) {
  return (
    <Modal
      title={props.t('Unlink integration?')}
      isOpen={props.isOpen}
      close={() => props.onClickCloseModal()}
      style={{ overflow: 'visible', height: '180px' }}
      width={600}
    >
      <div className="unlinkIntegrationModal">
        <p className="unlinkIntegrationModal__description">
          {props.t(
            'Removing this integration will result in you no longer being able to import this integrations data. All previous data will be retained.'
          )}
        </p>
        <div className="unlinkIntegrationModal__actions">
          <TextButton
            text={props.t('Cancel')}
            type="textOnly"
            size="small"
            onClick={() => props.onClickCloseModal()}
          />
          <TextButton
            text={props.t('Unlink')}
            type="danger"
            size="small"
            onClick={() => props.onClickUnlink()}
          />
        </div>
      </div>
    </Modal>
  );
}

export default UnlinkIntegrationModal;
export const UnlinkIntegrationModalTranslated = withNamespaces()(
  UnlinkIntegrationModal
);
