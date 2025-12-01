// @flow
import { useContext, createContext, useReducer } from 'react';
import type { Node } from 'react';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { Dispatch } from '../../../../types';

type ReconciledDiagnostic = {
  diagnosticId: number,
  athleteId: number,
  reviewed?: boolean,
  reasonId?: number,
  value?: string,
  issue?: {
    id: string,
    type: string,
  },
};

type ReviewedDiagnostic = {
  diagnosticId: number,
  athleteId: number,
  reasonId?: number,
  reviewed?: boolean,
  value?: string,
  issue?: {
    id: string,
    type: string,
  },
};

export type DiagnosticTabFormState = {
  queuedReconciledDiagnostics: Array<ReconciledDiagnostic>,
  rowsToReconcile: Array<number>,
  playerOpts: { [key: number]: Option },
  playerInjuryIllnessOpts: { [key: number]: Array<Option> },
  queuedReviewedDiagnostic: Array<ReviewedDiagnostic>,
};

type Props = {
  children: Node,
};

export type DiagnosticTabFormAction =
  | {
      type: 'UPDATE_QUEUED_RECONCILED_DIAGNOSTICS',
      queuedReconciledDiagnostic: ReconciledDiagnostic,
      index: number,
    }
  | {
      type: 'UPDATE_ROWS_TO_RECONCILE',
      diagnosticId: number,
    }
  | {
      type: 'UPDATE_PLAYER_OPTS',
      opt: Option,
      id: number,
    }
  | {
      type: 'UPDATE_PLAYER_INJURY_ILLNESS_OPTS',
      opts: Array<Option>,
      id: number,
    }
  | { type: 'CLEAR_QUEUED_RECONCILED_DIAGNOSTICS' }
  | {
      type: 'UPDATE_REVIEWED_DIAGNOSTICS',
      queuedReviewedDiagnostic: ReconciledDiagnostic,
    };

export type DiagnosticTabFormContextType = {
  diagnosticTabFormState: DiagnosticTabFormState,
  updateQueuedReconciledDiagnostics: ({
    queuedReconciledDiagnostic: ReconciledDiagnostic,
    index: number,
  }) => void,
  updateRowsToReconcile: ({
    diagnosticId: number,
  }) => void,
  updatePlayerOpts: ({
    opt: Option,
    id: number,
  }) => void,
  updatePlayerInjuryIllnessOpts: ({
    opts: Array<Option>,
    id: number,
  }) => void,
  clearQueuedReconciledDiagnostics: () => void,
  updateReviewedDiagnostics: (
    diagnosticId: number,
    athleteId: number,
    reviewed: boolean
  ) => void,
};

const initialDiagnosticTabFormState: DiagnosticTabFormState = {
  queuedReconciledDiagnostics: [],
  queuedReviewedDiagnostic: [],
  rowsToReconcile: [],
  playerOpts: {},
  playerInjuryIllnessOpts: {},
  isEditing: false,
};

const DEFAULT_DIAGNOSTIC_TAB_CONTEXT_VALUE = {
  diagnosticTabFormState: initialDiagnosticTabFormState,
  updateQueuedReconciledDiagnostics: () => {},
  updateReviewedDiagnostics: () => {},
  updateRowsToReconcile: () => {},
  updatePlayerInjuryIllnessOpts: () => {},
  updatePlayerOpts: () => {},
  clearQueuedReconciledDiagnostics: () => {},
};

const DiagnosticTabFormContext = createContext<DiagnosticTabFormContextType>(
  DEFAULT_DIAGNOSTIC_TAB_CONTEXT_VALUE
);

