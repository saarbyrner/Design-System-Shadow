// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch, useSelector } from 'react-redux';
import type {
  ElectronicFile,
  ExistingContact,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  MENU_ITEM,
  selectSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useUpdateContactsArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { clearAnyExistingElectronicFileToast } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import {
  ACTION_KEY,
  archiveSuccessToast,
  unarchiveSuccessToast,
  archiveContactSuccessToast,
  unarchiveContactSuccessToast,
  bulkArchiveSuccessToast,
  bulkUnarchiveSuccessToast,
  bulkArchiveContactsSuccessToast,
  bulkUnarchiveContactsSuccessToast,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { Box, Tooltip, IconButton, Divider } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  rows: Array<ElectronicFile & ExistingContact>,
  onBulkAction: () => void,
};

const BulkActions = ({ rows, onBulkAction, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);

  const [updateViewed] = useUpdateViewedMutation();
  const [updateArchived] = useUpdateArchivedMutation();
  const [updateContactsArchived] = useUpdateContactsArchivedMutation();

  const isAllEqual = rows
    .map((row) => row.viewed)
    .every((val, i, arr) => val === arr[0]);

  const getReadLabel = () => {
    if (!isAllEqual) {
      return t('read');
    }
    if (rows[0]?.viewed) {
      return t('unread');
    }
    return t('read');
  };

  const isMarkAsRead = () => {
    if (!isAllEqual) {
      return true;
    }
    return !rows[0]?.viewed;
  };

  const isArchive = rows.some((row) => row.archived);

  const showArchiveActionToast = () => {
    clearAnyExistingElectronicFileToast(dispatch);
    if (rows.length === 1 && selectedMenuItem !== MENU_ITEM.contacts) {
      dispatch(
        add(isArchive ? unarchiveSuccessToast() : archiveSuccessToast())
      );
    } else if (rows.length > 1 && selectedMenuItem !== MENU_ITEM.contacts) {
      dispatch(
        add(
          isArchive
            ? bulkUnarchiveSuccessToast(rows.length)
            : bulkArchiveSuccessToast(rows.length)
        )
      );
    } else if (rows.length === 1 && selectedMenuItem === MENU_ITEM.contacts) {
      dispatch(
        add(
          isArchive
            ? unarchiveContactSuccessToast()
            : archiveContactSuccessToast()
        )
      );
    } else if (rows.length > 1 && selectedMenuItem === MENU_ITEM.contacts) {
      dispatch(
        add(
          isArchive
            ? bulkUnarchiveContactsSuccessToast(rows.length)
            : bulkArchiveContactsSuccessToast(rows.length)
        )
      );
    }
  };

  const options = [
    {
      id: ACTION_KEY.TOGGLE_VIEWED,
      text: t('Mark as {{readLabel}}', {
        readLabel: getReadLabel(),
      }),
      icon: isMarkAsRead()
        ? KITMAN_ICON_NAMES.DraftsOutlined
        : KITMAN_ICON_NAMES.MarkEmailUnreadOutlined,
      onClick: () => {
        updateViewed({
          viewed: isMarkAsRead(),
          inboundElectronicFileIds: rows.map((row) => row.id),
        });
        onBulkAction();
      },
      // hide mark as read/unread in archive
      hidden: selectedMenuItem !== MENU_ITEM.inbox || isArchive,
    },
    {
      id: ACTION_KEY.TOGGLE_ARCHIVED,
      text: isArchive ? t('Unarchive') : t('Archive'),
      icon: isArchive
        ? KITMAN_ICON_NAMES.UnarchiveOutlined
        : KITMAN_ICON_NAMES.ArchiveOutlined,
      onClick: () => {
        updateArchived({
          archived: !isArchive,
          inboundElectronicFileIds: rows.map((row) => row.id),
        });
        onBulkAction();
        showArchiveActionToast();
      },
      hidden: selectedMenuItem !== MENU_ITEM.inbox,
    },
    {
      id: ACTION_KEY.TOGGLE_CONTACTS_ARCHIVED,
      text: isArchive ? t('Unarchive') : t('Archive'),
      icon: isArchive
        ? KITMAN_ICON_NAMES.UnarchiveOutlined
        : KITMAN_ICON_NAMES.ArchiveOutlined,
      onClick: () => {
        updateContactsArchived({
          archived: !isArchive,
          contactIds: rows.map((contactId) => contactId.id),
        });
        onBulkAction();
        showArchiveActionToast();
      },
      hidden: selectedMenuItem !== MENU_ITEM.contacts,
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" px={1}>
        <Box>
          {rows.length !== 0 &&
            options
              .filter((option) => !option.hidden)
              .map((option) => (
                <Tooltip key={option.id} title={option.text}>
                  <IconButton color="primary" onClick={option.onClick}>
                    <KitmanIcon name={option.icon} />
                  </IconButton>
                </Tooltip>
              ))}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export const BulkActionsTranslated: ComponentType<Props> =
  withNamespaces()(BulkActions);
export default BulkActions;
