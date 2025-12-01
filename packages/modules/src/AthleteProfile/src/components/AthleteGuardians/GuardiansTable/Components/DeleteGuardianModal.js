// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, TextButton } from '@kitman/components';
import { Box, Typography } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useShowToasts } from '@kitman/common/src/hooks';
import { useGetAthleteIdFromPath } from '@kitman/modules/src/HumanInput/hooks/helperHooks/useGetAthleteIdFromPath';
import { type DeleteGuardianModalState } from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';
import { getDeleteGuardianFormFactory } from '@kitman/modules/src/AthleteProfile/redux/selectors/index';
import type {
  DeleteGuardianRequestBody,
  GenericGuardian,
} from '@kitman/modules/src/AthleteProfile/redux/types/index';
import { useDeleteGuardianMutation } from '@kitman/services/src/services/humanInput/humanInput';

type Props = {
  isOpen: boolean,
  onClose: () => void,
};

export type TranslatedProps = I18nProps<Props>;

const DeleteGuardianModal = ({ isOpen, t, onClose }: TranslatedProps) => {
  const athleteId = useGetAthleteIdFromPath();

  const { id, name, email } = useSelector<DeleteGuardianModalState>(
    getDeleteGuardianFormFactory()
  );

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: 'CREATE_NOTIFICATION_TRIGGERS_ERROR_TOAST_ID',
    successToastId: 'CREATE_NOTIFICATION_TRIGGERS_SUCCESS_TOAST_ID',
  });

  const [deleteGuardian, { isLoading: isDeleteGuardianLoading }]: [
    (requestBody: DeleteGuardianRequestBody) => {
      unwrap: () => Promise<GenericGuardian>,
    },
    { isLoading: boolean }
  ] = useDeleteGuardianMutation();

  const handleDeleteButton = async () => {
    const actionPayload = {
      id,
    };

    deleteGuardian({
      athleteId,
      ...actionPayload,
    })
      .unwrap()
      .then(() => {
        showSuccessToast({
          translatedTitle: t('Guardian deleted successfully'),
        });
        onClose();
      })
      .catch(() => {
        showErrorToast({
          translatedTitle: t(
            'Error deleting the new guardian. Please try again.'
          ),
        });
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onPressEscape={() => onClose()}
      close={() => onClose()}
    >
      <Modal.Header>
        <Modal.Title>{t('Delete guardian')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <Box>
          <Typography variant="body2" color="textSecondary">
            {t('You are about to delete the following guardian:')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {name} ({email})
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {t(
            'Are you sure you want to continue? This action cannot be undone.'
          )}
        </Typography>
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          text={t('Cancel')}
          onClick={() => onClose()}
          kitmanDesignSystem
        />
        <TextButton
          text={t('Delete')}
          type="primaryDestruct"
          isLoading={isDeleteGuardianLoading}
          onClick={() => {
            handleDeleteButton();
          }}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const DeleteGuardianModalTranslated =
  withNamespaces()(DeleteGuardianModal);
export default DeleteGuardianModal;
