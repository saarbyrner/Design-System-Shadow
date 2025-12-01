// @flow
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getElementState,
  getFormState,
  getFieldValueFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { validateElement } from '@kitman/modules/src/HumanInput/shared/utils';
import { onUpdateValidation } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { getFieldValidationFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors';
import { onUpdateField } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import type {
  Condition,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';

type Args = {
  element: HumanInputFormElement,
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
};

type ReturnType = {
  onChange: Function,
};

const useConditionalValidation = (args: Args): ReturnType => {
  const dispatch = useDispatch();
  const elements = useSelector(getElementState);
  const formState = useSelector(getFormState);
  const currentValue = useSelector(getFieldValueFactory(args.element.id));
  const currentValidationValue = useSelector(
    getFieldValidationFactory(args.element.id)
  );
  const { repeatableGroupInfo } = args;

  const { custom_params: customParams } = args?.element?.config || {};
  const conditionalValidation = customParams?.validation || null;

  const determineValidity = useCallback(
    (validation: Condition) => {
      const targetElement = elements[validation.element_id];
      const currentElement = args.element;

      const targetElementValue = formState[targetElement.id];

      let isValid;
      let message = null;

      if (args.element.element_type === INPUT_ELEMENTS.DateTime) {
        isValid = moment(
          moment(targetElementValue).format('YYYY-MM-DD')
        ).isSame(moment(currentValue).format('YYYY-MM-DD'), 'day');

        message = i18n.t('{{currentField}} must match {{targetField}}', {
          currentField: currentElement.config.text,
          targetField: targetElement.config.text,
          interpolation: { escapeValue: false },
        });
      } else {
        isValid = targetElementValue === currentValue;
      }

      return {
        status: isValid ? 'VALID' : 'INVALID',
        message,
      };
    },
    // Purposely ignoring. We only want to run on the affected field
    [args.element, currentValue]
  );

  const isConditionalValidationSatisfied = useCallback(
    (validation) => {
      return determineValidity(validation);
    },
    [determineValidity]
  );

  useEffect(() => {
    let status;
    let message;

    if (conditionalValidation && currentValue) {
      const vResult = isConditionalValidationSatisfied(conditionalValidation);
      status = vResult.status;
      message = vResult.message;

      dispatch(
        onUpdateValidation({
          [args.element.id]: {
            status,
            message,
          },
        })
      );
    }
  }, [
    dispatch,
    currentValue,
    args.element,
    isConditionalValidationSatisfied,
    conditionalValidation,
  ]);

  const onChange = (inputValue) => {
    let newElementValue = inputValue;

    // The 'Repeatable group' concept supports users to 'Add another' response to questions with 1..N answers"
    // Repeatable groups have elements whose answers are arrays corresponding to each additional response

    // if an element is a child of a repeatable group
    // we need to store the answer depending on the group number
    // the group number will be the index to access the answer in the array
    // elementId: ['answer 1', 'answer 2', ...]

    if (repeatableGroupInfo?.repeatable && Array.isArray(currentValue)) {
      newElementValue = [...currentValue];
      newElementValue[repeatableGroupInfo?.groupNumber] = inputValue;
    }
    dispatch(
      onUpdateField({
        [args.element.id]: newElementValue,
      })
    );

    const vResult = validateElement(args.element, inputValue);
    const status = vResult.status;
    const message = vResult.message;

    let newValidationValue = [];

    // same logic as above with validation state
    // elementId: [{status: '..', message: '...'}, {status: '..', message: '...'}, ...]
    if (
      repeatableGroupInfo?.repeatable &&
      Array.isArray(currentValidationValue)
    ) {
      newValidationValue = [...currentValidationValue];
      newValidationValue[repeatableGroupInfo?.groupNumber] = vResult;

      dispatch(
        onUpdateValidation({
          [args.element.id]: newValidationValue,
        })
      );
    } else {
      dispatch(
        onUpdateValidation({
          [args.element.id]: {
            status,
            message,
          },
        })
      );
    }
  };

  return {
    onChange,
  };
};

export default useConditionalValidation;
