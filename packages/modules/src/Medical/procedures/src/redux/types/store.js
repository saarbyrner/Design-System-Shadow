// @flow
import type { Toast } from '@kitman/components/src/types';

export type Store = {
  addProcedureSidePanel: {
    isOpen: boolean,
    procedureId: number,
    athleteId: number,
  },
  toasts: Array<Toast>,
};
