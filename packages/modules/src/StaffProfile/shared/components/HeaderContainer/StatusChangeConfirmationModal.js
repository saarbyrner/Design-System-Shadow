// @flow
import { withNamespaces } from 'react-i18next';
import { capitalize } from 'lodash';
import type { ComponentType } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@kitman/playbook/components';
import { zIndices } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { HumanInputUser } from '@kitman/modules/src/HumanInput/types/forms';
import { getModalTranslations } from './utils/helpers';
import { modalDescriptionId, modalTitleId } from './utils/consts';

type Props = {
  user: HumanInputUser,
  shouldShowModal: boolean,
  isUpdatingUserStatus: boolean,
  closeModal: () => void,
  onConfirm: () => Promise<void>,
};

const StatusChangeConfirmationModal = ({
  user,
  shouldShowModal,
  isUpdatingUserStatus,
  closeModal,
  onConfirm,
  t,
}: I18nProps<Props>) => {
  const { fullname, is_active: isActive } = user;

  const title = isActive
    ? t('Deactivate {{fullname}}', { fullname })
    : t('Activate {{fullname}}', { fullname });

  const dialogContent = isActive
    ? t('{{fullname}} will not have access to IP', { fullname })
    : t('{{fullname}} will have access to IP', { fullname });

  const modalTranslations = getModalTranslations(t);
  const actionText = isActive
    ? modalTranslations.deactivate
    : modalTranslations.activate;

  return (
    <Dialog
      open={shouldShowModal}
      onClose={closeModal}
      aria-labelledby={modalTitleId}
      aria-describedby={modalDescriptionId}
      sx={{ zIndex: zIndices.toastDialog }}
    >
      <DialogTitle id={modalTitleId}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={modalDescriptionId}>
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={closeModal}>
          {modalTranslations.cancel}
        </Button>
        <Button onClick={onConfirm} autoFocus color="warning">
          {isUpdatingUserStatus ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            capitalize(actionText)
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const StatusChangeConfirmationModalTranslated: ComponentType<Props> =
  withNamespaces()(StatusChangeConfirmationModal);
export default StatusChangeConfirmationModal;
