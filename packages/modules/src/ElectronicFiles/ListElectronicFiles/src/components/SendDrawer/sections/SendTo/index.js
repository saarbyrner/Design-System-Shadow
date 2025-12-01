// @flow
import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch, useSelector } from 'react-redux';
import type { NewContact } from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  selectData,
  selectValidation,
  updateValidation,
  SEND_DRAWER_DATA_KEY,
  SEND_TO_KEY,
  type DataKey,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  useFetchFavoriteContactsQuery,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import {
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  FavoriteCheckbox,
} from '@kitman/playbook/components';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';
import { ContactFormTranslated as ContactForm } from '@kitman/modules/src/ElectronicFiles/shared/components/ContactForm';
import Errors from '@kitman/modules/src/ElectronicFiles/shared/components/Errors';
import { validateField } from '@kitman/modules/src/ElectronicFiles/shared/utils';

type Props = {
  handleChange: (field: DataKey, value: string | number | NewContact) => void,
};

const SendToSection = ({ handleChange, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const validation = useSelector(selectValidation);

  const [contactsDropdownOpen, setContactsDropdownOpen] =
    useState<boolean>(false);
  const [clickedFavoriteContactId, setClickedFavoriteContactId] =
    useState<boolean>(false);

  const {
    data: permissions = {},
    isSuccess: hasPermissionsDataLoaded = false,
  }: { data: PermissionsType, isSuccess: boolean } = useGetPermissionsQuery();

  const { data: contacts = [], isFetching: areContactsFetching } =
    useFetchFavoriteContactsQuery(undefined, { skip: !contactsDropdownOpen });

  const [makeContactFavorite, { isLoading: isMakeContactFavoriteLoading }] =
    useMakeContactFavoriteMutation();
  const [deleteContactFavorite, { isLoading: isDeleteContactFavoriteLoading }] =
    useDeleteContactFavoriteMutation();

  const handleValidation = (errors) => {
    dispatch(updateValidation(errors));
  };

  /*
    When the contacts refresh, the list scrolls to the top.
    The below fixes the scroll as per: https://github.com/mui/material-ui/issues/18450#issuecomment-1833700978
  */
  const persistedListBox = useRef();
  const persistedScrollTop = useRef();
  useEffect(() => {
    if (persistedListBox.current) {
      setTimeout(() => {
        persistedListBox.current.scrollTo({
          top: persistedScrollTop.current,
        });
        persistedListBox.current = null;
      }, 1);
    }
  }, [contacts]);

  return (
    <>
      <FormControl>
        {hasPermissionsDataLoaded && permissions.efile.canManageContacts && (
          <>
            <FormLabel sx={{ fontWeight: 500 }}>{t('Sending to')}</FormLabel>

            <RadioGroup
              row
              onChange={(e) =>
                handleChange(SEND_DRAWER_DATA_KEY.sendTo, e.target.value)
              }
            >
              <FormControlLabel
                control={
                  <Radio
                    checked={data.sendTo === SEND_TO_KEY.savedContact}
                    size="small"
                  />
                }
                label={t('Saved contact')}
                value={SEND_TO_KEY.savedContact}
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={data.sendTo === SEND_TO_KEY.newContact}
                    size="small"
                  />
                }
                label={t('New contact')}
                value={SEND_TO_KEY.newContact}
              />
            </RadioGroup>
          </>
        )}
      </FormControl>
      {data.sendTo === SEND_TO_KEY.savedContact ? (
        <Autocomplete
          disablePortal
          disableCloseOnSelect
          loading={areContactsFetching}
          open={contactsDropdownOpen}
          onOpen={() => setContactsDropdownOpen(true)}
          onClose={() => setContactsDropdownOpen(false)}
          value={data.savedContact}
          onChange={(e, value) => {
            handleChange(SEND_DRAWER_DATA_KEY.savedContact, value);
            handleValidation(
              validateField(SEND_DRAWER_DATA_KEY.savedContact, value)
            );
          }}
          options={contacts || []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) =>
            renderInput({
              params,
              label: t('To'),
              onBlur: (e) =>
                handleValidation(
                  validateField(
                    SEND_DRAWER_DATA_KEY.savedContact,
                    e.target.value
                  )
                ),
              error: !!validation.errors?.savedContact?.length,
              helperText: <Errors errors={validation.errors?.savedContact} />,
              FormHelperTextProps: { component: 'div' },
            })
          }
          getOptionLabel={(option) =>
            `${option.first_name} ${option.last_name} - ${option.company_name} - ${option.fax_number.number}`
          }
          renderOption={(props, option) => {
            const { onClick, ...remainingProps } = props;
            return (
              <ListItem
                key={option.id}
                {...remainingProps}
                dense
                disablePadding
                disableGutters
              >
                <ListItemIcon>
                  {(isMakeContactFavoriteLoading ||
                    isDeleteContactFavoriteLoading) &&
                  option.id === clickedFavoriteContactId ? (
                    <CircularProgress
                      color="primary"
                      size={20}
                      sx={{ mx: 1 }}
                    />
                  ) : (
                    <FavoriteCheckbox
                      checked={option.favorite}
                      onChange={(checked: boolean) => {
                        setClickedFavoriteContactId(option.id);
                        if (checked) {
                          makeContactFavorite({ itemId: option.id });
                        } else {
                          deleteContactFavorite({ itemId: option.id });
                        }
                      }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`${option.first_name} ${option.last_name} - ${option.company_name}`}
                  secondary={`${option.fax_number.number}`}
                  onClick={() => {
                    handleChange(SEND_DRAWER_DATA_KEY.savedContact, option);
                    handleValidation(
                      validateField(SEND_DRAWER_DATA_KEY.savedContact, option)
                    );
                    setContactsDropdownOpen(false);
                  }}
                />
              </ListItem>
            );
          }}
          ListboxProps={{
            onScroll: (event) => {
              const listboxNode = event.currentTarget;
              if (
                listboxNode.scrollTop + listboxNode.clientHeight ===
                listboxNode.scrollHeight
              ) {
                persistedListBox.current = listboxNode;
                persistedScrollTop.current = listboxNode.scrollTop;
              }
            },
          }}
          noOptionsText={t('No contacts')}
        />
      ) : (
        <ContactForm
          handleChange={(value) =>
            handleChange(SEND_DRAWER_DATA_KEY.newContact, {
              ...data.newContact,
              ...value,
            })
          }
          data={{ contact: data.newContact }}
          validation={validation}
          handleValidation={handleValidation}
        />
      )}
    </>
  );
};

export const SendToSectionTranslated: ComponentType<Props> =
  withNamespaces()(SendToSection);
export default SendToSection;
