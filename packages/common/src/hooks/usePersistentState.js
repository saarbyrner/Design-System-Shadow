// @flow
import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export const STATE_IDENTIFIER = 'persistentState';

const saveToSessionStorage = (id: string, value: string) => {
  try {
    sessionStorage?.setItem(id, value);
  } catch {
    // ignore
  }
};

const getFromSessionStorage = (id: string): ?string => {
  try {
    return sessionStorage?.getItem(`${id}`);
  } catch (error) {
    return null;
  }
};

const serializeState = (value: Object): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return '{}';
  }
};

const deserializeState = (value: string): Object => {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

const getPersistentStateFromUrl = (): Object => {
  const searchParams = getSearchParams();
  const encodedState = searchParams.get(STATE_IDENTIFIER);
  if (!encodedState) {
    return {};
  }
  return deserializeState(encodedState);
};

const getPersistentStateFromSession = (sessionKey: string): Object => {
  const existing = deserializeState(
    getFromSessionStorage(STATE_IDENTIFIER) || '{}'
  );
  return existing[sessionKey] || {};
};

const saveToPersistentState = (namespace: string, value: Object) => {
  const existing = deserializeState(
    getFromSessionStorage(STATE_IDENTIFIER) || '{}'
  );
  existing[namespace] = value;
  saveToSessionStorage(STATE_IDENTIFIER, serializeState(existing));
};

const removeFromPersistentState = (namespace: string) => {
  const existing = deserializeState(
    getFromSessionStorage(STATE_IDENTIFIER) || '{}'
  );
  delete existing[namespace];
  saveToSessionStorage(STATE_IDENTIFIER, serializeState(existing));
};

const setSearchParams = (searchParams: URLSearchParams) => {
  const search = searchParams.toString();
  const newUrl = `${window.location.pathname}${search ? `?${search}` : ''}${
    window.location.hash
  }`;
  window.history.replaceState(null, '', newUrl);
};

export type ReturnType<TState: Object> = {
  state: TState,
  updateState: (partialState: $Shape<TState>) => void,
  resetState: () => void,
};

const usePersistentState = <TState: Object>({
  initialState,
  sessionKey,
  enablePersistence = true,
  excludeKeys = [],
}: {
  initialState: TState,
  sessionKey?: string,
  enablePersistence?: boolean,
  excludeKeys?: Array<$Keys<TState>>,
}): ReturnType<TState> => {
  const initialStateRef = useRef(initialState);
  const [state, setState] = useState<TState>((): TState => {
    if (!enablePersistence) {
      return initialStateRef.current;
    }

    // if url filters are not empty, return them
    const urlState = getPersistentStateFromUrl();
    if (Object.keys(urlState).length > 0) {
      return { ...initialStateRef.current, ...urlState };
    }

    // if there are no url filters and sessionKey is provided, check if there are filters in session storage
    if (sessionKey) {
      const sessionState = getPersistentStateFromSession(sessionKey);
      if (sessionState && Object.keys(sessionState).length > 0) {
        return { ...initialStateRef.current, ...sessionState };
      }
    }

    // if there are no url filters and no filters in session storage, return initial filters
    return initialStateRef.current;
  });

  // Sync URL params with session storage on mount if there are no filters in the URL and sessionKey is provided
  useEffect(() => {
    if (sessionKey && enablePersistence) {
      const sessionState = getPersistentStateFromSession(sessionKey);
      const searchParams = getSearchParams();
      // Only sync if URL doesn't already have persistentState
      if (
        !searchParams.get(STATE_IDENTIFIER) &&
        sessionState &&
        Object.keys(sessionState).length > 0
      ) {
        searchParams.set(STATE_IDENTIFIER, serializeState(sessionState));
        setSearchParams(searchParams);
      }
    }
  }, []);

  useEffect(() => {
    if (!enablePersistence) {
      return;
    }

    // only store keys that have changed
    const cleanState = Object.fromEntries(
      Object.entries(state).filter(([key, value]) => {
        return (
          !isEqual(initialStateRef.current[key], value) &&
          !excludeKeys.includes(key)
        );
      })
    );

    const encoded = serializeState(cleanState);

    const searchParams = getSearchParams();
    const hasStateChanged = Object.keys(cleanState).length > 0;
    if (hasStateChanged) {
      searchParams.set(STATE_IDENTIFIER, encoded);
      // eslint-disable-next-line no-unused-expressions
      sessionKey && saveToPersistentState(sessionKey, cleanState);
    } else {
      searchParams.delete(STATE_IDENTIFIER);
      // eslint-disable-next-line no-unused-expressions
      sessionKey && removeFromPersistentState(sessionKey);
    }
    setSearchParams(searchParams);
  }, [state]);

  const updateState = (partialState: $Shape<TState>) => {
    let newState: TState = { ...state };
    setState((prevState: $Shape<TState>): $Shape<TState> => {
      newState = { ...prevState, ...partialState };
      return newState;
    });
  };

  const resetState = () => {
    setState(initialStateRef.current);

    if (!enablePersistence) {
      return;
    }

    const searchParams = getSearchParams();
    searchParams.delete(STATE_IDENTIFIER);
    setSearchParams(searchParams);

    if (sessionKey) {
      removeFromPersistentState(sessionKey);
    }
  };

  return { state, updateState, resetState };
};

export default usePersistentState;
