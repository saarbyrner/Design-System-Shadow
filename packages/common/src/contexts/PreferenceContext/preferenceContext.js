// @flow
import type { Node } from 'react';
import { createContext, useContext } from 'react';
import { useGetPreferencesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { PreferenceContextType } from './types';
import ALL_PREFERENCES, {
  NUMERIC_PREFERENCES,
  BOOLEAN_PREFERENCES,
} from './utils';

export const DEFAULT_CONTEXT_VALUE: PreferenceContextType = {
  preferences: Object.fromEntries(
    ALL_PREFERENCES.map((key) => {
      if (NUMERIC_PREFERENCES.includes(key)) {
        return [key, 0];
      }

      if (BOOLEAN_PREFERENCES.includes(key)) {
        return [key, false];
      }

      return [key, null];
    })
  ),
  isPreferencesFetching: false,
  isPreferencesLoading: false,
  isPreferencesError: false,
  isPreferencesSuccess: false,
};

type ProviderProps = {
  children: Node,
};

const PreferenceContext = createContext<PreferenceContextType>(
  DEFAULT_CONTEXT_VALUE
);

const PreferencesProvider = ({ children }: ProviderProps) => {
  const {
    data: preferences,
    isFetching: isPreferencesFetching,
    isLoading: isPreferencesLoading,
    isError: isPreferencesError,
    isSuccess: isPreferencesSuccess,
  } = useGetPreferencesQuery(ALL_PREFERENCES);

  const preferencesValues: PreferenceContextType = {
    preferences,
    isPreferencesFetching,
    isPreferencesLoading,
    isPreferencesError,
    isPreferencesSuccess,
  };

  return (
    <PreferenceContext.Provider value={preferencesValues}>
      {children}
    </PreferenceContext.Provider>
  );
};

export const usePreferences = (): PreferenceContextType =>
  useContext(PreferenceContext);

export { PreferencesProvider };
export default PreferenceContext;
