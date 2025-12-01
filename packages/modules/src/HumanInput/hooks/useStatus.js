// @flow
import { useSelector } from 'react-redux';
import { getAllFieldsValidationFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors';

import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';
import {
  VALID,
  INVALID,
  PENDING,
} from '@kitman/modules/src/HumanInput/types/validation';

type ReturnType = ValidationStatus;

type Props = {
  fields: Array<number>,
};

// Whats happening here?
// Previously, state was initialized with a menu. A Menu, in DB terms, contains an list of form_elements
// of type MenuGroup or MenuItem.
// Within LOPS registration, there is a requirement to show the status for each section (MenuGroup)
// and each form (MenuItem). To do this, a list of keys is stored against a menu item.
// This list of keys contains all the available input elements within the current form_elements scope.
// We pass this list of keys in and check the validaiton status in state to determine the overall status.

const useStatus = (props: Props): ReturnType => {
  const validationStatus: Array<ValidationStatus> = useSelector(
    getAllFieldsValidationFactory(props.fields)
  );

  if (validationStatus.some((i) => i === INVALID)) return INVALID;
  if (validationStatus.length && validationStatus.every((i) => i === VALID))
    return VALID;

  return PENDING;
};
export default useStatus;
