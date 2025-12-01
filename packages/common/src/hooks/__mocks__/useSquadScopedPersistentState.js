// @flow
import usePersistentState from './usePersistentState';

// Mock useSquadScopedPersistentState hook
// $FlowIgnore
const useSquadScopedPersistentState = ({ initialState, sessionKey }) => {
  const { state, updateState, resetState } = usePersistentState({
    initialState,
    sessionKey,
  });
  return {
    state,
    updateState,
    resetState,
  };
};

export default useSquadScopedPersistentState;
