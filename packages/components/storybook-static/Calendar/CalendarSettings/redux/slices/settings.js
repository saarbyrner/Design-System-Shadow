/* eslint-disable no-param-reassign */
// @flow
import type { Dispatch } from 'redux';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { reducerKey } from '../consts';
import type { Settings, SetSettingsActionPayload } from '../types';
import { initialSettings } from '../../utils/consts';

export const settingsSlice = createSlice({
  name: reducerKey,
  initialState: {},
  reducers: {
    setSettings: (
      state: Settings,
      { payload: { key, value } }
    ): PayloadAction<SetSettingsActionPayload> => {
      state[key] = value;
    },
    setInitialSettings: (
      state: Settings,
      { payload }
    ): PayloadAction<Settings> => {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
  },
});

export const { setSettings, setInitialSettings } = settingsSlice.actions;

export const fetchSettings = async (dispatch: Dispatch) => {
  // Placeholder for the backend request that will fetch the settings
  const promise = new Promise((resolve) => {
    resolve({
      ...initialSettings,
    });
  });
  const initialSettingsFromDB = await promise;
  dispatch(setInitialSettings(initialSettingsFromDB));
};

export default settingsSlice.reducer;
