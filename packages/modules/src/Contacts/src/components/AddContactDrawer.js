// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Select,
  TextField,
  Stack,
  InputLabel,
  Typography,
  FormControl,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@kitman/playbook/components';
import CloseIcon from '@mui/icons-material/Close';
import structuredClone from 'core-js/stable/structured-clone';
import {
  defaultContact,
  defaultErrors,
  mailingList,
} from '@kitman/modules/src/Contacts/shared/constants';
import style from '@kitman/modules/src/Contacts/style';
import { isEmailInvalidOnSaveOrSubmit } from '@kitman/modules/src/Officials/shared/utils';
import { isEmpty, omit } from 'lodash';
import PhoneNumberInput from '@kitman/components/src/PhoneNumberInput';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { createContact, updateContact } from '@kitman/services';
import { useGetAssociationsOrgsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { useGetTvChannelsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import parsePhoneNumber from 'libphonenumber-js';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import {
  type ContactWithId,
  type MailingList,
  type CreateContactFormErrors,
} from '@kitman/modules/src/Contacts/shared/types';
import {
  getTranslations,
  getCreateContactFormErrors,
  getStatusEnumLike,
} from '@kitman/modules/src/Contacts/shared/utils';
import { useGetContactRolesQuery } from '../redux/rtk/getContactRolesApi';
import FieldError from './FieldError';
import DrawerLayout from './DrawerLayout';

type Props = {
  isOpen: boolean,
  onSave: () => void,
  onClose: () => void,
  data: ContactWithId | null,
};

const AddContactDrawer = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [countryCode, setCountryCode] = useState<string>('US');
  const [contact, setContact] = useState<ContactWithId>(
    structuredClone(defaultContact)
  );
  const currentSquad = useSelector(getActiveSquad());
  const [formattedPhone, setFormattedPhone] = useState('');
  const [errors, setErrors] = useState<CreateContactFormErrors>(
    structuredClone(defaultErrors)
  );
  const textEnum = getTranslations(props.t);
  const status = getStatusEnumLike(props.t);

  const leagueOps = useLeagueOperations();
  const isLeague = leagueOps?.isLeague;

  const contactRolesQuery = useGetContactRolesQuery();
  const getAssociationsOrgsQuery = useGetAssociationsOrgsQuery(
    {
      divisionIds: currentSquad?.division[0]?.id,
    },
    {
      skip: !isLeague || !props.isOpen,
    }
  );

  const { data: tvChannels = [] } = useGetTvChannelsQuery();
  const hasTvChannels = tvChannels.length > 0;

  useEffect(() => {
    if (props.isOpen && props.data) {
      const contactToEdit = { ...props.data };
      const parsedPhoneNumber =
        props.data?.phone && parsePhoneNumber(props.data.phone);
      if (parsedPhoneNumber) {
        contactToEdit.phone = parsedPhoneNumber.nationalNumber;
        setCountryCode(parsedPhoneNumber.country);
      } else {
        contactToEdit.phone = '';
      }
      setContact((prevState) => ({ ...prevState, ...contactToEdit }));
    }
  }, [props.isOpen, props.data]);

  const onMailingListChange = (name: string) => {
    setContact((prev) => ({ ...prev, [name]: !contact[name] }));
    if (!(contact.dmn || contact.dmr)) {
      setErrors((prev) => ({
        ...prev,
        mailingList: '',
      }));
    }
  };

  const onClose = () => {
    setCountryCode('');
    setContact(structuredClone(defaultContact));
    setErrors(defaultErrors);
    props.onClose();
  };

  const onSave = async () => {
    try {
      setIsSaving(true);

      const formErrors = getCreateContactFormErrors({
        contact,
        textEnum,
        countryCode,
        isLeague,
      });

      if (!isEmpty(formErrors)) {
        setErrors(formErrors);
        setIsSaving(false);
        return;
      }

      const validatedPhoneNumber =
        parsePhoneNumber(formattedPhone, countryCode)?.number ??
        parsePhoneNumber(contact.phone, countryCode)?.number ??
        '';

      if (contact.id) {
        await updateContact({
          id: contact.id,
          updates: omit(
            {
              name: contact.name,
              organisation_id: contact.organisation?.id,
              game_contact_role_ids: contact.gameContactRoles.map(
                (item) => item.id
              ),
              tv_channel_id: contact.tvChannelId,
              phone_number: validatedPhoneNumber,
              email: contact.email,
              dmn: contact.dmn,
              dmr: contact.dmr,
              status: status.Approved,
            },
            !isLeague ? ['organisation_id'] : []
          ),
        });
        dispatch(
          add({
            status: toastStatusEnumLike.Success,
            title: textEnum.contactUpdated,
          })
        );
      } else {
        await createContact(
          omit(
            {
              name: contact.name,
              organisation_id: contact.organisation?.id,
              game_contact_role_ids: contact.gameContactRoles.map(
                (item) => item.id
              ),
              tv_channel_id: contact.tvChannelId,
              phone_number: validatedPhoneNumber,
              email: contact.email,
              dmn: contact.dmn,
              dmr: contact.dmr,
            },
            !isLeague ? ['organisation_id'] : []
          )
        );
        dispatch(
          add({
            status: toastStatusEnumLike.Success,
            title: textEnum.contactCreated,
          })
        );
      }

      onClose();
      props.onSave();

      setIsSaving(false);
    } catch (e) {
      const isEmailTaken =
        e?.response?.data?.errors?.email?.[0] === 'has already been taken';

      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: isEmailTaken
            ? textEnum.error.emailAlreadyTaken
            : textEnum.error.formSubmitted,
        })
      );
      setIsSaving(false);
    }
  };

  const renderMailingListCheckbox = ({
    label,
    value,
  }: {
    label: string,
    value: MailingList,
  }) => {
    return (
      <FormControlLabel
        sx={{ marginBottom: 0 }}
        control={
          <Checkbox
            checked={contact[value]}
            onChange={() => onMailingListChange(value)}
          />
        }
        label={label}
      />
    );
  };

  return (
    <DrawerLayout
      isOpen={props.isOpen}
      onClose={onClose}
      onSave={onSave}
      isSaving={isSaving}
    >
      <Stack p={3} direction="column" gap={2} sx={{ flex: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          pb={2}
        >
          <Typography variant="h3" css={style.drawerTitle}>
            {isEmpty(props.data)
              ? props.t('Add Contact')
              : props.t('Update Contact')}
          </Typography>

          <CloseIcon onClick={onClose} />
        </Stack>
        <Stack direction="column">
          <FormControl>
            <TextField
              label={props.t('Name')}
              value={contact.name}
              onChange={(e) => {
                // NOTE: remove e.persist() if React version is 17+.
                e.persist();
                setContact((prev) => ({
                  ...prev,
                  name: e.target?.value,
                }));
              }}
              onBlur={() => {
                if (contact.name.trim()) {
                  setErrors((prev) => ({
                    ...prev,
                    name: '',
                  }));
                }
              }}
            />
          </FormControl>
          <FieldError name="name" errors={errors} />
        </Stack>

        {isLeague && (
          <Stack direction="column">
            <FormControl>
              <InputLabel id="associated-with-label">
                {props.t('Associated with')}
              </InputLabel>
              <Select
                labelId="associated-with-label"
                id="associated-with-field"
                displayEmpty
                value={contact.organisation?.id || ''}
                onChange={(e) => {
                  setContact((prev) => ({
                    ...prev,
                    organisation: getAssociationsOrgsQuery.data?.find(
                      (item) => item.id === e.target?.value
                    ),
                  }));
                  setErrors((prev) => ({ ...prev, organisation: '' }));
                }}
              >
                {getAssociationsOrgsQuery.data?.map((club) => {
                  return (
                    <MenuItem key={club.id} value={club.id}>
                      {club.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FieldError name="organisation" errors={errors} />
          </Stack>
        )}

        <Stack direction="column">
          <FormControl>
            <InputLabel id="role-label">{props.t('Roles')}</InputLabel>
            <Select
              labelId="role-label"
              id="role-field"
              displayEmpty
              value={contact.gameContactRoles.map((item) => item.id) || ''}
              onChange={(e) => {
                setContact((prev) => ({
                  ...prev,
                  gameContactRoles: contactRolesQuery.data?.filter((item) =>
                    e.target?.value.includes(item.id)
                  ),
                }));
                setErrors((prev) => ({ ...prev, gameContactRoles: '' }));
              }}
              multiple
            >
              {contactRolesQuery.data?.map((contactRole) => {
                return (
                  <MenuItem key={contactRole.id} value={contactRole.id}>
                    {contactRole.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FieldError name="gameContactRoles" errors={errors} />
        </Stack>

        <Stack direction="column">
          <PhoneNumberInput
            phone={contact.phone}
            countryCode={countryCode}
            onChangePhone={(phone, formattedPhoneNumber) => {
              setContact((prev) => ({ ...prev, phone }));
              setFormattedPhone(formattedPhoneNumber);
            }}
            onChangeCountryCode={setCountryCode}
            onSuccess={(phone) => {
              setContact((prev) => ({ ...prev, phone }));
              setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            onError={(error) =>
              setErrors((prev) => ({
                ...prev,
                phone: error,
              }))
            }
          />
          <FieldError name="phone" errors={errors} />
        </Stack>

        <Stack direction="column">
          <TextField
            label={props.t('Email')}
            value={contact.email}
            type="email"
            autoComplete="off"
            onChange={(e) => {
              // NOTE: remove e.persist() if React version is 17+.
              e.persist();
              setContact((prev) => ({
                ...prev,
                email: e.target?.value,
              }));
            }}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                email: isEmailInvalidOnSaveOrSubmit(contact.email)
                  ? textEnum.error.email
                  : '',
              }));
            }}
          />
          <FieldError name="email" errors={errors} />
        </Stack>

        {hasTvChannels && (
          <Stack direction="column">
            <FormControl>
              <Autocomplete
                id="tv-autocomplete"
                options={tvChannels}
                renderInput={(params) => (
                  <TextField {...params} label={props.t('TV')} />
                )}
                getOptionLabel={(option) => option.name}
                value={
                  tvChannels.find((item) => item.id === contact.tvChannelId) ??
                  null
                }
                onChange={(_, selectedValue) => {
                  setContact((prev) => ({
                    ...prev,
                    tvChannelId: selectedValue?.id ?? null,
                  }));
                }}
                clearOnEscape
                clearOnBlur
                disableClearable={false}
              />
            </FormControl>
          </Stack>
        )}

        <Stack direction="column">
          <InputLabel sx={style.label}>{props.t('Mailing list')}</InputLabel>
          <FormGroup sx={{ flexDirection: 'row' }}>
            {renderMailingListCheckbox({
              label: 'DMN',
              value: mailingList.Dmn,
            })}
            {renderMailingListCheckbox({
              label: 'DMR',
              value: mailingList.Dmr,
            })}
          </FormGroup>
          <FieldError name="mailingList" errors={errors} />
        </Stack>
      </Stack>
    </DrawerLayout>
  );
};

export default withNamespaces()(AddContactDrawer);
