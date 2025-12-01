// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { LegacyModal as Modal, Select, TextButton } from '@kitman/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AvailableIntegrationListItem } from '../../types';

type Props = {
  availableIntegrations: Array<AvailableIntegrationListItem>,
  onClickCloseModal: Function,
  isOpen: boolean,
};

function AddIntegrationModal(props: I18nProps<Props>) {
  const locationAssign = useLocationAssign();
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const getAvailableIntegrations = () => {
    return props.availableIntegrations.map((availableIntegration) => {
      return {
        value: availableIntegration.url,
        label: availableIntegration.name,
      };
    });
  };

  return (
    <Modal
      title={props.t('Select vendor')}
      isOpen={props.isOpen}
      close={() => props.onClickCloseModal()}
      style={{ overflow: 'visible', height: '224px' }}
      width={344}
    >
      <div className="addIntegrationModal">
        <div className="addIntegrationModal__dropdown">
          <Select
            options={getAvailableIntegrations()}
            onChange={(value) => setSelectedIntegration(value)}
            value={selectedIntegration}
            placeholder={props.t('Select vendor...')}
          />
        </div>
        <div className="addIntegrationModal__actions">
          <TextButton
            text={props.t('Cancel')}
            type="textOnly"
            size="small"
            onClick={() => props.onClickCloseModal()}
          />
          <TextButton
            text={props.t('Setup')}
            type="primary"
            size="small"
            onClick={() => {
              if (selectedIntegration) {
                locationAssign(`/settings/integrations/${selectedIntegration}`);
              }
            }}
            isDisabled={!selectedIntegration}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddIntegrationModal;
export const AddIntegrationModalTranslated =
  withNamespaces()(AddIntegrationModal);
