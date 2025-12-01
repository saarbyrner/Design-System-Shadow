// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type OfficialFormState = {
  firstname: ?string,
  lastname: ?string,
  email: ?string,
  date_of_birth: ?string,
  locale: ?string,
  is_active: ?boolean,
};

type OfficialSlice = {
  formState: OfficialFormState,
};

type OnUpdateAction = {
  payload: $Shape<OfficialFormState>,
};

const initialState: OfficialSlice = {
  formState: {
    firstname: '',
    lastname: '',
    email: '',
    date_of_birth: '',
    locale: '',
    is_active: true,
  },
};

const officialSlice = createSlice({
  name: 'officialSlice',
  initialState,
  reducers: {
    onUpdateForm: (
      state: OfficialSlice,
      action: PayloadAction<OnUpdateAction>
    ) => {
      state.formState = {
        ...state.formState,
        ...action.payload,
      };
    },
    onReset: () => initialState,
  },
});

export const { onUpdateForm, onReset } = officialSlice.actions;
export default officialSlice;
