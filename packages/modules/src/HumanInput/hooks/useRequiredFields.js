// @flow
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { getElementsFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

export type ReturnType = {
  showOptionalIndicator: boolean,
  showRequiredIndicator: boolean,
};

const useRequiredFields = (): ReturnType => {
  const elements: HumanInputFormElement[] = useSelector(getElementsFactory());

  const requiredFields = useMemo(
    () =>
      // $FlowIgnore[incompatible-call] the selector returns a typed array
      Object.values(elements).reduce(
        (acc, elem: HumanInputFormElement) =>
          !elem.config?.optional ? acc + 1 : acc,
        0
      ),
    [elements]
  );

  const optionalFields = useMemo(
    () =>
      // $FlowIgnore[incompatible-call] the selector returns a typed array
      Object.values(elements).reduce(
        (acc, elem: HumanInputFormElement) =>
          elem.config?.optional ? acc + 1 : acc,
        0
      ),
    [elements]
  );

  if (requiredFields === 0 && optionalFields === 0) {
    return {
      showOptionalIndicator: false,
      showRequiredIndicator: false,
    };
  }

  return {
    showOptionalIndicator: requiredFields >= optionalFields,
    showRequiredIndicator: requiredFields < optionalFields,
  };
};

export default useRequiredFields;
