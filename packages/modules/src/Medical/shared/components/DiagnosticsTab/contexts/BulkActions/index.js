// @flow
import { useContext, createContext, useReducer } from 'react';
import type { Node } from 'react';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { Diagnostic } from '@kitman/modules/src/Medical/shared/types';
import type { Dispatch } from '../../../../types';

export type BulkActionsState = {
  bulkActionsMode: boolean,
  bulkActionsDiagnostics: Array<number>,
  allDiagnosticsChecked: boolean,
  playerHeader: ?Option,
  reasonHeader: ?string,
  injuryIllnessOpts: Array<Option>,
};

type Props = {
  children: Node,
};

export type BulkActionsAction =
  | {
      type: 'UPDATE_BULK_ACTIONS_MODE',
      status: boolean,
    }
  | {
      type: 'UPDATE_SINGLE_DIAGNOSTIC',
      diagnosticId: number,
      checked: boolean,
      diagnosticCount: number,
    }
  | {
      type: 'UPDATE_ALL_DIAGNOSTICS',
      checked: boolean,
      diagnostics: Diagnostic[],
    }
  | {
      type: 'UPDATE_ROWS_TO_RECONCILE',
      diagnosticId: number,
    }
  | {
      type: 'UPDATE_PLAYER_HEADER',
      player: Option,
    }
  | {
      type: 'UPDATE_REASON_HEADER',
      reasonId: string,
    }
  | {
      type: 'UPDATE_INJURY_ILLNESS_OPTS',
      injuryIllnessOpts: Array<Option>,
    }
  | {
      type: 'CLEAR_BULK_ACTIONS',
    };

export type BulkActionsContextType = {
  bulkActionsState: BulkActionsState,
  updateBulkActionsMode: ({
    status: boolean,
  }) => void,
  updateSingleDiagnostic: ({
    diagnosticId: number,
    checked: boolean,
    diagnosticCount: number,
  }) => void,
  updateAllDiagnostics: ({
    checked: boolean,
    diagnostics: Diagnostic[],
  }) => void,
  updatePlayerHeader: ({
    player: Option,
  }) => void,
  updateReasonHeader: ({
    reasonId: string,
  }) => void,
  updateInjuryIllnessOpts: ({
    injuryIllnessOpts: Array<Option>,
  }) => void,
  clearBulkActions: () => void,
};

const initialBulkActionsState: BulkActionsState = {
  bulkActionsMode: false,
  bulkActionsDiagnostics: [],
  allDiagnosticsChecked: false,
  playerHeader: null,
  reasonHeader: null,
  injuryIllnessOpts: [],
};

const DEFAULT_BULK_ACTIONS_CONTEXT_VALUE = {
  bulkActionsState: initialBulkActionsState,
  updateBulkActionsMode: () => {},
  updateSingleDiagnostic: () => {},
  updateAllDiagnostics: () => {},
  updatePlayerHeader: () => {},
  updateReasonHeader: () => {},
  updateInjuryIllnessOpts: () => {},
  clearBulkActions: () => {},
};

const BulkActionsContext = createContext<BulkActionsContextType>(
  DEFAULT_BULK_ACTIONS_CONTEXT_VALUE
);

const BulkActionsReducer = (
  state: BulkActionsState = initialBulkActionsState,
  action: BulkActionsAction
) => {
  switch (action.type) {
    case 'UPDATE_BULK_ACTIONS_MODE': {
      return {
        ...state,
        bulkActionsMode: action.status,
      };
    }

    case 'UPDATE_SINGLE_DIAGNOSTIC': {
      let updateDiagnosticIds = [];
      let allDiagnosticsChecked = false;
      if (action.checked) {
        updateDiagnosticIds = [
          ...state.bulkActionsDiagnostics,
          action.diagnosticId,
        ];
        if (updateDiagnosticIds.length === action.diagnosticCount)
          allDiagnosticsChecked = true;
      } else {
        updateDiagnosticIds = state.bulkActionsDiagnostics.filter(
          (item) => item !== action.diagnosticId
        );
        allDiagnosticsChecked = false;
      }

      return {
        ...state,
        bulkActionsDiagnostics: updateDiagnosticIds,
        allDiagnosticsChecked,
      };
    }

    case 'UPDATE_ALL_DIAGNOSTICS': {
      const updateDiagnosticIds = action.diagnostics?.map((item) => item.id);

      return {
        ...state,
        bulkActionsDiagnostics: action.checked ? updateDiagnosticIds : [],
        allDiagnosticsChecked: action.checked,
      };
    }

    case 'UPDATE_PLAYER_HEADER': {
      return {
        ...state,
        playerHeader: action.player,
      };
    }

    case 'UPDATE_REASON_HEADER': {
      return {
        ...state,
        reasonHeader: action.reasonId,
      };
    }

    case 'UPDATE_INJURY_ILLNESS_OPTS': {
      return {
        ...state,
        injuryIllnessOpts: action.injuryIllnessOpts,
      };
    }

    case 'CLEAR_BULK_ACTIONS': {
      return initialBulkActionsState;
    }

    default: {
      return state;
    }
  }
};

const BulkActionsContextProvider = (props: Props) => {
  const [bulkActionsState, dispatch]: [
    BulkActionsState,
    Dispatch<BulkActionsAction>
  ] = useReducer(BulkActionsReducer, initialBulkActionsState);

  // Actions
  const updateBulkActionsMode = ({ status }) => {
    dispatch({
      type: 'UPDATE_BULK_ACTIONS_MODE',
      status,
    });
  };

  const updateSingleDiagnostic = ({
    diagnosticId,
    checked,
    diagnosticCount,
  }) => {
    dispatch({
      type: 'UPDATE_SINGLE_DIAGNOSTIC',
      diagnosticId,
      checked,
      diagnosticCount,
    });
  };

  const updateAllDiagnostics = ({ checked, diagnostics }) => {
    dispatch({
      type: 'UPDATE_ALL_DIAGNOSTICS',
      checked,
      diagnostics,
    });
  };

  const updatePlayerHeader = ({ player }) => {
    dispatch({
      type: 'UPDATE_PLAYER_HEADER',
      player,
    });
  };

  const updateReasonHeader = ({ reasonId }) => {
    dispatch({
      type: 'UPDATE_REASON_HEADER',
      reasonId,
    });
  };

  const updateInjuryIllnessOpts = ({ injuryIllnessOpts }) => {
    dispatch({
      type: 'UPDATE_INJURY_ILLNESS_OPTS',
      injuryIllnessOpts,
    });
  };

  const clearBulkActions = () => {
    dispatch({
      type: 'CLEAR_BULK_ACTIONS',
    });
  };

  const bulkActionsValue = {
    bulkActionsState,
    updateBulkActionsMode,
    updateSingleDiagnostic,
    updateAllDiagnostics,
    updatePlayerHeader,
    updateReasonHeader,
    updateInjuryIllnessOpts,
    clearBulkActions,
  };

  return (
    <BulkActionsContext.Provider value={bulkActionsValue}>
      {props.children}
    </BulkActionsContext.Provider>
  );
};

const useBulkActions = () => useContext(BulkActionsContext);
export { BulkActionsContextProvider, useBulkActions };
export default BulkActionsContext;
