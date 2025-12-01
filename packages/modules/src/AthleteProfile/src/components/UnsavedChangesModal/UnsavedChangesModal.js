// @flow
import { withNamespaces } from 'react-i18next';
import { zIndices } from '@kitman/common/src/variables';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  showModal: boolean,
  handleCloseModal: Function,
  handleDiscardChanges: Function,
};

const UnsavedChangesModal = (props: I18nProps<Props>) => {
  const { showModal, handleCloseModal, handleDiscardChanges } = props;

  return (
    <Dialog
      open={showModal}
      onClose={handleCloseModal}
      aria-labelledby="unsaved-changes-dialog-title"
      aria-describedby="unsaved-changes-dialog-description"
      sx={{ zIndex: zIndices.toastDialog }}
    >
      <DialogTitle id="unsaved-changes-dialog-title">
        {props.t('Unsaved changes')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="unsaved-changes-dialog-description">
          {props.t(
            'Are you sure you want to leave and discard the changes? Unsaved changes will be lost.'
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleCloseModal}
        >
          {props.t('Cancel')}
        </Button>
        <Button onClick={handleDiscardChanges} autoFocus>
          {props.t('Discard Changes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const UnsavedChangesModalTranslated =
  withNamespaces()(UnsavedChangesModal);
export default UnsavedChangesModal;
