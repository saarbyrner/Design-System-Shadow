// @flow
import { createSelector } from '@reduxjs/toolkit';
import type {
  Store,
  RegistrationStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { REDUCER_KEY } from '../slices/registrationApprovalSlice';
import {
  sharedGetIsPanelOpen,
  sharedGetIsSubmitStatusDisabled,
  sharedGetSelectedApprovalStatus,
  sharedGetSelectedApprovalAnnotation,
  sharedGetIsSubmitDisabled,
  sharedGetStatuses,
} from './sharedSelectors';

export const getIsPanelOpen = (state: Store): boolean =>
  sharedGetIsPanelOpen(state, REDUCER_KEY);

export const getIsSubmitStatusDisabled = (state: Store): boolean =>
  sharedGetIsSubmitStatusDisabled(state, REDUCER_KEY);

export const getSelectedApprovalStatus = (state: Store): RegistrationStatus =>
  sharedGetSelectedApprovalStatus(state, REDUCER_KEY);

export const getSelectedApprovalAnnotation = (state: Store): string =>
  sharedGetSelectedApprovalAnnotation(state, REDUCER_KEY);

export const getRegistrationFormStatuses = (state: Store): string =>
  sharedGetStatuses(state, REDUCER_KEY);

export const getIsSubmitDisabledFactory = (): boolean =>
  createSelector(
    [getSelectedApprovalStatus, getSelectedApprovalAnnotation],
    (approvalStatus, annotation) => {
      return sharedGetIsSubmitDisabled(approvalStatus, annotation);
    }
  );

export const getRegistrationFormStatus = () =>
  createSelector(
    [getSelectedApprovalStatus, getRegistrationFormStatuses],
    (approvalStatus, statuses) => {
      return statuses?.filter((status) => status.type === approvalStatus);
    }
  );
