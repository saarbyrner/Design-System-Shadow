// @flow
import type { Node } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import type { Orientation, PageSize } from '../types';

export type Settings = {
  orientation: Orientation,
  size: PageSize,
};
export type SettingsKey = $Keys<Settings>;
export type SettingsValue = $Values<Settings>;
export type SettingsContextType = {
  settings: Settings,
  fieldValue: (key: SettingsKey) => SettingsValue,
  onFieldValueChange: (key: SettingsKey, value: SettingsValue) => void,
};

export const DEFAULT_CONTEXT_VALUE: SettingsContextType = {};

const SettingsContext = createContext<SettingsContextType>(
  DEFAULT_CONTEXT_VALUE
);

type SettingsContextProviderProps = {
  children: Node,
};

const SettingsContextProvider = ({
  children,
}: SettingsContextProviderProps) => {
  const [settings, setSettings] = useState<Settings>({
    orientation: 'portrait',
    size: 'a4',
  });
  const fieldValue = useCallback(
    (key: SettingsKey) => settings[key],
    [settings]
  );
  const onFieldValueChange = (key: SettingsKey, value: SettingsValue) =>
    setSettings((state) => ({
      ...state,
      [`${key}`]: value,
    }));
  const value: SettingsContextType = {
    settings,
    fieldValue,
    onFieldValueChange,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType =>
  useContext(SettingsContext);

export { SettingsContextProvider };
export default SettingsContext;
