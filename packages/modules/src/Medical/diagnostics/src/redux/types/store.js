// @flow
import type { Toast } from '@kitman/components/src/types';

export type Store = {
  addDiagnosticAttachmentSidePanel: {
    isOpen: boolean,
    diagnosticId: number,
    athleteId: number,
  },

  toasts: Array<Toast>,
};
