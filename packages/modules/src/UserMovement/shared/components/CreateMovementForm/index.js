/* eslint-disable camelcase */
// @flow
import { useSelector } from 'react-redux';
import { getFormState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import {
  TRADE,
  RELEASE,
  MEDICAL_TRIAL,
  MULTI_ASSIGN,
} from '@kitman/modules/src/UserMovement/shared/constants';

import { CreateReleaseMovementTranslated as CreateReleaseMovement } from '../CreateReleaseMovement';

import CreateTradeMovement from '../CreateTradeMovement';
import CreateMedicalTrial from '../CreateMedicalTrial';
import CreateMultiAssignMovement from '../CreateMultiAssignMovement';

const NotYetImplementedOrSupported = () => {
  return <div data-testid="not-yet-supported-or-implemented" />;
};

const CreateMovementForm = () => {
  const { transfer_type } = useSelector(getFormState);

  switch (transfer_type) {
    case TRADE:
      return <CreateTradeMovement />;
    case MULTI_ASSIGN:
      return <CreateMultiAssignMovement />;
    case RELEASE:
      return <CreateReleaseMovement />;
    case MEDICAL_TRIAL:
      return <CreateMedicalTrial />;
    default:
      return <NotYetImplementedOrSupported />;
  }
};

export default CreateMovementForm;
