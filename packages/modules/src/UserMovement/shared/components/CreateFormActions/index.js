/* eslint-disable camelcase */
// @flow
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { Button } from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import {
  onReset,
  onToggleModal,
} from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';

import {
  getFormState,
  getValidationState,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';

import {
  TRADE,
  MEDICAL_TRIAL,
  RELEASE,
  RETIRE,
  MULTI_ASSIGN,
} from '@kitman/modules/src/UserMovement/shared/constants';

const commomButtonProps = {
  disableRipple: true,
  size: 'small',
};

const CreateFormActions = (props: I18nProps<{}>) => {
  const dispatch = useDispatch();

  const { join_organisation_ids, join_squad_ids, leave_organisation_ids } =
    useSelector(getValidationState);
  const { transfer_type } = useSelector(getFormState);

  const getRequiredValidation = () => {
    switch (transfer_type) {
      case TRADE:
        return [join_organisation_ids, join_squad_ids, leave_organisation_ids];
      case RETIRE:
      case RELEASE:
        return [leave_organisation_ids];
      case MULTI_ASSIGN:
        return [join_organisation_ids, join_squad_ids];
      case MEDICAL_TRIAL:
      default:
        return [join_organisation_ids];
    }
  };

  const getValidationStatus = () => {
    const requiredValidation = getRequiredValidation();
    const statuses = requiredValidation.map((i) => i.status);

    if (statuses.some((i) => i === 'INVALID')) return 'INVALID';
    if (statuses.every((i) => i === 'VALID')) return 'VALID';
    return 'PENDING';
  };

  const formValidationState = getValidationStatus();

  const isReviewDisabled =
    formValidationState === 'INVALID' || formValidationState === 'PENDING';

  return (
    <Fragment>
      <Button
        {...commomButtonProps}
        color="secondary"
        onClick={() => dispatch(onReset())}
      >
        {props.t('Cancel')}
      </Button>
      <Button
        {...commomButtonProps}
        color="primary"
        onClick={() => dispatch(onToggleModal())}
        disabled={isReviewDisabled}
      >
        {props.t('Review')}
      </Button>
    </Fragment>
  );
};

export const CreateFormActionsTranslated = withNamespaces()(CreateFormActions);
export default CreateFormActions;
