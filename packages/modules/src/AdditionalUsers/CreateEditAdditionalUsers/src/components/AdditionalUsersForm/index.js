// @flow
import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  DatePicker,
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
} from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
// TODO: Move to additional users folder when approved
import { languageDropdownOptions } from '@kitman/modules/src/Officials/shared/languageDropdownOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { onUpdateForm } from '@kitman/modules/src/AdditionalUsers/shared/redux/slices/additionalUsersSlice';
import {
  RoleOptions,
  statusOptions,
} from '@kitman/modules/src/AdditionalUsers/shared/consts';
import {
  useCreateAdditionalUserMutation,
  useUpdateAdditionalUserMutation,
} from '@kitman/modules/src/AdditionalUsers/shared/redux/services';
import useAdditionalUsersForm from '@kitman/modules/src/AdditionalUsers/shared/hooks/useAdditionalUsersForm';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  redirectUrl,
  parseUserType,
} from '@kitman/modules/src/AdditionalUsers/shared/utils';
import { isEmailValid } from '@kitman/common/src/utils/validators';
import {
  useGetSquadsQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import colors from '@kitman/common/src/variables/colors';

type Props = {};

const disabledFieldStyle = {
  WebkitTextFillColor: `${colors.grey_300} !important`,
  color: `${colors.grey_300} !important`,
};

function AdditionalUsersForm(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const { formState } = useSelector((state) => state.additionalUsersSlice);
  const { mode, userType, id } = useAdditionalUsersForm();
  const [onCreateAdditionalUser] = useCreateAdditionalUserMutation();
  const [onUpdateAdditionalUser] = useUpdateAdditionalUserMutation();

  const [isEmailValidationError, setIsEmailValidationError] = useState(false);
  const isEditMode = mode === 'EDIT';
  const showOrganisationField = userType === 'scout';

  const { availableSquads } = useGetSquadsQuery(
    {},
    {
      selectFromResult: (result) => {
        const squads = result?.data;
        const modifiedSquads: Array<{ value: number, label: string }> =
          squads?.map((squad) => ({ label: squad.name, value: squad.id }));
        return {
          availableSquads: modifiedSquads ?? [],
        };
      },
    }
  );

  const { data: activeSquad } = useGetActiveSquadQuery();

  const onHandleSave = () => {
    // eslint-disable-next-line camelcase
    const { third_party_scout_organisation, ...restFormState } = formState;
    const user = {
      ...restFormState,
      // eslint-disable-next-line camelcase
      ...(third_party_scout_organisation && {
        additional_model_attributes: [
          {
            attribute_name: 'third_party_scout_organisation',
            value: third_party_scout_organisation,
          },
        ],
      }),
      type: userType,
    };

    const parsedUserType = parseUserType(userType).toLowerCase();

    if (mode === 'NEW') {
      onCreateAdditionalUser(user)
        .then(() => {
          dispatch(
            add({
              status: 'SUCCESS',
              title: props.t('Success creating {{parsedUserType}}', {
                parsedUserType,
              }),
            })
          );
          locationAssign(redirectUrl(userType));
        })
        .catch(() => {
          dispatch(
            add({
              status: 'ERROR',
              title: props.t('Error creating {{parsedUserType}}', {
                parsedUserType,
              }),
            })
          );
        });
    } else if (mode === 'EDIT') {
      onUpdateAdditionalUser({
        id,
        user,
      })
        .then(() => {
          dispatch(
            add({
              status: 'SUCCESS',
              title: props.t('Success editing {{parsedUserType}}', {
                parsedUserType,
              }),
            })
          );
          locationAssign(redirectUrl(userType));
        })
        .catch(() => {
          dispatch(
            add({
              status: 'ERROR',
              title: props.t('Error editing {{parsedUserType}}', {
                parsedUserType,
              }),
            })
          );
        });
    }
  };

  const canSubmit = useMemo(() => {
    const requiredFields = ['firstname', 'lastname', 'email', 'locale'];
    return (
      requiredFields.every((field) => formState[field]) &&
      isEmailValid(formState.email)
    );
  }, [formState]);

  const onEmailBlur = () => {
    setIsEmailValidationError(
      formState.email && !isEmailValid(formState.email)
    );
  };

  const onFormChange = (key: string, value) => {
    dispatch(onUpdateForm({ [(key: string)]: value }));
  };

  useEffect(() => {
    if (activeSquad?.id) {
      dispatch(
        onUpdateForm({
          primary_squad: activeSquad.id,
          assign_squad_ids: [activeSquad.id],
        })
      );
    }
  }, [activeSquad?.id]);

  const renderTextField = ({
    label,
    formKey,
    helperText = '',
  }: {
    label: string,
    formKey: string,
    helperText?: string,
  }) => {
    return (
      <TextField
        label={label}
        value={formState[formKey] ?? ''}
        fullWidth
        onChange={({ target }) => {
          onFormChange(formKey, target.value);
        }}
        helperText={helperText}
      />
    );
  };

  return (
    <Grid container spacing={2} sx={{ maxWidth: 650 }}>
      <Grid xs={12} md={6}>
        {renderTextField({
          label: props.t('First name'),
          formKey: 'firstname',
        })}
      </Grid>
      <Grid xs={12} md={6}>
        {renderTextField({ label: props.t('Last name'), formKey: 'lastname' })}
      </Grid>
      <Grid xs={12} md={6}>
        <DatePicker
          label={props.t('DOB (optional)')}
          value={
            formState.date_of_birth
              ? moment(
                  formState.date_of_birth,
                  DateFormatter.dateTransferFormat
                )
              : null
          }
          sx={{ width: '100%' }}
          onChange={(date) => {
            onFormChange(
              'date_of_birth',
              date.format(DateFormatter.dateTransferFormat)
            );
          }}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <FormControl>
          <InputLabel id="language-label">{props.t('Language')}</InputLabel>
          <Select
            labelId="language-label"
            id="language-field"
            value={formState.locale ?? ''}
            displayEmpty
            fullWidth
            onChange={({ target }) => {
              onFormChange('locale', target.value);
            }}
          >
            {languageDropdownOptions.map(({ label, value }) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12} md={6}>
        <TextField
          label={props.t('Email')}
          value={formState.email ?? ''}
          error={isEmailValidationError}
          helperText={
            formState.email &&
            isEmailValidationError &&
            props.t('Please enter a valid email address')
          }
          fullWidth
          onBlur={onEmailBlur}
          onChange={({ target }) => {
            onFormChange('email', target.value);
          }}
        />
      </Grid>

      {activeSquad?.id && (
        <Grid xs={12} md={6}>
          <FormControl
            sx={{
              '& div, & label': disabledFieldStyle,
            }}
            disabled
          >
            <InputLabel id="squad-label">{props.t('Squad')}</InputLabel>
            <Select
              labelId="squad-label"
              id="squad-field"
              value={activeSquad?.id || ''}
              label={props.t('Squad')}
              fullWidth
            >
              {availableSquads.map(({ label, value }) => (
                <MenuItem value={value} key={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      <Grid xs={12} md={6}>
        <FormControl
          sx={{
            '& div, & label': disabledFieldStyle,
          }}
          disabled
        >
          <InputLabel id="role-label">{props.t('Role')}</InputLabel>
          <Select
            labelId="role-label"
            id="role-field"
            data-testid="additional-user-role"
            value={userType ?? ''}
            fullWidth
          >
            {RoleOptions.map(({ label, value }) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {showOrganisationField && (
        <Grid xs={12} md={6}>
          {renderTextField({
            label: props.t('Organization'),
            formKey: 'third_party_scout_organisation',
            helperText: 'Optional',
          })}
        </Grid>
      )}

      {isEditMode && (
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel id="status-label" sx={{ marginBottom: 0 }}>
              {props.t('Status')}
            </FormLabel>
            <RadioGroup
              aria-labelledby="status-label"
              row
              value={formState.is_active ? 1 : 0}
              onChange={({ target }) => {
                onFormChange('is_active', JSON.parse(target.value) === 1);
              }}
            >
              {statusOptions.map(({ label, value }) => (
                <FormControlLabel
                  key={value}
                  control={<Radio id={`status-${label}`} size="small" />}
                  label={label}
                  value={value}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      )}

      <Grid xs={12}>
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid>
            <Button
              color="secondary"
              onClick={() => {
                locationAssign(redirectUrl(userType));
              }}
            >
              {props.t('Cancel')}
            </Button>
          </Grid>
          <Grid>
            <Button
              color="primary"
              disabled={!canSubmit}
              onClick={onHandleSave}
            >
              {props.t('Save')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export const AdditionalUsersFormTranslated =
  withNamespaces()(AdditionalUsersForm);
export default AdditionalUsersForm;
