// @flow
import type { FormState } from './types';

const buildLocalStorageKey = (settingsKey: string) =>
  `ExportSettings|${settingsKey}`;

const getCache = (settingsKey: string): Object => {
  let filterCache;
  try {
    filterCache =
      window.localStorage.getItem(buildLocalStorageKey(settingsKey)) || '{}';
  } catch (e) {
    filterCache = '{}';
  }

  return JSON.parse(filterCache);
};

export const getCachedField = (
  settingsKey: string,
  fieldKey: $Keys<FormState>
) => getCache(settingsKey)[fieldKey];

export const setCachedField = (
  settingsKey: string,
  fieldKey: $Keys<FormState>,
  fieldValue: $Values<FormState>
) => {
  try {
    const existingCache = getCache(settingsKey);

    window.localStorage.setItem(
      buildLocalStorageKey(settingsKey),
      JSON.stringify({
        ...existingCache,
        [fieldKey]: fieldValue,
      })
    );
  } catch (e) {
    // LocalStorage unavailable
  }
};
