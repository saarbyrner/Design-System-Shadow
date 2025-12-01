// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Node } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {
  ElectronicFile,
  ExistingContact,
  RowAction,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import { selectSelectedMenuItem } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  updateOpen,
  updateData,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactDrawerSlice';
import {
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useUpdateContactsArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  clearAnyExistingElectronicFileToast,
  getRowActions,
} from '@kitman/modules/src/ElectronicFiles/shared/utils';
import {
  ACTION_KEY,
  archiveSuccessToast,
  unarchiveSuccessToast,
  archiveContactSuccessToast,
  unarchiveContactSuccessToast,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { Tooltip, GridActionsCellItem } from '@kitman/playbook/components';

export type ReturnType = {
  rowActions: Array<RowAction>,
  rowActionComponents: Array<Node>,
};

const useRowActions = ({
  row,
}: {
  row: ElectronicFile & ExistingContact,
}): ReturnType => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);
  const [updateViewed] = useUpdateViewedMutation();
  const [updateArchived] = useUpdateArchivedMutation();
  const [updateContactsArchived] = useUpdateContactsArchivedMutation();

  if (row.global) {
    return {
      rowActions: [],
      rowActionComponents: [
        <Tooltip
          key={ACTION_KEY.DISABLED}
          title={i18n.t('This contact is not editable')}
        >
          <GridActionsCellItem
            label={i18n.t('This contact is not editable')}
            icon={<KitmanIcon name={KITMAN_ICON_NAMES.InfoOutlined} />}
          />
        </Tooltip>,
      ],
    };
  }

  const rowActions = getRowActions({
    row,
    selectedMenuItem,
    onToggleViewed: () => {
      updateViewed({
        viewed: !row.viewed,
        inboundElectronicFileIds: [row.id],
      });
    },
    onToggleArchived: () => {
      updateArchived({
        archived: !row.archived,
        inboundElectronicFileIds: [row.id],
      });
      clearAnyExistingElectronicFileToast(dispatch);
      dispatch(
        add(row.archived ? unarchiveSuccessToast() : archiveSuccessToast())
      );
    },
    onUpdateContact: (contact: ExistingContact) => {
      dispatch(
        updateData({
          contact,
        })
      );
      dispatch(updateOpen(true));
    },
    onToggleContactsArchived: () => {
      updateContactsArchived({
        archived: !row.archived,
        contactIds: [row.id],
      });
      clearAnyExistingElectronicFileToast(dispatch);
      dispatch(
        add(
          row.archived
            ? unarchiveContactSuccessToast()
            : archiveContactSuccessToast()
        )
      );
    },
  });

  const rowActionComponents = rowActions
    .filter((rowAction) => !rowAction.hidden)
    .map((rowAction) => (
      <GridActionsCellItem
        key={rowAction.id}
        label={rowAction.label}
        icon={<KitmanIcon name={rowAction.icon} />}
        onClick={rowAction.onClick}
        showInMenu
        dense
      />
    ));

  return {
    rowActions,
    rowActionComponents,
  };
};

export default useRowActions;
