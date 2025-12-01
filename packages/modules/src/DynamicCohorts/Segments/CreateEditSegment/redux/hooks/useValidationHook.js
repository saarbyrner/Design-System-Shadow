// @flow
import { useDispatch } from 'react-redux';
import { isEmptyString } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/helpers';
import { onUpdateErrorState } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import type { Predicate } from '@kitman/modules/src/ConditionalFields/shared/types/index';
import { mapExpressionToLabels } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/utils';

const useValidationHook = () => {
  const dispatch = useDispatch();

  const validateName = (name: string) => {
    let isInvalid = false;
    if (isEmptyString(name)) {
      isInvalid = true;
    }
    dispatch(onUpdateErrorState({ formInputKey: 'name', isInvalid }));
  };

  const validateExpression = (expression: Predicate) => {
    let isInvalid = false;
    if (!expression || !mapExpressionToLabels(expression)?.length) {
      isInvalid = true;
    }
    dispatch(
      onUpdateErrorState({
        formInputKey: 'expression',
        isInvalid,
      })
    );
  };

  return {
    validateName,
    validateExpression,
  };
};

export default useValidationHook;
