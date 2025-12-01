// @flow
import { useState } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import type { Option } from '@kitman/components/src/Select';
import { Modal, TextButton, SelectAndFreetext } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

type Props = {
  isOpen: boolean,
  rejectOptions: Array<Option>,
  onReject: (?Option) => void,
  closeModal: () => void,
};

const MatchRequestRejectModal = ({
  isOpen,
  rejectOptions,
  onReject,
  closeModal,
  t,
}: I18nProps<Props>) => {
  const { preferences } = usePreferences();
  const [rejectOption, setRejectOption] = useState<string>('');
  const [rejectFreeText, setRejectFreeText] = useState<string>('');

  const handleOnRejectReason = () => {
    const foundOption = rejectOptions.find(
      (option) => option.value === rejectOption
    );

    if (foundOption?.requiresText) {
      onReject({ ...foundOption, label: rejectFreeText });
    } else {
      onReject(foundOption);
    }
  };

  return (
    <Modal onPressEscape={closeModal} isOpen={isOpen} close={closeModal}>
      <Modal.Header>
        <Modal.Title>{t('Reject Access')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <SelectAndFreetext
          selectLabel={t('Reason')}
          options={rejectOptions}
          selectedField={rejectOption}
          onSelectedField={setRejectOption}
          currentFreeText={rejectFreeText}
          onUpdateFreeText={setRejectFreeText}
          invalidFields={false}
          selectContainerStyle={css`
            margin-bottom: 10px;
          `}
          featureFlag={preferences?.scout_access_management}
        />
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          text={t('Cancel')}
          type="secondary"
          onClick={closeModal}
          kitmanDesignSystem
        />
        <TextButton
          text={t('Save')}
          isDisabled={!rejectOption}
          type="primary"
          onClick={() => {
            handleOnRejectReason();
            closeModal();
          }}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default MatchRequestRejectModal;
export const MatchRequestRejectModalTranslated = withNamespaces()(
  MatchRequestRejectModal
);
