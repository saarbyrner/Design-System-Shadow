// @flow
import { useContext, createContext, useReducer } from 'react';
import type { Node } from 'react';
import type { Dispatch } from '../../../../types';

type DiagnosticTabEditState = {
  isEditing: boolean,
};

type Props = {
  children: Node,
};

export type DiagnosticTabEditAction = { type: 'TOGGLE_EDIT' };

export type DiagnosticTabEditContextType = {
  diagnosticTabEditState: DiagnosticTabEditState,
  toggleEdit: () => void,
};

const initialDiagnosticTabEditState: DiagnosticTabEditState = {
  isEditing: false,
};

const DEFAULT_DIAGNOSTIC_TAB_CONTEXT_VALUE = {
  diagnosticTabEditState: initialDiagnosticTabEditState,
  toggleEdit: () => {},
};

const DiagnosticTabEditContext = createContext<DiagnosticTabEditContextType>(
  DEFAULT_DIAGNOSTIC_TAB_CONTEXT_VALUE
);

const DiagnosticTabEditReducer = (
  state: DiagnosticTabEditState = initialDiagnosticTabEditState,
  action: DiagnosticTabEditAction
) => {
  switch (action.type) {
    case 'TOGGLE_EDIT':
      return {
        ...state,
        isEditing: !state.isEditing,
      };

    default: {
      return state;
    }
  }
};

const DiagnosticTabEditContextProvider = (props: Props) => {
  const [diagnosticTabEditState, dispatch]: [
    DiagnosticTabEditState,
    Dispatch<DiagnosticTabEditAction>
  ] = useReducer(DiagnosticTabEditReducer, initialDiagnosticTabEditState);

  // Actions

  const toggleEdit = () => {
    dispatch({
      type: 'TOGGLE_EDIT',
    });
  };

  const diagnosticTabEditStateValue = {
    diagnosticTabEditState,
    toggleEdit,
  };

  return (
    <DiagnosticTabEditContext.Provider value={diagnosticTabEditStateValue}>
      {props.children}
    </DiagnosticTabEditContext.Provider>
  );
};

const useDiagnosticTabEdit = () => useContext(DiagnosticTabEditContext);
export { DiagnosticTabEditContextProvider, useDiagnosticTabEdit };
export default DiagnosticTabEditContext;
