// @flow
import { createSelector } from '@reduxjs/toolkit';

import type { Store } from '@kitman/modules/src/ConditionalFields/shared/redux/types';

import { REDUCER_KEY } from '../slices/conditionBuildViewSlice';

export const selectActiveCondition = (state: Store) =>
  state[REDUCER_KEY].activeCondition;

export const selectAllConditions = (state: Store) =>
  state[REDUCER_KEY].allConditions;

export const selectRequestStatus = (state: Store) =>
  state[REDUCER_KEY].requestStatus;

export const selectValidationStatus = (state: Store) =>
  state[REDUCER_KEY].validationStatus;

export const selectFlattenedNames = (state: Store) =>
  state[REDUCER_KEY].flattenedNames;

export const selectPredicateOperand = (index: number) =>
  createSelector(
    [selectActiveCondition],
    (activeCondition) => activeCondition?.predicate?.operands[index]
  );
