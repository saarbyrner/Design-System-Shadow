// @flow
import { useCallback, useRef } from 'react';
import _debounce from 'lodash/debounce';

// custom hook to make sure we refer to the same callback instance
// but keep it updated when necessary
const useDebouncedCallback = <T: Function>(
  callback: T,
  delay: number,
  opts: Object = {}
): T => {
  const callbackRef = useRef();
  callbackRef.current = callback;
  // If the return type is set to Function, Flow doesn’t give out. The current
  // return type, T, is set to Function itself, but Flow gives out about this.
  // TODO: remove $FlowIgnore.
  // $FlowIgnore
  return useCallback(
    _debounce((...args) => callbackRef.current?.(...args), delay, opts),
    []
  );
};

export default useDebouncedCallback;
