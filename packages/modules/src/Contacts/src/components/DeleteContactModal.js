// @flow
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Modal } from '@kitman/components';
import { Stack, Button } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { getModal } from '@kitman/modules/src/Contacts/src/redux/selectors/contactsGridSelectors';
import { onToggleModal } from '@kitman/modules/src/Contacts/src/redux/slices/contactsSlice';
import { useDeleteContactMutation } from '@kitman/modules/src/Contacts/src/redux/rtk/getContactRolesApi';
import { useSearchContactsQuery } from '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi';
import { defaultFilters } from '@kitman/modules/src/Contacts/shared/constants';
import structuredClone from 'core-js/stable/structured-clone';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';

const DeleteContactModal = () => {
  const dispatch = useDispatch();
  const modal = useSelector(getModal);

  const [
    onDeleteContact,
    { isError: hasDeleteContactFailed, isSuccess: isDeleteContactSuccess },
  ] = useDeleteContactMutation();

  const searchContactsQuery = useSearchContactsQuery(
    structuredClone(defaultFilters)
  );

  const handleContactDeletion = async () => {
    await onDeleteContact({
      id: modal.contact.id,
      archived: true,
    });
  };

  const handleCancel = () => {
    dispatch(onToggleModal({ isOpen: false, contact: null }));
  };

  useEffect(() => {
    if (isDeleteContactSuccess) {
      searchContactsQuery.refetch();
      dispatch(onToggleModal({ isOpen: false, contact: null }));
      dispatch(
        add({
          id: 'DELETE_CONTACT',
          status: 'SUCCESS',
          title: i18n.t('Contact successfully deleted.'),
        })
      );
    }
    if (hasDeleteContactFailed) {
      dispatch(onToggleModal({ isOpen: false, contact: null }));
      dispatch(
        add({
          id: 'DELETE_CONTACT_FAILED',
          status: 'ERROR',
          title: i18n.t('Failed to successfully deleted contact.'),
        })
      );
    }
  }, [isDeleteContactSuccess, hasDeleteContactFailed]);

  return (
    <Modal
      isOpen={modal?.isOpen}
      onPressEscape={handleCancel}
      close={handleCancel}
    >
      <Modal.Header>
        <Modal.Title>{i18n.t('Delete Contact')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {i18n.t(
          'You are deleting this contact for: {{name}}. Deleting the contact will permanently remove the contact from the system.',
          {
            name: modal?.contact?.name,
          }
        )}
      </Modal.Content>
      <Modal.Footer>
        <Stack direction="row">
          <Button onClick={handleCancel} color="secondary">
            {i18n.t('Cancel')}
          </Button>
          <Button onClick={handleContactDeletion}>{i18n.t('Delete')}</Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export const DeleteContactModalTranslated =
  withNamespaces()(DeleteContactModal);
export default DeleteContactModal;
