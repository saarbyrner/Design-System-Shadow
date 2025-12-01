// @flow

// SetState is setter of useState.
export type SetState<T> = (newState: T | ((prevState: T) => T)) => void;
