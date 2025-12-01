// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@kitman/playbook/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';

export type Props = {
  isOpen: boolean,
  onCancel: () => void,
  onConfirm: () => void,
};

const UnlistedMedWarningDialog = ({
  t,
  isOpen,
  onCancel,
  onConfirm,
}: I18nProps<Props>) => {
  return (
    <Dialog
      disableEscapeKeyDown
      open={isOpen}
      onClose={(event, reason) => {
        if (reason && reason === 'backdropClick') {
          return;
        }
        onCancel();
      }}
      fullWidth
    >
      <DialogTitle>{t('Unlisted Medication Warning')}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2">
          {t(
            'As this is an unlisted medication please take extra care when logging.'
          )}
        </DialogContentText>
        <DialogContentText sx={{ fontWeight: '600' }} variant="body2">
          {t(
            'Drug to drug and drug allergy checks will not be performed for this medication.'
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          {t('Cancel')}
        </Button>
        <Button onClick={onConfirm}>{t('Accept')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export const UnlistedMedWarningDialogTranslated: ComponentType<Props> =
  withNamespaces()(UnlistedMedWarningDialog);
export default UnlistedMedWarningDialog;
