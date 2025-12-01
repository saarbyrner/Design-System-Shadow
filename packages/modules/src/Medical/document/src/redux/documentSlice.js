// @flow
import { createSlice } from '@reduxjs/toolkit';

const medicalDocumentSlice = createSlice({
  name: 'medicalDocument',
  initialState: {
    requestDocumentData: false,
  },
  reducers: {
    setRequestDocumentData: (state, action) => {
      state.requestDocumentData = action.payload;
    },
  },
});

export const { setRequestDocumentData } = medicalDocumentSlice.actions;

export default medicalDocumentSlice;
