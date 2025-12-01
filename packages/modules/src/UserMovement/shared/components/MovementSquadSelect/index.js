/* eslint-disable camelcase */
// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Node } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getFormState,
  getFieldValidationFactory,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import {
  onUpdateCreateMovementForm,
  onUpdateValidation,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import type { ValidationStatus } from '@kitman/modules/src/UserMovement/shared/types';
import { useSearchAvailableSquadsQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';
import {
  Button,
  FormControl,
  Autocomplete,
  MenuItem,
  Typography,
} from '@kitman/playbook/components';
import { getMovementToSquadLabel, getRetryText } from '../../config';

import {
  getValueForField,
  sharedAutoCompleteOverrides,
  renderAutocompleteInput,
} from '../../utils';

import MovementAlert from '../MovementAlert';
import OrganisationSelectOption from '../OrganisationSelectOption';

const MovementSquadSelect = (props: I18nProps<{}>): Node => {
  const dispatch = useDispatch();

  const KEY = 'join_squad_ids';

  const { transfer_type, join_organisation_ids, join_squad_ids } =
    useSelector(getFormState);

  const validationStatus: {
    status: ValidationStatus,
    message: ?string,
  } = useSelector(getFieldValidationFactory(KEY));

  const fieldLabel = getMovementToSquadLabel({ type: transfer_type });

  const isError = validationStatus.status === 'INVALID';

  const {
    data: availableSquadsOptions,
    isLoading: isAvailableSquadsLoading,
    isSuccess: isAvailableSquadsSuccess,
    isError: isAvailableSquadsError,
    refetch: onRefetchAvailableSquadsOptions,
  } = useSearchAvailableSquadsQuery(
    {
      id: join_organisation_ids[0],
    },
    { skip: join_organisation_ids.length === 0 }
  );

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
        join_squad_ids: value ? [value.id] : [],
      })
    );
  };

  const isDisabled =
    !availableSquadsOptions?.length > 0 ||
    isAvailableSquadsError ||
    isAvailableSquadsLoading ||
    join_organisation_ids?.length === 0;

  const isNoDataError =
    isAvailableSquadsSuccess && availableSquadsOptions?.length === 0;

  const renderLabel = () => {
    return <Typography variant="caption">{fieldLabel}</Typography>;
  };

  const renderNoDataAlert = (): Node => {
    return (
      <MovementAlert
        severity="error"
        config={{
          title: props.t('No teams'),
          message: props.t(
            'There are no teams associated with this organisation'
          ),
        }}
      />
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
    return isAvailableSquadsError ? `${props.t('Error')}.` : null;
  };

  const renderError = () => {
    return (
      <MovementAlert
        action={
          <Button
            color="primary"
            size="small"
            disableRipple
            onClick={onRefetchAvailableSquadsOptions}
          >
            {getRetryText({ type: transfer_type })}
          </Button>
        }
        severity="error"
        config={{
          title: props.t('No teams'),
          message: props.t('Team options failed to load'),
        }}
      />
    );
  };

  const renderContent = () => {
    if (isAvailableSquadsError) return renderError();
    return (
      <FormControl variant="outlined">
        {renderLabel()}
        <Autocomplete
          value={getValueForField(availableSquadsOptions, join_squad_ids[0])}
          disablePortal
          disabled={isDisabled}
          id="movement-to-async-select"
          options={availableSquadsOptions ?? []}
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

  return renderContent();
};

export default MovementSquadSelect;

export const MovementSquadSelectTranslated =
  withNamespaces()(MovementSquadSelect);
