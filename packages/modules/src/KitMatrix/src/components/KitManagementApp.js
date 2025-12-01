// @flow
import { useDispatch, useSelector } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import i18n from '@kitman/common/src/utils/i18n';
import { ConfirmationModal, Typography } from '@kitman/playbook/components';
import {
  useUpdateKitMatrixMutation,
  useBulkUpdateKitMatrixMutation,
} from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';

import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';

import {
  DEACTIVATE_KIT,
  ACTIVATE_KIT,
  BULK_ACTIVATE_KIT,
  BULK_DEACTIVATE_KIT,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTheme } from '@kitman/playbook/hooks';
import {
  selectKitManagementSelectedRow,
  selectSelectedRows,
  selectKitManagementPanel,
  selectKitManagementModal,
} from '@kitman/modules/src/KitMatrix/src/redux/selectors/kitManagementSelectors';
import {
  onSetSelectedRow,
  onTogglePanel,
  onToggleModal,
} from '@kitman/modules/src/KitMatrix/src/redux/slice/kitManagementSlice';
import { KitManagementHeaderTranslated as KitManagementHeader } from './KitManagementHeader';
import AddKitMatrixDrawer from './AddKitMatrixDrawer';
import KitManagementTabs from './KitManagementTabs';
import useKitManagementSuccessToast from '../hooks/useKitManagementSuccessToast';

const getModalTexts = () => ({
  deactivate: i18n.t(
    'By deactivating this kit, it will be no longer available to be used for future matches at a league and club level.'
  ),
  activate: i18n.t(
    'By activating this kit, it will be available to be used for future matches at a league and club level.'
  ),
});

const getModalMessages = () => {
  const MODAL_TEXTS = getModalTexts();
  return {
    deactivate: {
      title: i18n.t('Deactivate kit?'),
      ctaButton: i18n.t('Save'),
      dialogContent: (
        <Typography variant="body2">{MODAL_TEXTS.deactivate}</Typography>
      ),
    },
    activate: {
      title: i18n.t('Activate kit?'),
      ctaButton: i18n.t('Save'),
      dialogContent: (
        <Typography variant="body2">{MODAL_TEXTS.activate}</Typography>
      ),
    },
  };
};

const KitManagementApp = () => {
  const dispatch = useDispatch();
  const getSelectedRows = useSelector(selectSelectedRows);
  const selectedRow = useSelector(selectKitManagementSelectedRow);
  const kitManagementPanel = useSelector(selectKitManagementPanel);
  const kitManagementModal = useSelector(selectKitManagementModal);

  const theme = useTheme();
  const isMobileNavigation = useMediaQuery(theme.breakpoints.down('lg'));
  const headerOffset = isMobileNavigation ? 10 : 0;
  const selectedRowIds = getSelectedRows?.map((row) => row.id);
  const [updateKitMatrix, { isLoading: isDeletingKit }] =
    useUpdateKitMatrixMutation();
  const [bulkUpdateKitMatrix] = useBulkUpdateKitMatrixMutation();
  const { toastDialog } = useKitManagementSuccessToast();

  const handleCloseToggleModal = () => {
    dispatch(onToggleModal({ isOpen: !kitManagementModal.isOpen }));
    dispatch(onSetSelectedRow({ selectedRow: null }));
  };

  const handleOpenTogglePanel = () => {
    dispatch(onTogglePanel({ isOpen: true }));
  };
  const handleCloseTogglePanel = () => {
    dispatch(onTogglePanel({ isOpen: !kitManagementPanel.isOpen }));
    dispatch(onSetSelectedRow({ selectedRow: null }));
  };
  const closeDeletionModal = () => {
    dispatch(onToggleModal({ isOpen: false }));
    dispatch(onSetSelectedRow({ selectedRow: null }));
  };

  const onDeactivateKit = async () => {
    try {
      await updateKitMatrix({
        id: selectedRow?.id,
        updates: { archived: true },
      }).unwrap();
      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: i18n.t('Kit deactivated.'),
        })
      );
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: i18n.t("We couldn't deactivate the kit."),
        })
      );
    }

    closeDeletionModal();
  };

  const onBulkActionKit = async (archived: boolean) => {
    // get the toast title based on the archived status
    const successToastTitle = archived
      ? i18n.t('Deactivated successfully.')
      : i18n.t('Activated successfully.');
    const errorToastTitle = archived
      ? i18n.t('Failed to deactivate.')
      : i18n.t('Failed to activate.');

    try {
      await bulkUpdateKitMatrix({
        kit_matrix_ids: selectedRowIds,
        archived,
      }).unwrap();

      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: successToastTitle,
        })
      );
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: errorToastTitle,
        })
      );
    }
    closeDeletionModal();
  };

  const onActivateKit = async () => {
    try {
      await updateKitMatrix({
        id: selectedRow?.id,
        updates: { archived: false },
      }).unwrap();
      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: 'Kit activated.',
        })
      );
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: i18n.t('Failed to activate.'),
        })
      );
    }

    closeDeletionModal();
  };

  const renderConfirmationModal = () => {
    const modalConfigs = (mode: string) => {
      const modalMessages = getModalMessages();
      switch (mode) {
        case DEACTIVATE_KIT:
          return { ...modalMessages.deactivate, onConfirm: onDeactivateKit };
        case ACTIVATE_KIT:
          return { ...modalMessages.activate, onConfirm: onActivateKit };
        case BULK_ACTIVATE_KIT:
          return {
            ...modalMessages.activate,
            onConfirm: () => onBulkActionKit(false),
          };
        case BULK_DEACTIVATE_KIT:
          return {
            ...modalMessages.deactivate,
            onConfirm: () => onBulkActionKit(true),
          };
        default:
          return null;
      }
    };

    const config = modalConfigs(kitManagementModal.mode);

    if (!config) {
      return null;
    }

    return (
      <ConfirmationModal
        isModalOpen={kitManagementModal.isOpen}
        isLoading={isDeletingKit}
        translatedText={{
          title: config.title,
          actions: {
            ctaButton: config.ctaButton,
            cancelButton: i18n.t('Cancel'),
          },
        }}
        dialogContent={config.dialogContent}
        onClose={handleCloseToggleModal}
        onCancel={handleCloseToggleModal}
        onConfirm={config.onConfirm}
        maxWidth="xs"
      />
    );
  };

  return (
    <PageLayout>
      <PageLayout.Content>
        <PageLayout.Header withTabs headerOffset={headerOffset}>
          <KitManagementHeader setIsDrawerOpen={handleOpenTogglePanel} />
        </PageLayout.Header>
        <KitManagementTabs />
        <AddKitMatrixDrawer
          isOpen={kitManagementPanel.isOpen}
          onClose={handleCloseTogglePanel}
          data={selectedRow}
        />

        {renderConfirmationModal()}
        {toastDialog}
      </PageLayout.Content>
    </PageLayout>
  );
};

export default KitManagementApp;
