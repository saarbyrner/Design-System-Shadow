// @flow
import { createSlice } from '@reduxjs/toolkit';

export const phiModalSlice = createSlice({
  name: 'phiModal',
  initialState: {
    show: true,
  },
  reducers: {
    set: (state) => {
      state.show = !state.show;
    },
  },
});

export const { set } = phiModalSlice.actions;

export default phiModalSlice;
