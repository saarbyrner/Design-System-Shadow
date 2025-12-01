// @flow
import type { Store } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { ContactWithId } from '@kitman/modules/src/Contacts/shared/types';

import { REDUCER_KEY } from '@kitman/modules/src/Contacts/src/redux/slices/contactsSlice';

export const getModal = (
  state: Store
): {
  isOpen: boolean,
  contact: ContactWithId | null,
} => state[REDUCER_KEY]?.modal;

export const getIsModalOpen = (state: Store): boolean =>
  state[REDUCER_KEY]?.modal.isOpen;
