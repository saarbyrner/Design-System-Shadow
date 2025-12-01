// @flow
import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import usePersistentState, {
  type ReturnType as UsePersistentStateReturnType,
} from './usePersistentState';

/**
 * A wrapper around usePersistentState that automatically scopes session storage
 * to the current active squad ID.
 *
 * This hook should be used when you want to store state in session storage
 * that is specific to the current squad context. When the squad changes,
 * the state will be isolated and won't interfere with other squads' data.
 * @example
 * const { state, updateState, resetState } = useSquadScopedPersistentState({
 *   initialState: { test: 'test' },
 *   sessionKey: 'test',
 * });
 * // This will create session storage key like this: squad[1]:test
 */

export const useSquadScopedPersistentState = <TState: Object>({
  initialState,
  sessionKey,
  enablePersistence = true,
  excludeKeys = [],
}: {
  initialState: TState,
  sessionKey?: string,
  enablePersistence?: boolean,
  excludeKeys?: Array<$Keys<TState>>,
}): UsePersistentStateReturnType<TState> => {
  const { data: activeSquad } = useGetActiveSquadQuery(undefined, {
    skip: !sessionKey,
  });

  const activeSquadId = activeSquad?.id;
  const squadScopedSessionKey =
    activeSquadId && sessionKey
      ? `squad[${activeSquadId}]:${sessionKey}`
      : undefined;
  const { state, updateState, resetState } = usePersistentState({
    initialState,
    sessionKey: squadScopedSessionKey,
    enablePersistence,
    excludeKeys,
  });
  return { state, updateState, resetState };
};

export default useSquadScopedPersistentState;
