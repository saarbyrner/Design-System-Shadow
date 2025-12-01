// @flow
import { useSelector } from 'react-redux';
import { Modal } from '@kitman/components';
import { Stack, Button } from '@kitman/playbook/components';
import RichTextDisplay from '@kitman/components/src/richTextDisplay/index';
import i18n from '@kitman/common/src/utils/i18n';

import { getModal } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';

const GridActionsModal = () => {
  const modal = useSelector(getModal);

  const { onConfirm, handleModalClose } = useGridActions();

  const handleOnConfirm = () => {
    onConfirm(modal.action);
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onPressEscape={handleModalClose}
      close={handleModalClose}
    >
      <Modal.Header>
        <Modal.Title>{modal?.text?.header}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {modal?.text?.body && (
          <RichTextDisplay value={modal?.text?.body} isAbbreviated={false} />
        )}
      </Modal.Content>
      {modal?.text?.secondaryBody && (
        <Modal.Content>
          <RichTextDisplay
            value={modal?.text?.secondaryBody}
            isAbbreviated={false}
          />
        </Modal.Content>
      )}
      <Modal.Footer>
        <Stack direction="row">
          <Button onClick={() => handleModalClose(true)} color="secondary">
            {i18n.t('Cancel')}
          </Button>
          <Button onClick={handleOnConfirm}>
            {modal?.text?.ctaText ?? i18n.t('Confirm')}
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default GridActionsModal;
