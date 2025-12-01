// @flow
import type { ModalStatus } from '@kitman/common/src/types';
import type { Event, Squad, Participant } from '../../types';

export type Store = {
  staticData: {
    availableSquads: Array<Squad>,
    primarySquads: Array<?Squad>,
  },
  participantForm: {
    event: Event,
    participants: Array<Participant>,
  },
  appStatus: {
    status: ModalStatus,
  },
};
