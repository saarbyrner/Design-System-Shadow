/* eslint-disable max-statements */
// @flow

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import i18n from '@kitman/common/src/utils/i18n';
import {
  DialogContentText,
  Menu,
  MenuItem,
  Tooltip,
} from '@kitman/playbook/components';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import {
  deleteMenuGroup,
  deleteMenuItem,
  deleteLayoutGroup,
  duplicateMenuGroup,
  duplicateMenuItem,
  duplicateLayoutGroup,
  setCurrentMenuGroupIndex,
  setCurrentMenuItemIndex,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import {
  getMenuGroupCount,
  getMenuItemCount,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import {
  getDeleteMenuGroupModalText,
  getDeleteMenuItemModalText,
  getDeleteLayoutGroupModalText,
} from './helpers';

export const ELEMENT_TYPE = Object.freeze({
  MENU_GROUP: 'MenuGroup',
  MENU_ITEM: 'MenuItem',
  LAYOUT_GROUP: 'LayoutGroup',
});

export type ElementType = $Values<typeof ELEMENT_TYPE>;

type UseActionMenu = {
  actions: {
    onDelete: () => void,
  },
  menuGroupIndex: number,
  menuItemIndex?: number,
  layoutGroupIndex?: number,
  elementType: ElementType,
};

export const useActionMenu = ({
  menuGroupIndex,
  menuItemIndex,
  layoutGroupIndex,
  actions,
  elementType,
}: UseActionMenu) => {
  const dispatch = useDispatch();
  const buttonAriaLabel = `menu-group-${menuGroupIndex}${
    menuItemIndex ? `menu-item-${menuItemIndex}` : ''
  }-actions-button`;
  const [anchorEl, setAnchorEl] = useState(null);
  const menuGroupCount = useSelector(getMenuGroupCount);
  const menuItemCount = useSelector(getMenuItemCount);
  const isMenuItem = typeof menuItemIndex === 'number' && menuItemIndex >= 0;

  const disabledText = {
    [ELEMENT_TYPE.MENU_ITEM]:
      menuItemCount <= 1
        ? i18n.t('Cannot delete last menu item in a menu group.')
        : '',
    [ELEMENT_TYPE.MENU_GROUP]:
      menuGroupCount <= 1 ? i18n.t('Cannot delete last menu group.') : '',
    [ELEMENT_TYPE.LAYOUT_GROUP]: '',
  };
  const isDeleteDisabled =
    elementType !== ELEMENT_TYPE.LAYOUT_GROUP &&
    (isMenuItem ? menuItemCount <= 1 : menuGroupCount <= 1);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const menuComponent = (
    <Menu
      id="options-menu"
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handleCloseMenu}
      MenuListProps={{
        'aria-labelledby': buttonAriaLabel,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem
        onClick={() => {
          if (elementType === ELEMENT_TYPE.LAYOUT_GROUP) {
            dispatch(
              duplicateLayoutGroup({
                menuGroupIndex,
                menuItemIndex,
                layoutGroupIndex,
              })
            );
          } else if (elementType === ELEMENT_TYPE.MENU_ITEM) {
            dispatch(duplicateMenuItem({ menuGroupIndex, menuItemIndex }));
          } else {
            dispatch(duplicateMenuGroup({ menuGroupIndex }));
          }

          handleCloseMenu();
        }}
      >
        {i18n.t('Duplicate')}
      </MenuItem>
      <Tooltip title={disabledText[elementType]}>
        <span>
          <MenuItem
            onClick={() => {
              actions.onDelete();
              handleCloseMenu();
            }}
            disabled={isDeleteDisabled}
          >
            {i18n.t('Delete')}
          </MenuItem>
        </span>
      </Tooltip>
    </Menu>
  );

  return {
    menuComponent,
    buttonAriaLabel,
    onClickMenuTriggerButton: (event: { currentTarget: HTMLElement }) =>
      setAnchorEl(event.currentTarget),
  };
};

export const useDeleteMenuGroup = (menuGroupIndex: number) => {
  const dispatch = useDispatch();

  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);

  const closeModal = () => {
    setShouldOpenConfirmationModal(false);
  };

  const openModal = () => setShouldOpenConfirmationModal(true);

  const handleDeleteMenuGroup = () => {
    dispatch(deleteMenuGroup(menuGroupIndex));
    dispatch(setCurrentMenuGroupIndex(0));
    dispatch(setCurrentMenuItemIndex(0));
    closeModal();
  };

  const { content, ...restTranslations } = getDeleteMenuGroupModalText();

  const deleteMenuItemDialogContent = (
    <DialogContentText id={modalDescriptionId}>{content}</DialogContentText>
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={false}
      onConfirm={handleDeleteMenuGroup}
      onCancel={closeModal}
      onClose={closeModal}
      dialogContent={deleteMenuItemDialogContent}
      translatedText={restTranslations}
    />
  );

  return { openModal, confirmationModal };
};

type UseDeleteMenuItem = {
  menuGroupIndex: number,
  menuItemIndex: number,
};

type UseDeleteLayoutGroup = {
  menuGroupIndex: number,
  menuItemIndex: number,
  groupIndex: number,
};

export const useDeleteMenuItem = ({
  menuGroupIndex,
  menuItemIndex,
}: UseDeleteMenuItem) => {
  const dispatch = useDispatch();

  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);

  const closeModal = () => {
    setShouldOpenConfirmationModal(false);
  };
  const openModal = () => setShouldOpenConfirmationModal(true);

  const handleDeleteMenuItem = () => {
    dispatch(deleteMenuItem({ menuGroupIndex, menuItemIndex }));
    closeModal();
  };

  const { content, ...restTranslations } = getDeleteMenuItemModalText();

  const deleteMenuItemDialogContent = (
    <DialogContentText id={modalDescriptionId}>{content}</DialogContentText>
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={false}
      onConfirm={handleDeleteMenuItem}
      onCancel={closeModal}
      onClose={closeModal}
      dialogContent={deleteMenuItemDialogContent}
      translatedText={restTranslations}
    />
  );

  return { openModal, confirmationModal };
};

export const useDeleteLayoutGroup = ({
  menuGroupIndex,
  menuItemIndex,
  groupIndex,
}: UseDeleteLayoutGroup) => {
  const dispatch = useDispatch();

  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);

  const closeModal = () => {
    setShouldOpenConfirmationModal(false);
  };
  const openModal = () => setShouldOpenConfirmationModal(true);

  const handleDeleteLayoutGroup = () => {
    dispatch(deleteLayoutGroup({ menuGroupIndex, menuItemIndex, groupIndex }));
    closeModal();
  };

  const { content, ...restTranslations } = getDeleteLayoutGroupModalText();

  const deleteLayoutGroupDialogContent = (
    <DialogContentText id={modalDescriptionId}>{content}</DialogContentText>
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={false}
      onConfirm={handleDeleteLayoutGroup}
      onCancel={closeModal}
      onClose={closeModal}
      dialogContent={deleteLayoutGroupDialogContent}
      translatedText={restTranslations}
    />
  );

  return { openModal, confirmationModal };
};
