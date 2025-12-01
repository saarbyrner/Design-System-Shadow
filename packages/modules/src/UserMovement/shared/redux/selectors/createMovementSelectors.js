// @flow
import { createSelector } from '@reduxjs/toolkit';
import type {
  Store,
  MovementOrganisation,
} from '@kitman/modules/src/UserMovement/shared/types/index';

import type {
  FormState,
  ElementOpenState,
  ValidationState,
  ValidationStatus,
} from '../../types';

import { REDUCER_KEY } from '../slices/createMovementSlice';

export type Selector<T> = (state: Store) => T;

export const getDrawerState = (state: Store): ElementOpenState =>
  state[REDUCER_KEY].drawer;

export const getModalState = (state: Store): ElementOpenState =>
  state[REDUCER_KEY].modal;

export const getFormState = (state: Store): FormState =>
  state[REDUCER_KEY].form;

export const getValidationState = (state: Store): ValidationState =>
  state[REDUCER_KEY].validation;

export const getValidationStateFactory = (): Array<ValidationStatus> =>
  createSelector([getValidationState], (validationState) =>
    // $FlowIgnore[incompatible-use] this is typed. status is a valid property. Go away.
    Object.values(validationState).map((i) => i.status)
  );

export const getFieldValidationFactory = (key: string): ValidationState =>
  createSelector(
    [getValidationState],
    (validationState) => validationState[key]
  );

export const getMovingToOrganisationFactory = (
  orgs: Array<MovementOrganisation>
): ?MovementOrganisation =>
  createSelector(
    [getFormState],
    (formState) =>
      orgs?.find((org) => org.id === formState.join_organisation_ids[0]) || null
  );
