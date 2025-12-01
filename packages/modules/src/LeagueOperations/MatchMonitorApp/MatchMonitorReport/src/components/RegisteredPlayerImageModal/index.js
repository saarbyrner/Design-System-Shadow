// @flow
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Avatar, Box, Button } from '@kitman/playbook/components';
import { Modal } from '@kitman/components';
import type { RegisteredPlayerImageModalData } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';
import { getIsRegisteredPlayerImageModalOpen } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';

type Props = {
  imageModalData: RegisteredPlayerImageModalData,
  onClose: Function,
};

const RegisteredPlayerImageModal = (props: I18nProps<Props>) => {
  const { t, imageModalData, onClose } = props;
  const isRegisteredPlayerImageModalOpen = useSelector(
    getIsRegisteredPlayerImageModalOpen
  );
  return (
    <Modal
      isOpen={isRegisteredPlayerImageModalOpen}
      width="small"
      onPressEscape={onClose}
      close={onClose}
    >
      <Modal.Header>
        <Modal.Title>{imageModalData?.playerName}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            src={imageModalData?.playerImage}
            sx={{ width: 214, height: 214 }}
            alt={`${imageModalData?.playerName} Avatar`}
          />
        </Box>
      </Modal.Content>
      <Modal.Footer>
        <Button onClick={onClose}>{t('Close')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const RegisteredPlayerImageModalTranslated = withNamespaces()(
  RegisteredPlayerImageModal
);
export default RegisteredPlayerImageModal;