const DiagnosticTabFormReducer = (
  state: DiagnosticTabFormState = initialDiagnosticTabFormState,
  action: DiagnosticTabFormAction
) => {
  switch (action.type) {
    case 'UPDATE_QUEUED_RECONCILED_DIAGNOSTICS': {
      const copyOfQueuedReconciledDiagnostics =
        state.queuedReconciledDiagnostics.slice();
      copyOfQueuedReconciledDiagnostics[action.index] =
        action.queuedReconciledDiagnostic;

      return {
        ...state,
        queuedReconciledDiagnostics: copyOfQueuedReconciledDiagnostics,
      };
    }

    case 'UPDATE_ROWS_TO_RECONCILE': {
      const newRowsToReconcile = [
        ...state.rowsToReconcile,
        action.diagnosticId,
      ];

      return {
        ...state,
        rowsToReconcile: newRowsToReconcile,
      };
    }

    case 'UPDATE_PLAYER_OPTS': {
      const copyOfPlayerOpts = {
        ...state.playerOpts,
      };
      copyOfPlayerOpts[action.id] = action.opt;

      return {
        ...state,
        playerOpts: copyOfPlayerOpts,
      };
    }

    case 'UPDATE_PLAYER_INJURY_ILLNESS_OPTS': {
      const copyOfPlayerInjuryIllnessOpts = {
        ...state.playerInjuryIllnessOpts,
      };
      copyOfPlayerInjuryIllnessOpts[action.id] = action.opts;

      return {
        ...state,
        playerInjuryIllnessOpts: copyOfPlayerInjuryIllnessOpts,
      };
    }

    case 'CLEAR_QUEUED_RECONCILED_DIAGNOSTICS':
      return initialDiagnosticTabFormState;

    case 'UPDATE_REVIEWED_DIAGNOSTICS': {
      const { diagnosticId, athleteId, reviewed } =
        action.queuedReviewedDiagnostic;

      const existingIndex = state.queuedReviewedDiagnostic.findIndex(
        (item) =>
          item.diagnosticId === diagnosticId && item.athleteId === athleteId
      );
      if (existingIndex !== -1) {
        return {
          ...state,
          queuedReviewedDiagnostic: state.queuedReviewedDiagnostic.map((item) =>
            item.diagnosticId === diagnosticId && item.athleteId === athleteId
              ? { ...item, reviewed }
              : item
          ),
        };
      }
      return {
        ...state,
        queuedReviewedDiagnostic: [
          ...state.queuedReviewedDiagnostic,
          { diagnosticId, athleteId, reviewed },
        ],
      };
    }

    default: {
      return state;
    }
  }
};

const DiagnosticTabFormContextProvider = (props: Props) => {
  const [diagnosticTabFormState, dispatch]: [
    DiagnosticTabFormState,
    Dispatch<DiagnosticTabFormAction>
  ] = useReducer(DiagnosticTabFormReducer, initialDiagnosticTabFormState);

  // Actions
  const updateQueuedReconciledDiagnostics = ({
    queuedReconciledDiagnostic,
    index,
  }) => {
    dispatch({
      type: 'UPDATE_QUEUED_RECONCILED_DIAGNOSTICS',
      queuedReconciledDiagnostic,
      index,
    });
  };

  const updateRowsToReconcile = ({ diagnosticId }) => {
    dispatch({
      type: 'UPDATE_ROWS_TO_RECONCILE',
      diagnosticId,
    });
  };

  const updatePlayerOpts = ({ opt, id }) => {
    dispatch({
      type: 'UPDATE_PLAYER_OPTS',
      opt,
      id,
    });
  };

  const updateReviewedDiagnostics = (diagnosticId, athleteId, reviewed) => {
    dispatch({
      type: 'UPDATE_REVIEWED_DIAGNOSTICS',
      queuedReviewedDiagnostic: { diagnosticId, athleteId, reviewed },
    });
  };

  const updatePlayerInjuryIllnessOpts = ({ opts, id }) => {
    dispatch({
      type: 'UPDATE_PLAYER_INJURY_ILLNESS_OPTS',
      opts,
      id,
    });
  };

  const clearQueuedReconciledDiagnostics = () => {
    dispatch({
      type: 'CLEAR_QUEUED_RECONCILED_DIAGNOSTICS',
    });
  };

  const queuedReconciledDiagnosticsValue = {
    diagnosticTabFormState,
    updateQueuedReconciledDiagnostics,
    updateRowsToReconcile,
    updateReviewedDiagnostics,
    updatePlayerOpts,
    updatePlayerInjuryIllnessOpts,
    clearQueuedReconciledDiagnostics,
  };

  return (
    <DiagnosticTabFormContext.Provider value={queuedReconciledDiagnosticsValue}>
      {props.children}
    </DiagnosticTabFormContext.Provider>
  );
};

const useDiagnosticTabForm = () => useContext(DiagnosticTabFormContext);
export { DiagnosticTabFormContextProvider, useDiagnosticTabForm };
export default DiagnosticTabFormContext;
