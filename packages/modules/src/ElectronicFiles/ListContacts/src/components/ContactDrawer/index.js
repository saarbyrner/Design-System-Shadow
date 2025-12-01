// @flow
import { type ComponentType, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import type {
  ContactFormData,
  NewContact,
  ExistingContact,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  CONTACT_DRAWER_DATA_KEY,
  selectOpen,
  selectData,
  selectValidation,
  updateData,
  updateValidation,
  reset,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactDrawerSlice';
import {
  useCreateContactMutation,
  useUpdateContactMutation,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import type { DataKey } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactDrawerSlice';
import { Drawer, Divider, Button } from '@kitman/playbook/components';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import {
  validateContactDrawerData,
  getValidationStatus,
  clearAnyExistingElectronicFileToast,
} from '@kitman/modules/src/ElectronicFiles/shared/utils';
import {
  createContactSuccessToast,
  updateContactSuccessToast,
  createContactErrorToast,
  updateContactErrorToast,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { ContactFormTranslated as ContactForm } from '@kitman/modules/src/ElectronicFiles/shared/components/ContactForm';

type Props = {};

const ContactDrawer = ({ t }: I18nProps<Props>) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const open = useSelector(selectOpen);
  const data: ContactFormData = useSelector(selectData);
  const validation = useSelector(selectValidation);

  const [isAddToFavoritesChecked, setIsAddToFavoritesChecked] =
    useState<boolean>(false);

  const isUpdate = data.contact?.id || false;

  const [createContact, { isLoading: isCreateContactLoading }] =
    useCreateContactMutation();

  const [updateContact, { isLoading: isUpdateContactLoading }] =
    useUpdateContactMutation();

  const [makeContactFavorite] = useMakeContactFavoriteMutation();
  const [deleteContactFavorite] = useDeleteContactFavoriteMutation();

  const handleClose = () => {
    setIsAddToFavoritesChecked(false);
    dispatch(reset());
  };

  const handleChange = (
    field: DataKey,
    value: NewContact | ExistingContact
  ) => {
    dispatch(updateData({ [`${field}`]: value }));
  };

  const handleValidation = (errors) => {
    dispatch(updateValidation(errors));
  };

  const onSuccess = (response: ExistingContact) => {
    dispatch(
      add(isUpdate ? updateContactSuccessToast() : createContactSuccessToast())
    );
    const isContactFavorite = data.contact?.favorite || false;
    // if the add to favorites checkbox has changed from initial value
    if (isContactFavorite !== isAddToFavoritesChecked) {
      if (isAddToFavoritesChecked) {
        makeContactFavorite({ itemId: response.id });
      } else {
        deleteContactFavorite({ itemId: response.id });
      }
    }
    handleClose();
  };

  const handleErrors = (errors) => {
    const errorKeys = Object.keys(errors.error);
    if (errorKeys.includes('fax_number')) {
      dispatch(
        updateValidation({
          faxNumber: errors.error.fax_number,
        })
      );
    }
  };

  const onError = (errors) => {
    handleErrors(errors);
    dispatch(
      add(isUpdate ? updateContactErrorToast() : createContactErrorToast())
    );
  };

  const handleSubmit = async () => {
    const validatedData = validateContactDrawerData({ data });
    dispatch(updateValidation(validateContactDrawerData({ data })));

    const validationStatus = getValidationStatus(validatedData);

    // if validationStatus is false, return
    if (!validationStatus) {
      return;
    }

    clearAnyExistingElectronicFileToast(dispatch);

    if (isUpdate) {
      updateContact(data.contact)
        .unwrap()
        .then((response) => onSuccess(response))
        .catch(onError);
    } else {
      createContact(data.contact)
        .unwrap()
        .then((response) => onSuccess(response))
        .catch(onError);
    }
  };

  const renderContent = () => {
    return (
      <>
        <DrawerLayout.Title
          title={isUpdate ? t('Update contact') : t('Create contact')}
          onClose={handleClose}
        />
        <Divider />
        <DrawerLayout.Content>
          <ContactForm
            handleChange={(value) =>
              handleChange(CONTACT_DRAWER_DATA_KEY.contact, {
                ...data.contact,
                ...value,
              })
            }
            data={{ contact: data.contact }}
            validation={validation}
            handleValidation={handleValidation}
            onAddToFavoritesChange={(checked) =>
              setIsAddToFavoritesChecked(checked)
            }
            showAddToFavoritesCheckbox
            stackFields
          />
        </DrawerLayout.Content>
        <Divider />
        <DrawerLayout.Actions>
          <Button color="secondary" onClick={() => dispatch(reset())}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreateContactLoading || isUpdateContactLoading}
          >
            {isUpdate ? t('Update') : t('Create')}
          </Button>
        </DrawerLayout.Actions>
      </>
    );
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      // prevent user closing the drawer by mistake
      onClose={() => {}}
      sx={drawerMixin({ theme, isOpen: open, drawerWidth: 650 })}
    >
      {renderContent()}
    </Drawer>
  );
};

export const ContactDrawerTranslated: ComponentType<Props> =
  withNamespaces()(ContactDrawer);
export default ContactDrawer;
