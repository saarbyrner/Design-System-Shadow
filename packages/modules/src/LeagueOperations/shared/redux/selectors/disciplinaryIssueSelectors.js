// @flow
import type { Store } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  DisciplinaryIssueMode,
  DisciplineProfile,
  CreateDisciplinaryIssueParams,
  DisciplineActiveIssue,
} from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import {
  CREATE_DISCIPLINARY_ISSUE,
  UPDATE_DISCIPLINARY_ISSUE,
  DELETE_DISCIPLINARY_ISSUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import { REDUCER_KEY } from '../slices/disciplinaryIssueSlice';
import { sharedGetIsPanelOpen } from './sharedSelectors';

export const getIsCreatePanelOpen = (state: Store): boolean =>
  sharedGetIsPanelOpen(state, REDUCER_KEY) &&
  (state[REDUCER_KEY]?.panel?.mode || CREATE_DISCIPLINARY_ISSUE) ===
    CREATE_DISCIPLINARY_ISSUE;

export const getIsUpdatePanelOpen = (state: Store): boolean =>
  sharedGetIsPanelOpen(state, REDUCER_KEY) &&
  state[REDUCER_KEY]?.panel?.mode === UPDATE_DISCIPLINARY_ISSUE;

export const getIsCreateModalOpen = (state: Store): boolean =>
  (state[REDUCER_KEY]?.modal?.isOpen || false) &&
  state[REDUCER_KEY]?.panel?.mode === CREATE_DISCIPLINARY_ISSUE;

export const getIsUpdateModalOpen = (state: Store): boolean =>
  (state[REDUCER_KEY]?.modal?.isOpen || false) &&
  (state[REDUCER_KEY]?.panel?.mode || UPDATE_DISCIPLINARY_ISSUE) ===
    UPDATE_DISCIPLINARY_ISSUE;

export const getIsDeleteModalOpen = (state: Store): boolean =>
  (state[REDUCER_KEY]?.modal?.isOpen || false) &&
  (state[REDUCER_KEY]?.panel?.mode || DELETE_DISCIPLINARY_ISSUE) ===
    DELETE_DISCIPLINARY_ISSUE;

export const getDisciplineProfileId = (state: Store): ?number =>
  state[REDUCER_KEY]?.panel?.profile?.id || null;

export const getDisciplineProfile = (state: Store): ?DisciplineProfile =>
  state[REDUCER_KEY]?.panel?.profile || null;

export const getDisciplinaryIssueMode = (state: Store): DisciplinaryIssueMode =>
  state[REDUCER_KEY]?.panel?.mode || CREATE_DISCIPLINARY_ISSUE;

export const getUserToBeDisciplined = (state: Store): ?DisciplineProfile =>
  state[REDUCER_KEY]?.panel?.userToBeDisciplined || null;

export const getCurrentDisciplinaryIssue = (
  state: Store
): CreateDisciplinaryIssueParams => state[REDUCER_KEY]?.issue || null;

export const getActiveDisciplinaryIssue = (
  state: Store
): ?DisciplineActiveIssue => state[REDUCER_KEY]?.active_discipline || null;
