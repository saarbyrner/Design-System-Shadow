// @flow
import { useDispatch, useSelector } from 'react-redux';

import { getSettingsFactory } from '../redux/Selectors/settings';
import { setSettings as setSettingsAction } from '../redux/slices/settings';
import type { SettingsKey, SettingsValue } from '../redux/types';

export type SetSettings = (newValue: SettingsValue) => void;

export const useSettings = (settingsKey: SettingsKey) => {
  const dispatch = useDispatch();
  const settings = useSelector(getSettingsFactory(settingsKey));
  const setSettings: SetSettings = (newValue: SettingsValue) => {
    const updateAction = { key: settingsKey, value: newValue };
    dispatch(setSettingsAction(updateAction));
  };
  return { settings, setSettings };
};
