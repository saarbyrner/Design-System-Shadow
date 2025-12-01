// @flow
import { useState } from 'react';

// Mock usePersistentState hook
// $FlowIgnore
const usePersistentState = ({ initialState }) => {
  const [state, setState] = useState(initialState);

  // $FlowIgnore
  const updateState = (partialState) => {
    setState((prevState) => ({
      ...prevState,
      ...partialState,
    }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return {
    state,
    updateState,
    resetState,
  };
};

export default usePersistentState;
