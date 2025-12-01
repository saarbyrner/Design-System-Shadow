// @flow
import _pick from 'lodash/pick';

/**
 * Pass thru scopeToDropdownType (PLAYER_SELECTOR|FILTER | PLAYER_SELECTOR|FILTER )
 * Save filter keys at one of those three levels in localStorage
 */

type ScopeToDropdownType =
  | 'PLAYER_SELECTOR|FILTER'
  | 'PLAYER_SELECTOR|GROUPING';

const getPlayerSelectorFilters = ({
  scopeToDropdownType,
}: {
  scopeToDropdownType: ScopeToDropdownType,
}) => {
  const LOCAL_STORAGE_KEY = scopeToDropdownType;
  let filters;
  try {
    filters = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    filters = '{}';
  }

  return JSON.parse(filters);
};

const setPlayerSelectorFilters = ({
  value,
  scopeToDropdownType,
}: {
  value: Object,
  scopeToDropdownType: ScopeToDropdownType,
}) => {
  const LOCAL_STORAGE_KEY = scopeToDropdownType;
  try {
    const currState = JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_KEY)
    );
    const newState = { ...currState, ...value };
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  } catch (e) {
    // Local / Session storage unavailable
  }
};

export const getPersistedPlayerSelectorFilters = ({
  defaultValues,
  fields,
  scopeToDropdownType,
}: {
  defaultValues: Object,
  fields: Array<string>,
  scopeToDropdownType: ScopeToDropdownType,
}) => {
  const storageValues = _pick(
    getPlayerSelectorFilters({ scopeToDropdownType }),
    fields
  );

  return { ...defaultValues, ...storageValues };
};

export const setPersistedPlayerSelectorFilters = ({
  fields,
  newValues,
  scopeToDropdownType,
}: {
  fields: Array<string>,
  newValues: Object,
  scopeToDropdownType: ScopeToDropdownType,
}) => {
  const updatedValues = _pick(newValues, fields);
  const existingValues = getPersistedPlayerSelectorFilters({
    defaultValues: {},
    fields,
    scopeToDropdownType,
  });

  setPlayerSelectorFilters({
    value: { ...existingValues, ...updatedValues },
    scopeToDropdownType,
  });
};
