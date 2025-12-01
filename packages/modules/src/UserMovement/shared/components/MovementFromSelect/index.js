/* eslint-disable camelcase */
// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { Node } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  FormControl,
  Autocomplete,
  MenuItem,
  Typography,
} from '@kitman/playbook/components';
import type { UserData } from '@kitman/services/src/services/fetchUserData';
import { getUserProfile } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import {
  getFormState,
  getFieldValidationFactory,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import {
  onUpdateCreateMovementForm,
  onUpdateValidation,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import type { ValidationStatus } from '@kitman/modules/src/UserMovement/shared/types';
import { getMovementFromLabel } from '../../config';
import MovementAlert from '../MovementAlert';
import OrganisationSelectOption from '../OrganisationSelectOption';

import {
  getValueForField,
  sharedAutoCompleteOverrides,
  renderAutocompleteInput,
} from '../../utils';

const MovementFromSelect = (props: I18nProps<{}>): Node => {
  const dispatch = useDispatch();

  const KEY = 'leave_organisation_ids';

  const { user_id, transfer_type, leave_organisation_ids } =
    useSelector(getFormState);

  const profile: UserData = useSelector(
    getUserProfile({
      userId: user_id,
      include_athlete: true,
    })
  );

  const validationStatus: {
    status: ValidationStatus,
    message: ?string,
  } = useSelector(getFieldValidationFactory(KEY));

  const fieldLabel = getMovementFromLabel({ type: transfer_type });

  const isNoDataError = profile?.athlete?.organisations?.length === 0;

  const isDisabled = isNoDataError;
  const isError = validationStatus.status === 'INVALID';

  const renderNoDataAlert = (): Node => {
    return (
      <MovementAlert
        severity="error"
        config={{
          title: props.t('No organisations'),
          message: props.t(
            'There are no organisation associated with this athlete'
          ),
        }}
      />
    );
  };

  const renderLabel = () => {
    return <Typography variant="caption">{fieldLabel}</Typography>;
  };

  const onHandleChange = (_, value) => {
    const isValid = !value === undefined || !value === null || !!value;
    dispatch(
      onUpdateValidation({
        [KEY]: {
          status: isValid ? 'VALID' : 'INVALID',
          message: !isValid
            ? props.t('{{field}} is a required field', {
                field: fieldLabel,
                interpolation: { escapeValue: false },
              })
            : null,
        },
      })
    );
    dispatch(
      onUpdateCreateMovementForm({
        [KEY]: value ? [value.id] : [],
      })
    );
  };

  const renderOption = (renderOptionProps, organisation) => {
    return (
      <MenuItem {...renderOptionProps} key={organisation.id}>
        <OrganisationSelectOption organisation={organisation} />
      </MenuItem>
    );
  };

  const getHelperText = () => {
    if (isError) {
      return validationStatus.message;
    }
    return profile?.athlete?.organisations?.length === 0
      ? `${props.t('Error')}.`
      : null;
  };

  return (
    <FormControl variant="outlined">
      {renderLabel()}
      <Autocomplete
        value={getValueForField(
          profile?.athlete?.organisations || [],
          leave_organisation_ids[0]
        )}
        disablePortal
        disabled={isDisabled}
        id="movement-to-async-select"
        options={profile?.athlete?.organisations ?? []}
        onChange={onHandleChange}
        sx={sharedAutoCompleteOverrides.baseProps}
        getOptionLabel={(options) => `${options.name}`}
        ListboxProps={sharedAutoCompleteOverrides.listProps}
        renderOption={renderOption}
        renderInput={(inputParams) =>
          renderAutocompleteInput({
            inputParams,
            getHelperText,
            isError,
          })
        }
        PopperComponent={sharedAutoCompleteOverrides.popper}
      />
      {isNoDataError && renderNoDataAlert()}
    </FormControl>
  );
};

export default MovementFromSelect;
export const MovementFromSelectTranslated =
  withNamespaces()(MovementFromSelect);
