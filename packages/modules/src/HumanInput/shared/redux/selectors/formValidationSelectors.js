/* eslint-disable max-nested-callbacks */
// @flow
import { createSelector } from '@reduxjs/toolkit';

import type { Store } from '@kitman/modules/src/HumanInput/types/forms';
import type {
  ValidationStatus,
  ValidationState,
} from '@kitman/modules/src/HumanInput/types/validation';
import { validationResult } from '@kitman/modules/src/HumanInput/shared/utils/validation';

import { REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';

export const getValidationState = (state: Store): ValidationState =>
  state[REDUCER_KEY].validation;

export const getValidationStateFactory = (): Array<ValidationStatus> =>
  createSelector([getValidationState], (validationState) =>
    // $FlowIgnore[incompatible-use] this is typed. status is a valid property. Go away.
    Object.values(validationState).map((i) => i.status)
  );

export const getFieldValidationFactory = (id: number): ValidationState =>
  createSelector(
    [getValidationState],
    (validationState) => validationState[id]
  );

export const getAllFieldsValidationFactory = (keys: Array<number>) => {
  return createSelector([getValidationState], (validationState) => {
    return (
      keys
        ?.map((key) => {
          if (Array.isArray(validationState[key])) {
            const validationStatusesForElement = validationState[key].map(
              (validationValue) => {
                const { status } = validationValue || {};
                return status;
              }
            );

            return validationStatusesForElement;
          }
          return validationState[key]?.status || null;
        })
        .flat() || []
    );
  });
};

export const getMenuGroupValidationFactory = (items: Array<Array<number>>) => {
  return createSelector([getValidationState], (validationState) => {
    return items?.map((item) =>
      item?.map((key) => {
        if (Array.isArray(validationState[key])) {
          const validationStatusesForElement = validationState[key].map(
            (validationValue) => {
              const { status } = validationValue || {};
              return status;
            }
          );

          if (
            validationStatusesForElement.length > 0 &&
            validationStatusesForElement.some(
              (status) => status === validationResult.INVALID
            )
          ) {
            return validationResult.INVALID;
          }
          if (
            validationStatusesForElement.length > 0 &&
            validationStatusesForElement.every(
              (status) => status === validationResult.VALID
            )
          ) {
            return validationResult.VALID;
          }
          return validationResult.PENDING;
        }
        return validationState[key]?.status;
      })
    );
  });
};

export const getChildValidationValuesFactory = (ids: Array<number>) =>
  createSelector([getValidationState], (validationState) => {
    return ids.reduce((acc, elementId) => {
      return { ...acc, [elementId]: validationState[elementId] };
    }, {});
  });
