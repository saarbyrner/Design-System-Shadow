// @flow

import type { ComponentType, Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@kitman/playbook/components';

export type Props = {
  title: Node,
  content: Node,
  buttonContent: {
    success?: Node,
    cancel?: Node,
  },
  isOpen: boolean,
  onCancel: Function,
  onSuccess: Function,
};

function ConfirmDialog(props: I18nProps<Props>) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onCancel}
      aria-labelledby="confirm-dialog"
      aria-describedby="confirm-dialog-content"
    >
      <DialogTitle id="confirm-dialog">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-content">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} variant="text" autoFocus>
          {props.buttonContent.cancel || props.t('Cancel')}
        </Button>
        <Button onClick={props.onSuccess}>
          {props.buttonContent.success || props.t('Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const ConfirmDialogTranslated: ComponentType<Props> =
  withNamespaces()(ConfirmDialog);
export default ConfirmDialog;
