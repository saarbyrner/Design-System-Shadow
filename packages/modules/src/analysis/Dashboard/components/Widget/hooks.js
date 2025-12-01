// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { deleteWidget } from '../../redux/actions/widgets';
import { type Props as ConfirmDialogProps } from '../ConfirmDialog';

export const useDeleteDialog = (
  widgetId: number,
  widgetName: string
): { openDeleteDialog: Function, dialogProps: ConfirmDialogProps } => {
  const dispatch = useDispatch();
  const [isOpen, setIsDialogOpen] = useState(false);
  const openDeleteDialog = () => {
    setIsDialogOpen(true);
  };
  const cancelDelete = () => {
    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    dispatch(deleteWidget(widgetId));
  };
  return {
    openDeleteDialog,
    dialogProps: {
      isOpen,
      title: i18n.t('Confirm widget deletion'),
      buttonContent: {
        success: i18n.t('Delete "{{widgetName}}"', {
          widgetName,
        }),
      },
      content: i18n.t('Are you sure you want to delete "{{widgetName}}"?', {
        widgetName,
      }),
      onCancel: cancelDelete,
      onSuccess: confirmDelete,
    },
  };
};
