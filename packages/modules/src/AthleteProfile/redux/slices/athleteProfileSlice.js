// @flow
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThirdPartySettings = {
  [key: string]: string | null,
};

export type AthleteProfileState = {
  thirdPartySettings: ThirdPartySettings,
};

export const initialState: AthleteProfileState = {
  thirdPartySettings: {},
};

export const REDUCER_KEY: string = 'athleteProfileSlice';

type OnUpdateSettingFieldAction = {
  payload: {
    [key: string]: string,
  },
};

const athleteProfileSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onBuildThirdPartySettingsState: (
      state: AthleteProfileState,
      action: PayloadAction<Array<{ name: string, value: string, key: string }>>
    ) => {
      state.thirdPartySettings = action.payload?.reduce((acc, input) => {
        acc[input.key] = input.value;

        return acc;
      }, {});
    },
    onUpdateSettingField: (
      state: AthleteProfileState,
      action: PayloadAction<OnUpdateSettingFieldAction>
    ) => {
      state.thirdPartySettings = {
        ...state.thirdPartySettings,
        ...action.payload,
      };
    },
    onReset: () => initialState,
  },
});

export const { onBuildThirdPartySettingsState, onUpdateSettingField, onReset } =
  athleteProfileSlice.actions;

export default athleteProfileSlice;
