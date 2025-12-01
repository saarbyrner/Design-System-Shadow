// @flow
import { createSelector } from '@reduxjs/toolkit';
import { reducerKey } from '../consts';
import type { Store, SettingsKey } from '../types';
import { initialSettings } from '../../utils/consts';

export const getSettings = (store: { [typeof reducerKey]: Store }) => {
  return store[reducerKey] || initialSettings;
};

export const getSettingsFactory = (settingsKey: SettingsKey) =>
  createSelector([getSettings], (settings) => settings[settingsKey]);
