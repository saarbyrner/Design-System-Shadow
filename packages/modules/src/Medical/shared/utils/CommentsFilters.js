// @flow
import _pick from 'lodash/pick';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';

const SESSION_STORAGE_KEY = 'CommentsFilters';

/**
 * Pass thru scopeToLevel (Roster / Athlete / Issue)
 * Save filter keys at one of those three levels in localStorage
 */
const getCommentsFilters = (scopeToLevel?: string) => {
  if (getIsLocalStorageAvailable()) {
    const LOCAL_STORAGE_KEY = scopeToLevel;
    let filters;
    try {
      filters = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      filters = '{}';
    }

    return JSON.parse(filters);
  }
  return null;
};

const setCommentsFilters = (value: Object, scopeToLevel?: string) => {
  const LOCAL_STORAGE_KEY = scopeToLevel;
  if (getIsLocalStorageAvailable()) {
    try {
      if (scopeToLevel) {
        const currState = JSON.parse(
          window.localStorage.getItem(LOCAL_STORAGE_KEY)
        );
        const newState = { ...currState, ...value };
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(newState)
        );
      } else {
        const currState = JSON.parse(
          window.localStorage.getItem(SESSION_STORAGE_KEY)
        );
        const newState = { ...currState, ...value };

        window.sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(newState)
        );
      }
    } catch (e) {
      // Local / Session storage unavailable
    }
  }
};

export const getPersistedCommentsFilters = (
  defaultValues: Object = {},
  fields: Array<string>,
  scopeToLevel?: string
) => {
  if (getIsLocalStorageAvailable()) {
    const storageValues = scopeToLevel
      ? _pick(getCommentsFilters(scopeToLevel), fields)
      : _pick(getCommentsFilters(), fields);

    return { ...defaultValues, ...storageValues };
  }
  return { ...defaultValues };
};

export const setPersistedCommentsFilters = (
  fields: Array<string>,
  newValues: Object,
  scopeToLevel?: string
) => {
  if (getIsLocalStorageAvailable()) {
    const updatedValues = _pick(newValues, fields);
    const existingValues = scopeToLevel
      ? getPersistedCommentsFilters({}, fields, scopeToLevel)
      : getPersistedCommentsFilters({}, fields);

    setCommentsFilters({ ...existingValues, ...updatedValues }, scopeToLevel);
  }
};
