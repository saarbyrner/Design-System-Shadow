/* eslint-disable camelcase */
// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Node } from 'react';
import {
  getFormState,
  getFieldValidationFactory,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import {
  onUpdateCreateMovementForm,
  onUpdateValidation,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import type { ValidationStatus } from '@kitman/modules/src/UserMovement/shared/types';
import {
  Button,
  FormControl,
  Autocomplete,
  MenuItem,
  Typography,
} from '@kitman/playbook/components';
import { useSearchMovementOrganisationsListQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';

import {
  getMovementToLabel,
  getMovementToSquadLabel,
  getCreateRecordQueryParams,
  getMovementAlertNoDataContent,
  getRetryText,
  getMovementAlertTitle,
} from '../../config';
import {
  getValueForField,
  sharedAutoCompleteOverrides,
  renderAutocompleteInput,
} from '../../utils';

import MovementAlert from '../MovementAlert';
import OrganisationSelectOption from '../OrganisationSelectOption';

const MovementToSelect = (props: I18nProps<{}>): Node => {
  const dispatch = useDispatch();

  const KEYS = {
    joinOrganisationIds: 'join_organisation_ids',
    joinSquadIds: 'join_squad_ids',
  };

  const { user_id, transfer_type, join_organisation_ids, join_squad_ids } =
    useSelector(getFormState);

  const validationStatus: {
    status: ValidationStatus,
    message: ?string,
  } = useSelector(getFieldValidationFactory(KEYS.joinOrganisationIds));

  const fieldLabel = getMovementToLabel({ type: transfer_type });
  const squadFieldLabel = getMovementToSquadLabel({ type: transfer_type });

  const isError = validationStatus.status === 'INVALID';

  const {
    data: movementOrganisationOptions,
    isLoading: isMovementOrganisationLoading,
    isSuccess: isMovementOrganisationSuccess,
    isError: isMovementOrganisationError,
    refetch: onRefetchMovementOrganisations,
  } = useSearchMovementOrganisationsListQuery(
    getCreateRecordQueryParams({ type: transfer_type, user_id }),
    {
      skip: !user_id || !transfer_type,
    }
  );

  const onHandleChange = (_, value) => {
    const isValid = !value === undefined || !value === null || !!value;
    dispatch(
      onUpdateValidation({
        [KEYS.joinOrganisationIds]: {
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
    // invalidate the squad field if squad ids array is empty
    if (join_squad_ids.length > 0) {
      dispatch(
        onUpdateValidation({
          [KEYS.joinSquadIds]: {
            status: 'INVALID',
            message: props.t('{{field}} is a required field', {
              field: squadFieldLabel,
              interpolation: { escapeValue: false },
            }),
          },
        })
      );
    }

    if (value === null) {
      dispatch(
        onUpdateCreateMovementForm({
          join_organisation_ids: [],
          join_squad_ids: [],
        })
      );
    } else {
      dispatch(
        onUpdateCreateMovementForm({
          join_organisation_ids: [value.id],
        })
      );
    }
  };

  const isNoDataError =
    isMovementOrganisationSuccess && movementOrganisationOptions?.length === 0;

  const isDisabled =
    isNoDataError ||
    isMovementOrganisationError ||
    isMovementOrganisationLoading;

  const renderLabel = () => {
    return <Typography variant="caption">{fieldLabel}</Typography>;
  };

  const renderNoDataAlert = (): Node => {
    return (
      <MovementAlert
        severity="error"
        config={{ ...getMovementAlertNoDataContent({ type: transfer_type }) }}
      />
    );
  };
  const renderError = () => {
    return (
      <MovementAlert
        action={
          <Button
            color="primary"
            size="small"
            disableRipple
            onClick={onRefetchMovementOrganisations}
          >
            {getRetryText({ type: transfer_type })}
          </Button>
        }
        severity="error"
        config={{
          title: getMovementAlertTitle({ type: transfer_type }),
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
    return isMovementOrganisationError ? `${props.t('Error')}.` : null;
  };

  const renderContent = () => {
    if (isMovementOrganisationError) return renderError();
    return (
      <FormControl variant="outlined">
        {renderLabel()}
        <Autocomplete
          value={getValueForField(
            movementOrganisationOptions,
            join_organisation_ids[0]
          )}
          disablePortal
          disabled={isDisabled}
          id="movement-to-async-select"
          options={movementOrganisationOptions ?? []}
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

export default MovementToSelect;

export const MovementToSelectTranslated = withNamespaces()(MovementToSelect);
