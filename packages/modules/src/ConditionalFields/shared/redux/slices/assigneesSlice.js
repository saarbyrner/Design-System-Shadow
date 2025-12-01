// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type { Assignment } from '../../types';

type AssigneesSlice = {
  editMode: boolean,
  fetchedAssignments: Array<Assignment>,
  assignments: Array<Assignment>,
};

const initialState: AssigneesSlice = {
  editMode: false,
  fetchedAssignments: [],
  assignments: [],
};

export const REDUCER_KEY: string = 'assigneesSlice';

const assigneesSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    updateEditMode: (state: AssigneesSlice, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },
    updateAssignment: (
      state: AssigneesSlice,
      action: PayloadAction<Assignment>
    ) => {
      const index = state.assignments.findIndex(
        (assignment) => assignment.squad_id === action.payload.squad_id
      );
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
    updateFetchedAssignments: (
      state: AssigneesSlice,
      action: PayloadAction<Array<Assignment>>
    ) => {
      state.fetchedAssignments = action.payload;
    },
    updateAssignments: (
      state: AssigneesSlice,
      action: PayloadAction<Array<Assignment>>
    ) => {
      state.assignments = action.payload;
    },
    resetAssignees: (state: AssigneesSlice) => {
      state.editMode = false;
      state.assignments = state.fetchedAssignments;
    },
  },
});

export const {
  updateEditMode,
  updateAssignment,
  updateFetchedAssignments,
  updateAssignments,
  resetAssignees,
} = assigneesSlice.actions;

export const selectEditMode = (state: State) => state.assigneesSlice.editMode;
export const selectFetchedAssignments = (state: State) =>
  state.assigneesSlice.fetchedAssignments;
export const selectAssignments = (state: State) =>
  state.assigneesSlice.assignments;

export default assigneesSlice;
