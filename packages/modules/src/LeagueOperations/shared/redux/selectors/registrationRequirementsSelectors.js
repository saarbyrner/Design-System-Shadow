// @flow
import type {
  Store,
  User,
  MultiRegistration,
  SectionFormElement,
  RegistrationStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  RegistrationStatusEnum,
  FALLBACK_REGISTRATION_SYSTEM_STATUS,
  type RegistrationSystemStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { createSelector } from '@reduxjs/toolkit';
import { REDUCER_KEY } from '../slices/registrationRequirementsSlice';
import { registrationProfileApi } from '../api/registrationProfileApi';
import { registrationFormApi } from '../api/registrationFormApi';

import {
  sharedGetIsPanelOpen,
  sharedGetIsSubmitStatusDisabled,
  sharedGetSelectedApprovalStatus,
  sharedGetSelectedApprovalAnnotation,
  sharedGetIsSubmitDisabled,
  sharedGetStatuses,
} from './sharedSelectors';

export const getRequirementId = (state: Store): number =>
  state[REDUCER_KEY].requirementId;

export const getUserId = (state: Store): number => state[REDUCER_KEY].userId;

export const getRegistrationProfile = (state: Store): User =>
  state[REDUCER_KEY].profile;

export const getRegistrationProfileResult = (params: { id: number }) => {
  return registrationProfileApi.endpoints.fetchRegistrationProfile.select(
    params
  );
};

export const getRegistrationProfileStatus = (): string =>
  createSelector([getRegistrationProfile], (registrationProfile) => {
    return (
      registrationProfile?.registration_status?.status ||
      RegistrationStatusEnum.INCOMPLETE
    );
  });

export const getRegistrationSystemStatusForCurrentRequirement =
  (): RegistrationSystemStatus =>
    createSelector(
      [getRequirementId, getRegistrationProfile],
      (requirementId, registrationProfile) => {
        return (
          registrationProfile?.registrations?.find(
            (registration) =>
              registration.registration_requirement.id === Number(requirementId)
          )?.registration_system_status ?? FALLBACK_REGISTRATION_SYSTEM_STATUS
        );
      }
    );

export const getRequirementsProfileFormResult = (params: {
  user_id: number,
  requirements_id: number,
}) => {
  return registrationFormApi.endpoints.fetchRegistrationRequirementsProfileForm.select(
    params
  );
};

export const getIsPanelOpen = (state: Store): boolean =>
  sharedGetIsPanelOpen(state, REDUCER_KEY);

export const getPanelFormElement = (state: Store): SectionFormElement =>
  state[REDUCER_KEY].panel.formElement;
export const getPanelFormSectionId = (state: Store): number =>
  state[REDUCER_KEY].panel.sectionId;

export const getPanelStatus = (state: Store): RegistrationStatus =>
  state[REDUCER_KEY].panel.status;

export const getPanelRegistrationSystemStatus = (
  state: Store
): RegistrationSystemStatus =>
  state[REDUCER_KEY].panel.registrationSystemStatus;

export const getRequirementById = (): ?MultiRegistration =>
  createSelector(
    [getRequirementId, getRegistrationProfile],
    (requirementId, profile) => {
      const registrations = profile?.registrations || [];

      return registrations.find(
        (i) => String(i.registration_requirement.id) === String(requirementId)
      );
    }
  );

export const getIsSubmitStatusDisabled = (state: Store): boolean =>
  sharedGetIsSubmitStatusDisabled(state, REDUCER_KEY);

export const getSelectedApprovalStatus = (state: Store): RegistrationStatus =>
  sharedGetSelectedApprovalStatus(state, REDUCER_KEY);

export const getSectionStatuses = (state: Store): RegistrationStatus =>
  sharedGetStatuses(state, REDUCER_KEY);

export const getSelectedApprovalAnnotation = (state: Store): string =>
  sharedGetSelectedApprovalAnnotation(state, REDUCER_KEY);

export const getIsSubmitDisabledFactory = (): boolean =>
  createSelector(
    [getSelectedApprovalStatus, getSelectedApprovalAnnotation],
    (approvalStatus, annotation) => {
      return sharedGetIsSubmitDisabled(approvalStatus, annotation);
    }
  );

export const getRegistrationSectionStatus = () =>
  createSelector(
    [getSelectedApprovalStatus, getSectionStatuses],
    (approvalStatus, statuses) => {
      return statuses?.filter((status) => status.type === approvalStatus);
    }
  );
