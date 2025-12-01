// @flow
import {
  REDUCER_KEY,
  type AthleteProfileState,
  type ThirdPartySettings,
} from '@kitman/modules/src/AthleteProfile/redux/slices/athleteProfileSlice';
import {
  REDUCER_KEY as GUARDIANS_TAB_REDUCER_KEY,
  type GuardianSidePanelState,
  type GuardiansTabState,
  type GuardianForm,
  type DeleteGuardianModalState,
} from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';
import { type Mode } from '@kitman/modules/src/HumanInput/types/forms';
import { createSelector } from 'reselect';

export const getThirdPartySettingsState = (
  state: AthleteProfileState
): ThirdPartySettings => state[REDUCER_KEY].thirdPartySettings;

export const getGuardianSidePanelState = (
  state: GuardiansTabState
): GuardianSidePanelState => state[GUARDIANS_TAB_REDUCER_KEY].guardianSidePanel;

export const getDeleteGuardianModalState = (
  state: GuardiansTabState
): DeleteGuardianModalState =>
  state[GUARDIANS_TAB_REDUCER_KEY].deleteGuardianModal;

export const getIsOpenGuardianSidePanelFactory = (): boolean =>
  createSelector(
    [getGuardianSidePanelState],
    (guardianSidePanelState) => guardianSidePanelState?.isOpen
  );

export const getIsOpenDeleteGuardianModalFactory = (): boolean =>
  createSelector(
    [getDeleteGuardianModalState],
    (deleteGuardianModalState) => deleteGuardianModalState?.isOpen
  );

export const getGuardianFormFactory = (): GuardianForm =>
  createSelector(
    [getGuardianSidePanelState],
    (guardianSidePanelState) => guardianSidePanelState?.form || {}
  );

export const getDeleteGuardianFormFactory = (): string =>
  createSelector(
    [getDeleteGuardianModalState],
    (deleteGuardianModalState) => deleteGuardianModalState?.form || {}
  );

export const getModeFactory = (): Mode =>
  createSelector(
    [getGuardianSidePanelState],
    (guardianSidePanelState) => guardianSidePanelState?.mode
  );
