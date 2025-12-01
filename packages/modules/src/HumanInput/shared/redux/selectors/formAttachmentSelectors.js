// @flow
import { createSelector } from '@reduxjs/toolkit';

import type {
  FormMenu,
  Store,
} from '@kitman/modules/src/HumanInput/types/forms';

import { REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';

export const getQueueState = (state: Store): FormMenu =>
  state[REDUCER_KEY].queue;

export const getQueueFactory = (id: number) =>
  createSelector([getQueueState], (queueState) => queueState[id]);
