/* eslint-disable camelcase */
// @flow
import { withNamespaces } from 'react-i18next';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  DOCUMENT_ERROR_TOAST_ID,
  DOCUMENT_SUCCESS_TOAST_ID,
} from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel';
import {
  onSetMode,
  onOpenDocumentSidePanel,
  onUpdateDocumentForm,
} from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { getGenericDocumentFactory } from '@kitman/services/src/services/documents/generic/redux/selectors/genericDocumentsSelectors';
import { IconButton, Menu, MenuItem } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useArchiveDocumentMutation } from '@kitman/services/src/services/documents/generic';

type Props = {
  id: number,
};

const ActionMenu = ({ t, id }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const genericDocument = useSelector(getGenericDocumentFactory(id));
  const [archiveDocument]: [(documentId: number) => Promise<{}>] =
    useArchiveDocumentMutation();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    // will open the side panel on edit mode for a specific document by its id
    const {
      title,
      organisation_generic_document_categories: genericDocumentCategories,
      attachment,
      document_date,
      expires_at,
      document_note,
    } = genericDocument;

    dispatch(onSetMode({ mode: MODES.EDIT }));
    dispatch(
      onUpdateDocumentForm({
        id,
        filename: title,
        organisation_generic_document_categories:
          genericDocumentCategories?.map(({ id: categoryId }) => categoryId),
        attachment: {
          file: attachment,
          state: 'SUCCESS',
          message: `${fileSizeLabel(attachment?.filesize, true)}`,
        },
        document_date,
        expires_at,
        document_note,
      })
    );
    dispatch(onOpenDocumentSidePanel());
    handleCloseMenu();
  };

  const handleArchiveClick = async () => {
    const documentTitle = genericDocument.title;

    // remove existing toasts
    dispatch(remove(DOCUMENT_ERROR_TOAST_ID));
    dispatch(remove(DOCUMENT_SUCCESS_TOAST_ID));

    try {
      unwrapResult(await archiveDocument(id));
      dispatch(
        add({
          id: DOCUMENT_SUCCESS_TOAST_ID,
          status: 'SUCCESS',
          title: `${t(`{{documentTitle}} archived successfully`, {
            documentTitle,
          })}`,
        })
      );
    } catch {
      dispatch(
        add({
          id: DOCUMENT_ERROR_TOAST_ID,
          status: 'ERROR',
          title: t('Unable to archive document. Try again'),
        })
      );
    }

    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="options-button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <KitmanIcon name={KITMAN_ICON_NAMES.MoreVert} />
      </IconButton>
      <Menu
        id="options-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        MenuListProps={{
          'aria-labelledby': 'options-button',
        }}
      >
        <MenuItem onClick={handleEditClick}>{t('Edit')}</MenuItem>
        <MenuItem onClick={handleArchiveClick}>{t('Archive')}</MenuItem>
      </Menu>
    </>
  );
};

export const ActionMenuTranslated: ComponentType<Props> =
  withNamespaces()(ActionMenu);
export default ActionMenu;
