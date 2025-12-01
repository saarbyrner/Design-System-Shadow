// @flow
import _pick from 'lodash/pick';

const SESSION_STORAGE_KEY = 'MedicalFilters';

/**
 * Pass thru scopeToLevel (Roster / Athlete / Issue)
 * Save filter keys at one of those three levels in localStorage
 */
const getMedicalFilters = (scopeToLevel?: string) => {
  const LOCAL_STORAGE_KEY = scopeToLevel;
  let filters;
  try {
    filters = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    filters = '{}';
  }

  return JSON.parse(filters);
};

const setMedicalFilters = (value: Object, scopeToLevel?: string) => {
  const LOCAL_STORAGE_KEY = scopeToLevel;

  try {
    if (scopeToLevel) {
      const currState = JSON.parse(
        window.localStorage.getItem(LOCAL_STORAGE_KEY)
      );
      const newState = { ...currState, ...value };
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } else {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(value));
    }
  } catch (e) {
    // Local / Session storage unavailable
  }
};

export const getPersistedMedicalFilters = (
  defaultValues: Object = {},
  fields: Array<string>,
  scopeToLevel?: string
) => {
  const storageValues = scopeToLevel
    ? _pick(getMedicalFilters(scopeToLevel), fields)
    : _pick(getMedicalFilters(), fields);

  return { ...defaultValues, ...storageValues };
};

export const setPersistedMedicalFilters = (
  fields: Array<string>,
  newValues: Object,
  scopeToLevel?: string
) => {
  const updatedValues = _pick(newValues, fields);
  const existingValues = scopeToLevel
    ? getPersistedMedicalFilters({}, fields, scopeToLevel)
    : getPersistedMedicalFilters({}, fields);

  setMedicalFilters({ ...existingValues, ...updatedValues }, scopeToLevel);
};
